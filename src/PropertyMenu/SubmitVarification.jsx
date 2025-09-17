// screens/SubmitSummaryScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import HeaderNavigation from '../Components/HeaderNavigation';
import axios from 'axios';
import { PROPERTY_API } from '../api/apiRoutes';
import { getToken } from '../utils/auth';
import ImageResizer from 'react-native-image-resizer';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const SubmitVarification = ({ route }) => {
  // const photos = ['left', 'rignt', 'front'];

  const { submissionData, location, left, right, front, id, data } =
    route.params;
  const { floorIds } = route.params || {};

  // console.log('Floor IDs in SubmitVarification:', data);
  const photos = [
    { label: 'left side', ...left },
    { label: 'right side', ...right },
    { label: 'front side', ...front },
  ];

  // convert "September 2025" → "2025-09"
  const convertMonthYear = str => {
    if (!str) return null;
    const months = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };

    const [monthName, year] = str.split(' ');
    const month = months[monthName.toLowerCase()];
    return month && year ? `${year}-${month}` : null;
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      // 1️⃣ Prepare Floors
      const finalFloors =
        (submissionData?.extraFloors?.length > 0
          ? submissionData.extraFloors.map(floor => ({
              safFloorDetailId: floor.safFloorDetailId || 0,
              builtupArea: Number(floor.builtupArea ?? 0),
              dateFrom: convertMonthYear(floor.dateFrom),
              dateUpto: convertMonthYear(floor.dateUpto),
              floorMasterId: floor.floorMasterId
                ? String(floor.floorMasterId)
                : null,
              usageTypeMasterId: floor.usageTypeMasterId
                ? String(floor.usageTypeMasterId)
                : null,
              constructionTypeMasterId: floor.constructionTypeMasterId
                ? String(floor.constructionTypeMasterId)
                : null,
              occupancyTypeMasterId: floor.occupancyTypeMasterId
                ? String(floor.occupancyTypeMasterId)
                : null,
            }))
          : floorIds.map(floor => ({
              safFloorDetailId: floor.id,
              builtupArea: Number(floor.builtupArea ?? 0),
              carpetArea: Number(floor.carpetArea ?? 0),
              dateFrom: floor.dateFrom,
              dateUpto: floor.dateUpto,
              floorMasterId: floor.floorMasterId
                ? String(floor.floorMasterId)
                : null,
              usageTypeMasterId: floor.usageTypeMasterId
                ? String(floor.usageTypeMasterId)
                : null,
              constructionTypeMasterId: floor.constructionTypeMasterId
                ? String(floor.constructionTypeMasterId)
                : null,
              occupancyTypeMasterId: floor.occupancyTypeMasterId
                ? String(floor.occupancyTypeMasterId)
                : null,
              floorName: floor.floorName || null,
              usageType: floor.usageType || null,
              occupancyName: floor.occupancyName || null,
              constructionType: floor.constructionType || null,
            }))) || [];

      const fieldPayload = {
        safDetailId: id,
        wardMstrId: submissionData?.wardMstrId,
        newWardMstrId: submissionData?.newWardMstrId,
        propTypeMstrId:
          submissionData?.propTypeMstrId || submissionData?.propertyTypeId,
        zoneMstrId: submissionData?.zoneMstrId,
        roadWidth: submissionData?.roadWidth,
        areaOfPlot: submissionData?.areaOfPlot,
        isMobileTower: submissionData?.isMobileTower,
        isHoardingBoard: submissionData?.isHoardingBoard,
        isPetrolPump: submissionData?.isPetrolPump,
        isWaterHarvesting: submissionData?.isWaterHarvesting,

        // ✅ Hoarding details (only if true)
        hoardingArea: submissionData?.isHoardingBoard
          ? Number(submissionData?.hoardingArea || 0.1)
          : null,
        hoardingInstallationDate: submissionData?.isHoardingBoard
          ? submissionData?.hoardingInstallationDate ||
            new Date().toISOString().split('T')[0]
          : null,

        floorDtl: finalFloors,
        ...((data.propertyTypeId === 4 || data.propTypeMstrId === 4) && {
          landOccupationDate:
            data.landOccupationDate || new Date().toISOString().split('T')[0],
        }),
      };

      const response = await axios.post(
        PROPERTY_API.FIELD_VARIFICATION_API,
        fieldPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        },
      );
      console.log('Field Verification Response:', response.data);
      Alert.alert('Success', 'Field Verification Data submitted successfully!');
      console.log(
        JSON.stringify(
          {
            message: 'Field Verification Data submitted',
            payload: fieldPayload,
          },
          null,
          2,
        ),
      );

      const resizedPhotos = await Promise.all(
        photos.map(async photo => {
          if (!photo.uri) return null;
          const resized = await ImageResizer.createResizedImage(
            photo.uri,
            1024,
            1024,
            'JPEG',
            80,
          );
          return {
            label: photo.label, // ✅ preserve label
            uri: resized.uri,
            fileName:
              photo.fileName || `${photo.label.replace(/\s+/g, '_')}.jpg`,
            type: 'image/jpeg',
          };
        }),
      );

      // 4️⃣ Build FormData for GeoTag + Images
      const formData = new FormData();
      formData.append('id', id);
      const geoTagArray = resizedPhotos.filter(Boolean).map(photo => ({
        latitude: location.latitude,
        longitude: location.longitude,
        direction: photo.label, // ✅ send "left side" | "right side" | "front side"
        document: photo,
      }));

      // Ensure at least 3 items
      while (geoTagArray.length < 3) {
        geoTagArray.push({
          latitude: location.latitude,
          longitude: location.longitude,
          direction: 'N',
          document: resizedPhotos[0] || null,
        });
      }

      // Append geoTag with actual files
      geoTagArray.forEach((item, index) => {
        formData.append(`geoTag[${index}][latitude]`, item.latitude);
        formData.append(`geoTag[${index}][longitude]`, item.longitude);
        formData.append(`geoTag[${index}][direction]`, item.direction);
        formData.append(`geoTag[${index}][document]`, {
          uri: item.document.uri,
          type: item.document.type || 'image/jpeg',
          name: item.document.fileName,
        });
      });

      // Append images separately if backend expects it
      resizedPhotos.forEach((photo, index) => {
        if (!photo) return;
        formData.append('images', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.fileName,
        });
      });

      // 5️⃣ Submit GeoTag + Images
      const geoRes = await axios.post(
        PROPERTY_API.GEOTAGING_IMAGE_API,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          timeout: 20000,
        },
      );

      Alert.alert('Success', 'Data & Images submitted successfully!');
      console.log('Geo-Tagging Success:', geoRes.data);
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Submission failed. Please try again.');
    }
  };

  // Debugging on mount
  useEffect(() => {
    console.log('Submission Data:', submissionData);
    console.log('Location:', location);
    console.log('left 1:', left);
    console.log('right 2:', right);
    console.log('front 3:', front);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderNavigation />
      <Text style={styles.title}>Submitted Data</Text>

      {/* Property Details */}
      <Card title="Property Details">
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Ward No:</Text>{' '}
          {submissionData?.['Ward No']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Verified:</Text>{' '}
          {submissionData?.['Verified_Ward']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>New Ward No:</Text>{' '}
          {submissionData?.['New Ward No (Current)']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Verified:</Text>{' '}
          {submissionData?.['Verified_NewWard']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Zone:</Text>{' '}
          {submissionData?.['Zone (Current)']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Verified:</Text>{' '}
          {submissionData?.['Verified_Zone']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Property Type:</Text>{' '}
          {submissionData?.['Property Type (Current)']}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Verified:</Text>{' '}
          {submissionData?.['Verified_PropertyType']}
        </Text>
      </Card>

      {/* Parking Details */}
      {(submissionData?.['Usage Type (Parking Current)'] ||
        submissionData?.['Occupancy Type (Parking Current)'] ||
        submissionData?.['Construction Type (Parking Current)'] ||
        submissionData?.['Built-up Area (Parking Current)']) && (
        <Card title="Parking Details">
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Usage Type:</Text>{' '}
            {submissionData?.['Usage Type (Parking Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Occupancy Type:</Text>{' '}
            {submissionData?.['Occupancy Type (Parking Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Construction Type:</Text>{' '}
            {submissionData?.['Construction Type (Parking Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Built-up Area:</Text>{' '}
            {submissionData?.['Built-up Area (Parking Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Date From:</Text>{' '}
            {submissionData?.['Date From (Parking Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Date To:</Text>{' '}
            {submissionData?.['Date To (Parking Current)']}
          </Text>
        </Card>
      )}

      {/* Basement Details */}
      {(submissionData?.['Usage Type (Basement Current)'] ||
        submissionData?.['Occupancy Type (Basement Current)'] ||
        submissionData?.['Construction Type (Basement Current)'] ||
        submissionData?.['Built-up Area (Basement Current)']) && (
        <Card title="Basement Details">
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Usage Type:</Text>{' '}
            {submissionData?.['Usage Type (Basement Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Occupancy Type:</Text>{' '}
            {submissionData?.['Occupancy Type (Basement Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Construction Type:</Text>{' '}
            {submissionData?.['Construction Type (Basement Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Built-up Area:</Text>{' '}
            {submissionData?.['Built-up Area (Basement Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Date From:</Text>{' '}
            {submissionData?.['Date From (Basement Current)']}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Date To:</Text>{' '}
            {submissionData?.['Date To (Basement Current)']}
          </Text>
        </Card>
      )}

      {/* Extra Floors */}
      {submissionData?.extraFloors?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Extra Floors</Text>
          {submissionData.extraFloors.map((floor, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Floor {index + 1}</Text>
              <Text>Floor Name: {floor.floorName}</Text>
              <Text>Construction Type: {floor.constructionType}</Text>
              <Text>Occupancy Type: {floor.occupancyType}</Text>
              <Text>Usage Type: {floor.usageType}</Text>
              <Text>From Date: {floor.fromDate}</Text>
              <Text>To Date: {floor.toDate}</Text>
            </View>
          ))}
        </>
      )}

      {/* Location */}
      <Text style={styles.sectionTitle}>Location</Text>
      {location ? (
        <View>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      ) : (
        <Text>No location data</Text>
      )}

      {/* Photos */}
      <Text style={styles.sectionTitle}>Captured Photos</Text>
      {photos.map((photo, index) =>
        photo.uri ? (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{photo.label}</Text>
            <Image source={{ uri: photo.uri }} style={styles.image} />
          </View>
        ) : (
          <Text key={index}>{photo.label} not captured</Text>
        ),
      )}

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SubmitVarification;

const styles = StyleSheet.create({
  submitButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e86de',
  },
  image: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 8,

    // Border
    borderWidth: 1,
    borderColor: '#560606ff', // change to any color you like

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow (Android)
    elevation: 5,
  },
});
