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

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const SubmitVarification = ({ route }) => {
  const { submissionData, location, photo1, photo2, photo3, id } = route.params;
  console.log('submit Varification data', submissionData);

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

      // ✅ Prepare Floors from extraFloors
      const preparedFloors = (submissionData?.extraFloors || []).map(floor => ({
        safFloorDetailId:
          floor.floorNameId != null ? Number(floor.floorNameId) : null,
        builtupArea: Number(floor.builtupArea ?? 0),
        dateFrom: convertMonthYear(floor.fromDate),
        floorMasterId:
          floor.floorNameId != null ? String(floor.floorNameId) : null,
        usageTypeMasterId:
          floor.usageTypeId != null ? String(floor.usageTypeId) : null,
        constructionTypeMasterId:
          floor.constructionTypeId != null
            ? String(floor.constructionTypeId)
            : null,
        occupancyTypeMasterId:
          floor.occupancyTypeId != null ? String(floor.occupancyTypeId) : null,
      }));
      console.log(preparedFloors, 'my floor daat');

      // ✅ Build main payload
      const fieldPayload = {
        safDetailId: id,
        wardMstrId: submissionData?.wardMstrId || 3,
        newWardMstrId: submissionData?.newWardMstrId || 1,
        propTypeMstrId: submissionData?.propTypeMstrId || 1,
        zoneMstrId: submissionData?.zoneMstrId || 1,
        roadWidth: submissionData?.roadWidth || 20,
        areaOfPlot: submissionData?.areaOfPlot || 80,
        isMobileTower: submissionData?.isMobileTower ?? false,
        isHoardingBoard: submissionData?.isHoardingBoard ?? false,
        isPetrolPump: submissionData?.isPetrolPump ?? false,
        isWaterHarvesting: submissionData?.isWaterHarvesting ?? false,
        floorDtl: preparedFloors,
      };

      console.log('📦 Final Payload:', JSON.stringify(fieldPayload, null, 2));

      // ----------------------
      // 1️⃣ Submit Field Verification Data
      // ----------------------
      const fieldRes = await axios.post(
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

      console.log('✅ Field Verification Success:', fieldRes.data);

      // ----------------------
      // 2️⃣ Submit Geo-Tagging Images
      // ----------------------
      const formData = new FormData();
      formData.append('propertyId', id);

      if (location) {
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
      }

      [photo1, photo2, photo3].forEach((photo, index) => {
        if (photo) {
          formData.append('images', {
            uri: photo.uri,
            type: photo.type || 'image/jpeg',
            name: photo.fileName || `photo${index + 1}.jpg`,
          });
        }
      });

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

      console.log('✅ Geo-Tagging Success:', geoRes.data);

      Alert.alert('Success', 'Data & Images submitted successfully!');
    } catch (error) {
      if (error.response) {
        console.error('❌ API Error:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response from server:', error.request);
      } else {
        console.error('❌ Error:', error.message);
      }
      Alert.alert('Error', 'Submission failed. Please try again.');
    }
  };

  // Debugging on mount
  useEffect(() => {
    console.log('Submission Data:', submissionData);
    console.log('Location:', location);
    console.log('Photo 1:', photo1);
    console.log('Photo 2:', photo2);
    console.log('Photo 3:', photo3);
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
      {[photo1, photo2, photo3].map((photo, index) =>
        photo ? (
          <Image key={index} source={{ uri: photo.uri }} style={styles.image} />
        ) : (
          <Text key={index}>Photo {index + 1} not captured</Text>
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
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
});
