import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Button,
  StyleSheet,
  Linking,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import HeaderNavigation from '../Components/HeaderNavigation';

const VerifiedStatus = ({ route }) => {
  const navigation = useNavigation();
  const { submissionData, floorsData, hasExtraFloors } = route.params || {};
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [location, setLocation] = useState(null);

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

  const capturePhoto = async photoIndex => {
    // Check location permission first
    const locationPermission = await getLocationPermission();
    if (!locationPermission) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to capture photos with location data. Please grant location permission to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
          { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
        ],
      );
      return;
    }
    // Check camera permission
    const cameraPermission = await getCameraPermission();
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Camera permission is required to capture photos. Please grant camera access to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
          { text: 'Try Again', onPress: () => capturePhoto(photoIndex) },
        ],
      );
      return;
    }
    // Get current location first
    Geolocation.getCurrentPosition(
      pos => {
        console.log('Location received (capturePhoto):', pos.coords);
        setLocation(pos.coords);
        // Only launch camera after successfully getting location
        launchCamera({ mediaType: 'photo' }, res => {
          if (res.didCancel || !res.assets) return;
          const photo = res.assets[0];
          if (photoIndex === 1) setPhoto1(photo);
          if (photoIndex === 2) setPhoto2(photo);
          if (photoIndex === 3) setPhoto3(photo);
        });
      },
      err => {
        console.log('Location error (capturePhoto):', err);
        Alert.alert(
          'Location Services Error',
          'Unable to get current location. Please check if location services are enabled in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
            { text: 'Retry', onPress: () => capturePhoto(photoIndex) },
          ],
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const renderItem = (label, value) => (
    <View key={label} style={styles.item}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );

  const formatDateToMonthYear = dateString => {
    if (!dateString) return 'N/A';
    // Assuming dateString is "month/date/year"
    const parts = dateString.split('/');
    if (parts.length < 3) return dateString; // fallback
    return `${parts[0]}/${parts[2]}`; // month/year
  };

  const renderFloorData = () => {
    // Handle floors data that was included in submissionData
    if (submissionData?.extraFloors && submissionData?.extraFloors) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Extra Floors ({submissionData?.extraFloors?.length})
          </Text>
          {submissionData.extraFloors.map((floor, index) => (
            <View key={index} style={styles.floorCard}>
              <Text style={styles.floorTitle}>Floor {floor.floorNumber}</Text>
              {renderItem('Floor Name', floor.floorName)}
              {renderItem('Construction Type', floor.constructionType)}
              {renderItem('Occupancy Type', floor.occupancyType)}
              {renderItem('Usage Type', floor.usageType)}
              {renderItem('From Date', formatDateToMonthYear(floor.fromDate))}
              {renderItem('To Date', formatDateToMonthYear(floor.toDate))}
            </View>
          ))}
        </View>
      );
    }

    // Handle floors data passed as separate parameter
    if (hasExtraFloors && floorsData && floorsData.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Extra Floors ({floorsData.length})
          </Text>
          {floorsData.map((floor, index) => (
            <View key={index} style={styles.floorCard}>
              <Text style={styles.floorTitle}>Floor {index + 1}</Text>
              {renderItem('Floor Name', floor.floorName)}
              {renderItem('Construction Type', floor.constructionType)}
              {renderItem('Occupancy Type', floor.occupancyType)}
              {renderItem('Usage Type', floor.usageType)}
              {renderItem(
                'From Date',
                floor.fromDate
                  ? new Date(floor.fromDate).toLocaleDateString()
                  : 'N/A',
              )}
              {renderItem(
                'To Date',
                floor.toDate
                  ? new Date(floor.toDate).toLocaleDateString()
                  : 'N/A',
              )}
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderNavigation />
      <Text style={styles.title}>Verified Status</Text>

      {submissionData ? (
        <>
          <SubmissionCard title="Property Details">
            <SubmissionRow label="Ward No" value={submissionData['Ward No']} />
            <SubmissionRow
              label="Verified Ward"
              value={submissionData['Verified_Ward']}
            />
            <SubmissionRow
              label="New Ward No"
              value={submissionData['New Ward No (Current)']}
            />
            <SubmissionRow
              label="Verified New Ward"
              value={submissionData['Verified_NewWard']}
            />
            <SubmissionRow
              label="Zone"
              value={submissionData['Zone (Current)']}
            />
            <SubmissionRow
              label="Verified Zone"
              value={submissionData['Verified_Zone']}
            />
            <SubmissionRow
              label="Property Type"
              value={submissionData['Property Type (Current)']}
            />
            <SubmissionRow
              label="Verified Property Type"
              value={submissionData['Verified_PropertyType']}
            />
          </SubmissionCard>

          {submissionData['Property Type (Current)'] !== 'VACANT LAND' && (
            <>
              <SubmissionCard title="Parking Details">
                <SubmissionRow
                  label="Usage Type"
                  value={submissionData['Usage Type (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Usage"
                  value={submissionData['Verified_UsageParking']}
                />
                <SubmissionRow
                  label="Occupancy Type"
                  value={submissionData['Occupancy Type (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Occupancy"
                  value={submissionData['Verified_OccupancyParking']}
                />
                <SubmissionRow
                  label="Construction Type"
                  value={submissionData['Construction Type (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Construction"
                  value={submissionData['Verified_ConstructionParking']}
                />
                <SubmissionRow
                  label="Built-up Area"
                  value={submissionData['Built-up Area (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Built-up Area"
                  value={submissionData['Verified_BuiltUpParking']}
                />
                <SubmissionRow
                  label="Date From"
                  value={submissionData['Date From (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Date From"
                  value={submissionData['Verified_DateFromParking']}
                />
                <SubmissionRow
                  label="Date To"
                  value={submissionData['Date To (Parking Current)']}
                />
                <SubmissionRow
                  label="Verified Date To"
                  value={submissionData['Verified_DateToParking']}
                />
              </SubmissionCard>

              <SubmissionCard title="Basement Details">
                <SubmissionRow
                  label="Usage Type"
                  value={submissionData['Usage Type (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Usage"
                  value={submissionData['Verified_UsageBasement']}
                />
                <SubmissionRow
                  label="Occupancy Type"
                  value={submissionData['Occupancy Type (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Occupancy"
                  value={submissionData['Verified_OccupancyBasement']}
                />
                <SubmissionRow
                  label="Construction Type"
                  value={submissionData['Construction Type (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Construction"
                  value={submissionData['Verified_ConstructionBasement']}
                />
                <SubmissionRow
                  label="Built-up Area"
                  value={submissionData['Built-up Area (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Built-up Area"
                  value={submissionData['Verified_BuiltUpBasement']}
                />
                <SubmissionRow
                  label="Date From"
                  value={submissionData['Date From (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Date From"
                  value={submissionData['Verified_DateFromBasement']}
                />
                <SubmissionRow
                  label="Date To"
                  value={submissionData['Date To (Basement Current)']}
                />
                <SubmissionRow
                  label="Verified Date To"
                  value={submissionData['Verified_DateToBasement']}
                />
              </SubmissionCard>

              <SubmissionCard title="Remarks">
                <Text>{submissionData['Remarks (Preview)']}</Text>
              </SubmissionCard>
            </>
          )}
        </>
      ) : (
        <Text>No submission data.</Text>
      )}

      {/* Render floor data */}
      {renderFloorData()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photo & Location</Text>
        {!location && (
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              // Get location only
              getLocationPermission().then(granted => {
                if (!granted) {
                  Alert.alert(
                    'Location Permission Required',
                    'This app needs location access. Please grant location permission to continue.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Open Settings', onPress: openLocationSettings },
                      {
                        text: 'Try Again',
                        onPress: () => getLocationPermission(),
                      },
                    ],
                  );
                  return;
                }
                Geolocation.getCurrentPosition(
                  pos => {
                    console.log(
                      'Location received (Get Location button):',
                      pos.coords,
                    );
                    setLocation(pos.coords);
                  },
                  err => {
                    console.log('Location error (Get Location button):', err);
                    Alert.alert(
                      'Location Services Error',
                      'Unable to get current location. Please check if location services are enabled in your device settings.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Open Settings',
                          onPress: openLocationSettings,
                        },
                        {
                          text: 'Retry',
                          onPress: () => getLocationPermission(),
                        },
                      ],
                    );
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                  },
                );
              });
            }}
          >
            <Text style={styles.cameraButtonText}>Get Location</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.requirementText}>
          * Location permission is required to capture photos
        </Text>

        {location && (
          <>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>📍 Location captured:</Text>
              <Text style={styles.locationCoords}>
                Latitude: {location.latitude.toFixed(5)}
              </Text>
              <Text style={styles.locationCoords}>
                Longitude: {location.longitude.toFixed(5)}
              </Text>
            </View>
            {/* Three image upload sections */}
            <View style={styles.photosContainer}>
              <Text style={styles.photosTitle}>Photo 1</Text>
              {photo1 ? (
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo1.uri }}
                    style={styles.photoImage}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setPhoto1(null)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => capturePhoto(1)}
                >
                  <Text style={styles.cameraButtonText}>Capture Photo 1</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.photosContainer}>
              <Text style={styles.photosTitle}>Photo 2</Text>
              {photo2 ? (
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo2.uri }}
                    style={styles.photoImage}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setPhoto2(null)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => capturePhoto(2)}
                >
                  <Text style={styles.cameraButtonText}>Capture Photo 2</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.photosContainer}>
              <Text style={styles.photosTitle}>Photo 3</Text>
              {photo3 ? (
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo3.uri }}
                    style={styles.photoImage}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setPhoto3(null)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => capturePhoto(3)}
                >
                  <Text style={styles.cameraButtonText}>Capture Photo 3</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('SubmitVarification', {
              submissionData,
              floorsData,
              hasExtraFloors,
              location,
              photo1,
              photo2,
              photo3,
            });
          }}
        >
          <Text style={styles.buttonText}>Save and Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const SubmissionCard = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SubmissionRow = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{String(value)}</Text>
  </View>
);

export default VerifiedStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    flex: 1,
  },
  floorCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  floorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  locationContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 5,
  },
  locationCoords: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  photosContainer: {
    marginTop: 15,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  photosScroll: {
    marginBottom: 10,
  },
  photoContainer: {
    marginRight: 15,
    alignItems: 'center',
    position: 'relative',
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  photoIndex: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
