// screens/SubmitSummaryScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import HeaderNavigation from '../Components/HeaderNavigation';
import axios from 'axios';
import { PROPERTY_API } from '../api/apiRoutes';
import { getToken } from '../utils/auth';
import ImageResizer from 'react-native-image-resizer';
import { useNavigation } from '@react-navigation/native';
import { SAF_API_ROUTES } from '../api/apiRoutes';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const SubmitVarification = ({ route }) => {
  const navigation = useNavigation();
  const { submissionData, location, left, right, front, id, data } =
    route.params;
  const { floorIds } = route.params || {};
  console.log('Submit Veificartii', data);

  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');

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
        hoardingArea: submissionData?.isHoardingBoard
          ? Number(submissionData?.hoardingArea || 0.1)
          : null,
        hoardingInstallationDate: submissionData?.isHoardingBoard
          ? submissionData?.hoardingInstallationDate ||
            new Date().toISOString().split('T')[0]
          : null,
        landOccupationDate:
          submissionData?.['Property Type (Current)'] === 'VACANT LAND' ||
          submissionData?.Verified_PropertyType === 'VACANT LAND'
            ? data?.landOccupationDate || new Date().toISOString().split('T')[0]
            : null,
        floorDtl: finalFloors,
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
      Alert.alert(
        'Success',
        'Data submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => setShowModal(true), // open modal after OK
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Submission failed. Please try again.');
    }
  };

  const handleSendToLevel = async () => {
    try {
      const token = await getToken();
      const payload = {
        id: id,
        remarks: remarks,
        status: 'FORWARD',
      };

      console.log('SendToLevel Payload:', payload);

      const res = await axios.post(SAF_API_ROUTES.SEND_TO_LEVEL_API, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Send to Level Success:', res.data);

      setShowModal(false);

      // Navigate to another page to show all submitted data
      navigation.navigate('SubmitSummaryPage', {
        submissionData,
        location,
        photos,
        remarks,
        id,
      });
    } catch (err) {
      console.error('Send to Level Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to send to level.');
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
    <>
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

        {/* Floor Details */}
        {floorIds?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Floor Details</Text>
            {floorIds.map((floor, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {floor.floorName || `Floor ${index + 1}`} Details
                </Text>
                <Text>Floor Name: {floor.floorName || '-'}</Text>
                <Text>Construction Type: {floor.constructionType || '-'}</Text>
                <Text>Occupancy Type: {floor.occupancyName || '-'}</Text>
                <Text>Usage Type: {floor.usageType || '-'}</Text>
                <Text>Built-up Area: {floor.builtupArea || '-'}</Text>
                <Text>Carpet Area: {floor.carpetArea || '-'}</Text>
                <Text>Date From: {floor.dateFrom || '-'}</Text>
                <Text>Date To: {floor.dateUpto || '-'}</Text>
              </View>
            ))}
          </>
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

      {/* ✅ Modal for Remarks + Send to Level */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Remarks</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your remarks"
              value={remarks}
              onChangeText={setRemarks}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendToLevel}
            >
              <Text style={styles.sendButtonText}>Send to Level</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    borderWidth: 1,
    borderColor: '#560606ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
