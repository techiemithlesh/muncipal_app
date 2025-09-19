import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
  ActivityIndicator, // 👈 Added for loader
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import HeaderNavigation from '../Components/HeaderNavigation';

const VerifiedStatus = ({ route }) => {
  const navigation = useNavigation();
  const { submissionData, floorsData, hasExtraFloors, id, data, floorIds } =
    route.params || {};
  console.log('Floor IDs Data:', data);

  // console.log('Raw floor data:', submissionData.extraFloors);
  const parseDate = str => {
    if (!str) return null;

    // Case 1: MM/YYYY (e.g., "09/2025")
    if (str.includes('/')) {
      const [month, year] = str.split('/');
      return `${year}-${month.padStart(2, '0')}`;
    }

    // Case 2: "September 2025"
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

  console.log('Received ID:', id);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [front, setFront] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false); // 👈 loader state

  /* ---------------- Permissions ---------------- */
  const getCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  /* ---------------- Capture Photo ---------------- */
  const capturePhoto = async photoIndex => {
    const locationPermission = await getLocationPermission();
    if (!locationPermission) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to capture photos with location data.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
          { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
        ],
      );
      return;
    }

    const cameraPermission = await getCameraPermission();
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Camera permission is required to capture photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
          { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
        ],
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        setLocation(pos.coords);
        launchCamera({ mediaType: 'photo' }, res => {
          if (res.didCancel || !res.assets) return;
          const photo = res.assets[0];
          if (photoIndex === 'left') setLeft(photo);
          if (photoIndex === 'right') setRight(photo);
          if (photoIndex === 'front') setFront(photo);
        });
      },
      () => {
        Alert.alert('Location Error', 'Unable to get current location.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
          { text: 'Retry', onPress: () => capturePhoto(photoIndex) },
        ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  /* ---------------- Render Extra Floors ---------------- */
  const renderFloorData = () => {
    if (
      submissionData?.extraFloors &&
      submissionData['Verified_PropertyType'] !== 'VACANT LAND' &&
      submissionData.extraFloors.length > 0
    ) {
      return submissionData.extraFloors.map((floor, floorIndex) => (
        <View
          key={floorIndex}
          style={{
            backgroundColor: '#fff',
            padding: 15,
            marginVertical: 8,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#0f3969',
            }}
          >
            Extra Floor {floorIndex + 1} Details
          </Text>

          {/* Fields in card format */}
          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Floor Type:</Text>
            <Text>{floor.floorName || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Construction Type:</Text>
            <Text>{floor.constructionType || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Occupancy Type:</Text>
            <Text>{floor.occupancyType || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Usage Type:</Text>
            <Text>{floor.usageType || 'N/A'}</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Built-up Area:</Text>
            <Text>{floor.builtupArea || 'N/A'}</Text>
          </View>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontWeight: '600' }}>Date From:</Text>
            <Text>{parseDate(floor.fromDate)}</Text>
          </View>

          <View>
            <Text style={{ fontWeight: '600' }}>Date To:</Text>
            <Text>{parseDate(floor.toDate)}</Text>
          </View>
        </View>
      ));
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderNavigation />
      <Text style={styles.title}>Preview Details</Text>

      {submissionData ? (
        <>
          {/* Property Table */}
          <SubmissionCard
            title="Property Details"
            rows={[
              {
                label: 'Ward No',
                value: submissionData['Ward No'],
                verifiedValue: submissionData['Verified_Ward'],
              },
              {
                label: 'New Ward No',
                value: submissionData['New Ward No (Current)'],
                verifiedValue: submissionData['Verified_NewWard'],
              },
              {
                label: 'Zone',
                value: submissionData['Zone (Current)'],
                verifiedValue: submissionData['Verified_Zone'],
              },
              {
                label: 'Property Type',
                value: submissionData['Property Type (Current)'],
                verifiedValue: submissionData['Verified_PropertyType'],
              },
            ]}
          />
          {floorIds.map((floor, index) => {
            // Skip non-relevant floor types (e.g., Floor type 4 = "1st Floor", 1 = "Parking")
            // if (floor.floorName !== 'PARKING' && floor.floorName !== 'BASEMENT')
            //   return null;

            return (
              <SubmissionCard
                key={index}
                title={`${floor.floorName} Details`}
                rows={[
                  {
                    label: 'Usage Type',
                    value: floor.usageType,
                    verifiedValue:
                      submissionData[`Verified_Usage${floor.floorName}`],
                  },
                  {
                    label: 'Occupancy Type',
                    value: floor.occupancyName,
                    verifiedValue:
                      submissionData[`Verified_Occupancy${floor.floorName}`],
                  },
                  {
                    label: 'Construction Type',
                    value: floor.constructionType,
                    verifiedValue:
                      submissionData[`Verified_Construction${floor.floorName}`],
                  },
                  {
                    label: 'Built-up Area',
                    value: floor.builtupArea,
                    verifiedValue:
                      submissionData[`Verified_BuiltUp${floor.floorName}`],
                  },
                  {
                    label: 'Date From',
                    value: floor.dateFrom,
                    verifiedValue:
                      submissionData[`Verified_DateFrom${floor.floorName}`],
                  },
                  {
                    label: 'Date To',
                    value: floor.dateUpto || '-',
                    verifiedValue:
                      submissionData[`Verified_DateTo${floor.floorName}`],
                  },
                ]}
              />
            );
          })}

          {/* Extra Floors */}
          {renderFloorData()}
          {/* Remarks */}
          {(submissionData['Remarks'] ||
            submissionData['Remarks (Preview)']) && (
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksTitle}>Remarks</Text>
              <View style={styles.remarksBox}>
                <Text style={styles.remarksText}>
                  {submissionData['Remarks'] ||
                    submissionData['Remarks (Preview)'] ||
                    'No remarks'}
                </Text>
              </View>
            </View>
          )}
        </>
      ) : (
        <Text>No submission data.</Text>
      )}

      {/* Location & Photos */}
      <View style={styles.locationPhotoCard}>
        <Text style={styles.locationPhotoTitle}>Photo & Location</Text>

        {/* Location Section */}
        <View style={styles.locationSection}>
          {loadingLocation ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : !location ? (
            <>
              <TouchableOpacity
                style={styles.getLocationButton}
                onPress={() => {
                  getLocationPermission().then(granted => {
                    if (!granted) {
                      Alert.alert(
                        'Location Required',
                        'Please enable location services.',
                      );
                      return;
                    }
                    setLoadingLocation(true);
                    Geolocation.getCurrentPosition(
                      pos => {
                        setLocation(pos.coords);
                        setLoadingLocation(false);
                      },
                      () => {
                        setLoadingLocation(false);
                        Alert.alert('Error', 'Unable to fetch location');
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 60000,
                        maximumAge: 30000,
                      },
                    );
                  });
                }}
              >
                <Text style={styles.getLocationButtonText}>
                  📍 Get Current Location
                </Text>
              </TouchableOpacity>
              <Text style={styles.locationHelpText}>
                * Location is required before capturing photos
              </Text>
            </>
          ) : (
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>📍 Location Captured</Text>
              <View style={styles.coordinatesBox}>
                <View style={styles.coordinateRow}>
                  <Text style={styles.coordinateLabel}>Latitude:</Text>
                  <Text style={styles.coordinateValue}>
                    {location.latitude.toFixed(6)}
                  </Text>
                </View>
                <View style={styles.coordinateRow}>
                  <Text style={styles.coordinateLabel}>Longitude:</Text>
                  <Text style={styles.coordinateValue}>
                    {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Photos Section */}
        {location && (
          <View style={styles.photosSection}>
            <Text style={styles.photosSectionTitle}>Property Photos</Text>
            <View style={styles.photosGrid}>
              {/* Left */}
              <View style={styles.photoItem}>
                <Text style={styles.photoLabel}>Left</Text>
                {left ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: left.uri }}
                      style={styles.photoImage}
                    />
                    <TouchableOpacity
                      style={styles.photoDeleteButton}
                      onPress={() => setLeft(null)}
                    >
                      <Text style={styles.photoDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={() => capturePhoto('left')}
                  >
                    <Text style={styles.captureButtonIcon}>📷</Text>
                    <Text style={styles.captureButtonText}>Capture</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Right */}
              <View style={styles.photoItem}>
                <Text style={styles.photoLabel}>Right</Text>
                {right ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: right.uri }}
                      style={styles.photoImage}
                    />
                    <TouchableOpacity
                      style={styles.photoDeleteButton}
                      onPress={() => setRight(null)}
                    >
                      <Text style={styles.photoDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={() => capturePhoto('right')}
                  >
                    <Text style={styles.captureButtonIcon}>📷</Text>
                    <Text style={styles.captureButtonText}>Capture</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Front */}
              <View style={styles.photoItem}>
                <Text style={styles.photoLabel}>Front</Text>
                {front ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: front.uri }}
                      style={styles.photoImage}
                    />
                    <TouchableOpacity
                      style={styles.photoDeleteButton}
                      onPress={() => setFront(null)}
                    >
                      <Text style={styles.photoDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={() => capturePhoto('front')}
                  >
                    <Text style={styles.captureButtonIcon}>📷</Text>
                    <Text style={styles.captureButtonText}>Capture</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Save & Next */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('SubmitVarification', {
            submissionData,
            floorsData,
            hasExtraFloors,
            location,
            left,
            right,
            front,
            id,
            floorIds,
            data,
          })
        }
      >
        <Text style={styles.buttonText}>Save and Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ---------------- Tabular Component ---------------- */
const SubmissionCard = ({ title, rows }) => (
  <View style={styles.tableCard}>
    <Text style={styles.tableTitle}>{title}</Text>
    {/* Header */}
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.tableCellLabel, styles.tableHeaderText]}>Field</Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Current Value
      </Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Verified Value
      </Text>
    </View>
    {/* Rows */}
    {rows.map((row, index) => (
      <View
        key={index}
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
        ]}
      >
        <Text style={styles.tableCellLabel}>{row.label}</Text>
        <Text style={styles.tableCellValue}>{String(row.value || 'N/A')}</Text>
        <Text style={styles.tableCellValue}>
          {String(row.verifiedValue || 'N/A')}
        </Text>
      </View>
    ))}
  </View>
);

export default VerifiedStatus;

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  /* Table */
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  tableRowEven: { backgroundColor: '#f9f9f9' },
  tableRowOdd: { backgroundColor: '#fff' },
  tableHeader: {
    backgroundColor: '#007AFF',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tableCellLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#333' },
  tableCellValue: { flex: 1, fontSize: 14, color: '#000', textAlign: 'right' },

  /* Remarks Section */
  remarksContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  remarksTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },
  remarksBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  remarksText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  /* Location & Photo Card */
  locationPhotoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locationPhotoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },

  /* Location Section */
  locationSection: { marginBottom: 20 },
  getLocationButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  getLocationButtonText: { color: '#fff', fontWeight: 'bold' },
  locationHelpText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginTop: 6,
  },
  locationInfo: { marginTop: 10 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  locationLabel: { fontWeight: '600', fontSize: 14 },
  coordinatesBox: { padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  coordinateLabel: { fontWeight: '600' },
  coordinateValue: { fontWeight: '400', color: '#333' },

  /* Photos Section */
  photosSection: { marginTop: 20 },
  photosSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  photoItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  photoWrapper: { position: 'relative' },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  photoDeleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  photoDeleteText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  captureButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  captureButtonIcon: { fontSize: 24, marginBottom: 4 },
  captureButtonText: { fontSize: 12, fontWeight: '600' },

  /* Save Button */
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
