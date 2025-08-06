// screens/SubmitSummaryScreen.js
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useEffect } from 'react';

const SubmitVarification = ({ route }) => {
  const {
    submissionData,
    floorsData,
    hasExtraFloors,
    location,
    photo1,
    photo2,
    photo3,
  } = route.params;
  useEffect(() => {
    console.log('--- VerifiedStatus Data ---');
    console.log('submissionData:', submissionData);
    console.log('floorsData:', floorsData);
    console.log('hasExtraFloors:', hasExtraFloors);
    console.log('Extra Floors:', submissionData?.extraFloors);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submitted Data</Text>
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
      Ward and Zone
      {(submissionData?.oldWard ||
        submissionData?.newWard ||
        submissionData?.propertype ||
        submissionData?.zone) && (
        <View>
          <Text style={styles.sectionTitle}>Ward & Zone</Text>
          {submissionData?.oldWard && (
            <Text>Old Ward: {submissionData.oldWard}</Text>
          )}
          {submissionData?.newWard && (
            <Text>New Ward: {submissionData.newWard}</Text>
          )}
          {submissionData?.zone && <Text>Zone: {submissionData.zone}</Text>}
        </View>
      )}
      {/* Basement Section */}
      {(submissionData?.hasBasement || submissionData?.basementUsageType) && (
        <View>
          <Text style={styles.sectionTitle}>Basement</Text>
          {submissionData?.hasBasement && (
            <Text>Has Basement: {submissionData.hasBasement}</Text>
          )}
          {submissionData?.basementUsageType && (
            <Text>Usage: {submissionData.basementUsageType}</Text>
          )}
        </View>
      )}
      {/* Parking Section */}
      {(submissionData?.hasParking || submissionData?.parkingType) && (
        <View>
          <Text style={styles.sectionTitle}>Parking</Text>
          {submissionData?.hasParking && (
            <Text>Has Parking: {submissionData.hasParking}</Text>
          )}
          {submissionData?.parkingType && (
            <Text>Parking Type: {submissionData.parkingType}</Text>
          )}
        </View>
      )}
      {submissionData?.extraFloors?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Extra Floor Details</Text>

          {submissionData.extraFloors.map((floor, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>
                Floor {index + 1}: {floor.floorName}
              </Text>

              <Text style={styles.cardText}>
                Construction Type: {floor.constructionType}
              </Text>
              <Text style={styles.cardText}>
                Occupancy Type: {floor.occupancyType}
              </Text>
              <Text style={styles.cardText}>Usage Type: {floor.usageType}</Text>
              <Text style={styles.cardText}>From Date: {floor.fromDate}</Text>
              <Text style={styles.cardText}>
                To Date: {floor.toDate || 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      )}
      {/* Other Submission Data */}
      <Text style={styles.sectionTitle}>Other Details</Text>
      {submissionData ? (
        Object.entries(submissionData).map(([key, value], index) => {
          if (
            [
              'oldWard',
              'newWard',
              'zone',
              'hasBasement',
              'basementUsageType',
              'hasParking',
              'parkingType',
            ].includes(key)
          )
            return null;
          return (
            <Text key={index}>
              <Text style={{ fontWeight: 'bold' }}>{key}:</Text> {String(value)}
            </Text>
          );
        })
      ) : (
        <Text>No submission data</Text>
      )}
      {/* Captured Photos in Card Style at Bottom */}
      <View>
        <Text style={styles.sectionTitle}>Captured Photos</Text>
        <View style={styles.cardContainer}>
          {[
            { label: 'Front View', photo: photo1 },
            { label: 'Basement', photo: photo2 },
            { label: 'Parking Area', photo: photo3 },
          ].map(({ label, photo }, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{label}</Text>
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.cardImage} />
              ) : (
                <Text style={styles.noPhotoText}>Photo not captured</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SubmitVarification;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  subLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  floorSection: {
    marginTop: 10,
    paddingLeft: 10,
  },
  cardContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  noPhotoText: {
    fontStyle: 'italic',
    color: '#888',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 2,
  },
});
