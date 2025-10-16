import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import HeaderNavigation from '../Components/HeaderNavigation';
import { getUserDetails } from '../utils/auth';
import { showToast } from '../utils/toast';
import SubmissionModal from './Surveysubmission/SubmissionModal';
import {
  submitFieldVerification,
  submitGeotaggedImages,
  sendToLevel,
} from './Surveysubmission/submissionApi';

const VerifiedStatus = ({ route }) => {
  const [isULBUser, setIsULBUser] = useState(false);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [front, setFront] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  const { submissionData, floorsData, hasExtraFloors, id, data, floorIds } =
    route.params || {};
  console.log('After Preview Verified Status', submissionData);
  // console.log('After floor', floorIds);
  // console.log('After data', data);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserDetails();
        if (user?.userFor === 'ULB') setIsULBUser(true);
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const parseDate = str => {
    if (!str) return null;
    if (str.includes('/')) {
      const [month, year] = str.split('/');
      return `${year}-${month.padStart(2, '0')}`;
    }
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

  const handleSubmit = async () => {
    if (!isULBUser && (!location || !left || !right || !front)) {
      Alert.alert(
        'Missing Information',
        'Please capture location and all required photos before submitting.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit field verification
      const fieldResponse = await submitFieldVerification(
        submissionData,
        floorIds,
        id,
        data,
      );

      if (fieldResponse.status === 200) {
        showToast('success', fieldResponse.data.message);

        // Submit geotagged images if not ULB user
        if (!isULBUser && location) {
          const photos = [
            { label: 'left side', direction: 'West', ...left },
            { label: 'right side', direction: 'East', ...right },
            { label: 'front side', direction: 'North', ...front },
          ];

          const geoResponse = await submitGeotaggedImages(photos, location, id);
          console.log('GeoTagging Response:', geoResponse.data);
        }

        // Show modal for remarks and send to level
        setShowModal(true);
      }
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToLevel = async status => {
    try {
      await sendToLevel(id, remarks, status);
      setShowModal(false);
      showToast('success', `Successfully sent ${status.toLowerCase()}`);

      // Navigate back to FieldVerification or previous screen
      navigation.navigate('FieldVarification', {
        submissionData,
        location,
        photos: [left, right, front],
        remarks,
        id,
      });
    } catch (err) {
      console.error('Send to Level Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to send to level.');
    }
  };

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

  const renderFloorData = () => {
    if (!submissionData?.extraFloors) return null;
    return submissionData.extraFloors.map((floor, idx) => (
      <View key={idx} style={styles.extraFloorCard}>
        <Text style={styles.extraFloorTitle}>
          Extra Floor {idx + 1} Details
        </Text>
        {[
          'floorName',
          'constructionType',
          'occupancyType',
          'usageType',
          'builtupArea',
          'fromDate',
          'toDate',
        ].map(field => (
          <View style={styles.floorRow} key={field}>
            <Text style={styles.floorLabel}>
              {field.replace(/([A-Z])/g, ' $1')}:
            </Text>
            <Text>
              {field.includes('Date')
                ? parseDate(floor[field])
                : floor[field] || 'N/A'}
            </Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderNavigation />
      <Text style={styles.title}>Preview Details</Text>

      {submissionData ? (
        <>
          {/* Property Details */}
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

              ...(submissionData['Verified_PropertyType'] ===
              'FLATS / UNIT IN MULTI STORIED BUILDING'
                ? [
                    {
                      label: 'Selected Date',
                      value: submissionData['selectedDate'],
                    },
                    {
                      label: 'Apartment Detail Type',
                      value: submissionData['apartmentDetail'],
                    },
                  ]
                : []),
            ]}
          />
          {submissionData?.propTypeMstrId != 4 && floorIds?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Floor Details</Text>
              {floorIds.map((floor, index) => (
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
                        submissionData[
                          `Verified_Construction${floor.floorName}`
                        ],
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
              ))}
            </>
          )}

          {submissionData && (
            <SubmissionCard
              title="Additional Details"
              isHide={true}
              rows={[
                // Mobile Tower
                {
                  label: 'Mobile Tower',
                  value: submissionData.mobileTower || 'N/A',
                },
                ...(submissionData.mobileTower === 'yes'
                  ? [
                      {
                        label: 'Tower Area',
                        value: submissionData.towerArea || 'N/A',
                      },
                      {
                        label: 'Installation Date',
                        value: submissionData.installationDate || 'N/A',
                      },
                    ]
                  : []),

                // Hoarding
                {
                  label: 'Hoarding',
                  value: submissionData.hoarding || 'N/A',
                },
                ...(submissionData.hoarding === 'yes'
                  ? [
                      {
                        label: 'Hoarding Area',
                        value: submissionData.hoardingArea || 'N/A',
                      },
                      {
                        label: 'Hoarding Installation Date',
                        value:
                          submissionData.hoardingInstallationDate ||
                          submissionData.installationDate ||
                          'N/A',
                      },
                    ]
                  : []),

                // Rain Harvesting
                {
                  label: 'Rain Harvesting',
                  value: submissionData.rainHarvesting || 'N/A',
                },

                // Petrol Pump
                {
                  label: 'Petrol Pump',
                  value: submissionData.petrolPump || 'N/A',
                },
                ...(submissionData.petrolPump === 'yes'
                  ? [
                      {
                        label: 'Pump Area',
                        value: submissionData.pumpArea || 'N/A',
                      },
                      {
                        label: 'Pump Installation Date',
                        value: submissionData.pumpInstallationDate || 'N/A',
                      },
                    ]
                  : []),
              ]}
            />
          )}

          {/* Floors & Remarks */}
          {!isULBUser && (
            <>
              {renderFloorData()}

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

              {/* Location & Photos */}
              <View style={styles.locationPhotoCard}>
                <Text style={styles.locationPhotoTitle}>Photo & Location</Text>
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
                    <Text style={styles.locationLabel}>
                      📍 Location Captured
                    </Text>
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

                    <View style={styles.photosGrid}>
                      {['left', 'right', 'front'].map(side => {
                        const photo =
                          side === 'left'
                            ? left
                            : side === 'right'
                            ? right
                            : front;
                        const setPhoto =
                          side === 'left'
                            ? setLeft
                            : side === 'right'
                            ? setRight
                            : setFront;
                        return (
                          <View key={side} style={styles.photoItem}>
                            <Text style={styles.photoLabel}>
                              {side.charAt(0).toUpperCase() + side.slice(1)}
                            </Text>
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
                                onPress={() => capturePhoto(side)}
                              >
                                <Text style={styles.captureButtonIcon}>📷</Text>
                                <Text style={styles.captureButtonText}>
                                  Capture
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </>
      ) : (
        <Text>No submission data.</Text>
      )}

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <SubmissionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        remarks={remarks}
        onRemarksChange={setRemarks}
        onForward={() => handleSendToLevel('FORWARD')}
        onBackward={() => handleSendToLevel('BACKWARD')}
        isULBUser={isULBUser}
      />
    </ScrollView>
  );
};

const SubmissionCard = ({ title, rows, isHide }) => (
  <View style={styles.tableCard}>
    <Text style={styles.tableTitle}>{title}</Text>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.tableCellLabel, styles.tableHeaderText]}>Field</Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Current Value
      </Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Verified Value
      </Text>
    </View>
    {rows.map((row, index) => (
      <View
        key={index}
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
        ]}
      >
        <Text style={styles.tableCellLabel}>{row.label}</Text>
        {isHide == false && (
          <Text style={styles.tableCellValue}>
            {String(row.verifiedValue || 'N/A')}
          </Text>
        )}
        <Text style={styles.tableCellValue}>{String(row.value || 'N/A')}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

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
  remarksText: { fontSize: 14, color: '#333', lineHeight: 20 },

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
  getLocationButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  getLocationButtonText: { color: '#fff', fontWeight: 'bold' },
  locationHelpText: { fontSize: 12, color: 'gray', textAlign: 'center' },
  locationInfo: { marginTop: 10 },
  locationLabel: { fontWeight: '600', fontSize: 14 },
  coordinatesBox: { padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  coordinateLabel: { fontWeight: '600' },
  coordinateValue: { fontWeight: '400', color: '#333' },

  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photoItem: { width: '30%', alignItems: 'center', marginBottom: 12 },
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
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  photoDeleteText: { color: '#fff', fontWeight: 'bold' },
  captureButton: {
    backgroundColor: '#eff7feff',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureButtonIcon: { color: '#fff', fontSize: 20 },
  captureButtonText: { color: '#fff', fontSize: 12 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabledButton: {
    backgroundColor: '#ccc',
  },

  extraFloorCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  extraFloorTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  floorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  floorLabel: { fontWeight: '600' },
});

export default VerifiedStatus;
