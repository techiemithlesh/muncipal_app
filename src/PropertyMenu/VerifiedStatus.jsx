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
  const { submissionData, floorsData, hasExtraFloors, id } = route.params || {};
  console.log('Received ID:', id);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
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
          if (photoIndex === 1) setPhoto1(photo);
          if (photoIndex === 2) setPhoto2(photo);
          if (photoIndex === 3) setPhoto3(photo);
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
    if (submissionData?.extraFloors && submissionData.extraFloors.length > 0) {
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
            <Text>
              {floor.fromDate
                ? new Date(floor.fromDate).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>

          <View>
            <Text style={{ fontWeight: '600' }}>Date To:</Text>
            <Text>
              {floor.toDate
                ? new Date(floor.toDate).toLocaleDateString()
                : 'N/A'}
            </Text>
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

          {/* Parking Table */}
          {submissionData['Property Type (Current)'] !== 'VACANT LAND' && (
            <>
              <SubmissionCard
                title="Parking Details"
                rows={[
                  {
                    label: 'Usage Type',
                    value: submissionData['Usage Type (Parking Current)'],
                    verifiedValue: submissionData['Verified_UsageParking'],
                  },
                  {
                    label: 'Occupancy Type',
                    value: submissionData['Occupancy Type (Parking Current)'],
                    verifiedValue: submissionData['Verified_OccupancyParking'],
                  },
                  {
                    label: 'Construction Type',
                    value:
                      submissionData['Construction Type (Parking Current)'],
                    verifiedValue:
                      submissionData['Verified_ConstructionParking'],
                  },
                  {
                    label: 'Built-up Area',
                    value: submissionData['Built-up Area (Parking Current)'],
                    verifiedValue: submissionData['Verified_BuiltUpParking'],
                  },
                  {
                    label: 'Date From',
                    value: submissionData['Date From (Parking Current)'],
                    verifiedValue: submissionData['Verified_DateFromParking'],
                  },
                  {
                    label: 'Date To',
                    value: submissionData['Date To (Parking Current)'],
                    verifiedValue: submissionData['Verified_DateToParking'],
                  },
                ]}
              />

              {/* Basement Table */}
              <SubmissionCard
                title="Basement Details"
                rows={[
                  {
                    label: 'Usage Type',
                    value: submissionData['Usage Type (Basement Current)'],
                    verifiedValue: submissionData['Verified_UsageBasement'],
                  },
                  {
                    label: 'Occupancy Type',
                    value: submissionData['Occupancy Type (Basement Current)'],
                    verifiedValue: submissionData['Verified_OccupancyBasement'],
                  },
                  {
                    label: 'Construction Type',
                    value:
                      submissionData['Construction Type (Basement Current)'],
                    verifiedValue:
                      submissionData['Verified_ConstructionBasement'],
                  },
                  {
                    label: 'Built-up Area',
                    value: submissionData['Built-up Area (Basement Current)'],
                    verifiedValue: submissionData['Verified_BuiltUpBasement'],
                  },
                  {
                    label: 'Date From',
                    value: submissionData['Date From (Basement Current)'],
                    verifiedValue: submissionData['Verified_DateFromBasement'],
                  },
                  {
                    label: 'Date To',
                    value: submissionData['Date To (Basement Current)'],
                    verifiedValue: submissionData['Verified_DateToBasement'],
                  },
                ]}
              />
            </>
          )}

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
            <ActivityIndicator size="large" color="#007AFF" /> // 👈 loader UI
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
                    setLoadingLocation(true); // 👈 start loader
                    Geolocation.getCurrentPosition(
                      pos => {
                        setLocation(pos.coords);
                        setLoadingLocation(false); // 👈 stop loader
                      },
                      () => {
                        setLoadingLocation(false); // 👈 stop loader on error
                        Alert.alert('Error', 'Unable to fetch location');
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 60000, // wait up to 1 min  for GPS fix
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
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>📍 Location Captured</Text>
              </View>
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

        {/* Photos Section - Only show if location is captured */}
        {location && (
          <View style={styles.photosSection}>
            <Text style={styles.photosSectionTitle}>Property Photos</Text>
            <View style={styles.photosGrid}>
              {[1, 2, 3].map(i => {
                const photo = i === 1 ? photo1 : i === 2 ? photo2 : photo3;
                const setPhoto =
                  i === 1 ? setPhoto1 : i === 2 ? setPhoto2 : setPhoto3;
                return (
                  <View key={i} style={styles.photoItem}>
                    <Text style={styles.photoLabel}>Photo {i}</Text>
                    {photo ? (
                      <View style={styles.photoWrapper}>
                        <Image
                          source={{ uri: photo.uri }}
                          style={styles.photoImage}
                        />
                        <TouchableOpacity
                          style={styles.photoDeleteButton}
                          onPress={() => setPhoto(null)}
                        >
                          <Text style={styles.photoDeleteText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.captureButton}
                        onPress={() => capturePhoto(i)}
                      >
                        <Text style={styles.captureButtonIcon}>📷</Text>
                        <Text style={styles.captureButtonText}>Capture</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
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
            photo1,
            photo2,
            photo3,
            id,
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
