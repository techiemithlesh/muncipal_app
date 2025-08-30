// screens/SubmitSummaryScreen.js
import React from 'react';
import { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderNavigation from '../Components/HeaderNavigation';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const SubmitVarification = ({ route }) => {
  const { submissionData, location, photo1, photo2, photo3 } = route.params;

  useEffect(() => {
    const fetchFieldVerification = async () => {
      const payload = {
        safDetailId: 51,
        wardMstrId: 3,
        newWardMstrId: 1,
        propTypeMstrId: 1,
        zoneMstrId: 1,
        roadWidth: 20,
        areaOfPlot: 80,
        isMobileTower: false,
        isHoardingBoard: false,
        isPetrolPump: false,
        isWaterHarvesting: false,
        floorDtl: [
          {
            safFloorDetailId: 38,
            builtupArea: 400,
            dateFrom: '2025-05',
            floorMasterId: '4',
            usageTypeMasterId: '13',
            constructionTypeMasterId: '1',
            occupancyTypeMasterId: '1',
          },
        ],
      };

      try {
        const response = await axios.post(FIELD_VERIFICATION_API, payload, {
          headers: {
            'Content-Type': 'application/json',
            // "Authorization": `Bearer ${yourToken}`, // add if required
          },
          timeout: 15000,
        });

        console.log('✅ Field Verification Response:', response.data);
      } catch (error) {
        if (error.response) {
          console.error('❌ API Error:', error.response.data);
        } else if (error.request) {
          console.error('❌ No response from server:', error.request);
        } else {
          console.error('❌ Error:', error.message);
        }
      }
    };

    fetchFieldVerification();
  }, []);

  useEffect(() => {
    console.log('Submission Data:', submissionData);
    console.log('Location:', location);
    console.log('Photo 1:', photo1);
    console.log('Photo 2:', photo2);
    console.log('Photo 3:', photo3);
  }, []);
  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Submission completed');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderNavigation />
      <Text style={styles.title}>Submitted Data</Text>

      {/* Group 1: Ward, New Ward, Zone, Property Type */}
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
          <Text style={{ fontWeight: 'bold' }}>Verified</Text>{' '}
          {submissionData?.['Verified_PropertyType']}
        </Text>
      </Card>

      {/* Group 2: Parking Details */}
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

      {/* Group 3: Basement Details */}
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

      {/* The rest of the data as before */}
      <Text style={styles.sectionTitle}>Location</Text>
      {location ? (
        <View>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      ) : (
        <Text>No location data</Text>
      )}

      <Text style={styles.sectionTitle}>Captured Photos</Text>
      {[photo1, photo2, photo3].map((photo, index) =>
        photo ? (
          <Image key={index} source={{ uri: photo.uri }} style={styles.image} />
        ) : (
          <Text key={index}>Photo {index + 1} not captured</Text>
        ),
      )}
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
