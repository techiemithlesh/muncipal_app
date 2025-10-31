import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../api/apiRoutes'; // make sure this is your API route
import { getToken } from '../../../utils/auth';
import { showToast } from '../../../utils/toast';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { validateExtraChargesDates } from '../../../Validation/validation.';
import Clipboard from '@react-native-clipboard/clipboard';
// OR for newer versions:

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const AssessmentSummary = ({ route, navigation }) => {
  const [copiedSafNo, setCopiedSafNo] = useState(''); // ✅ add this
  const [modalVisible, setModalVisible] = useState(false);
  const data = route.params?.data || {};
  // console.log('data  AssessmentSummary', route.params?.masterData || {});
  const ownerDetails = data.ownerDtl || [];
  // console.log('owner Datails', ownerDetails);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(route.params?.data || {});
  const [savedSafId, setSavedSafId] = useState(null);

  const masterData = route.params?.masterData || {};
  const getMasterName = (list, id, labelKey) => {
    if (!Array.isArray(list)) return '';
    const item = list.find(i => i.id === id);
    return item ? item[labelKey] : '';
  };
  const mappedProperty = {
    ...data,
    zone: getMasterName(masterData.zone, data.zoneMstrId, 'zoneName'),
    ward: getMasterName(masterData.wardList, data.wardMstrId, 'wardNo'),

    ownershipType: getMasterName(
      masterData.ownershipType,
      data.ownershipTypeMstrId,
      'ownershipType',
    ),

    propertyType: getMasterName(
      masterData.propertyType,
      data.propTypeMstrId,
      'propertyType',
    ),
  };
  // Map floor details with names
  const floorss = (data.floorDtl || []).map(floor => ({
    floorName: getMasterName(
      masterData.floorType,
      floor.floorMasterId,
      'floorName',
    ),
    usageType: getMasterName(
      masterData.usageType,
      floor.usageTypeMasterId,
      'usageType',
    ),

    occupancyType: getMasterName(
      masterData.occupancyType,
      floor.occupancyTypeMasterId,
      'occupancyName',
    ),
    constructionType: getMasterName(
      masterData.constructionType,
      floor.constructionTypeMasterId,
      'constructionType',
    ),
    builtUpArea: floor.builtupArea,
    fromDate: floor.dateFrom,
    uptoDate: floor.dateUpto1,
  }));
  console.log('floors details', floorss);

  // Example usage:
  // const floors = mapFloorData(data.floorDtl, masterData);

  // function convertToYearMonth(date) {
  //   if (!date) return '2025-10'; // fallback to current month

  //   // If it's already in YYYY-MM format
  //   if (/^\d{4}-\d{2}$/.test(date)) {
  //     return date;
  //   }

  //   // If it's a Date object
  //   if (date instanceof Date) {
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     return `${year}-${month}`;
  //   }

  //   // If it's a full ISO date like "2025-10-01T00:00:00Z"
  //   if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
  //     const [year, month] = date.split('-');
  //     return `${year}-${month}`;
  //   }

  //   // If it's in MM/YYYY or MM-YYYY
  //   if (date.includes('/') || date.includes('-')) {
  //     const parts = date.split(/[-/]/);
  //     if (parts.length === 2) {
  //       const [part1, part2] = parts;
  //       // If first part is year
  //       if (part1.length === 4) {
  //         return `${part1}-${part2.padStart(2, '0')}`;
  //       } else {
  //         return `${part2}-${part1.padStart(2, '0')}`;
  //       }
  //     }
  //   }

  //   return '2025-10';
  // }

  const parseDate = str => {
    if (!str) return null;
    // Convert MM/YYYY → YYYY-MM-01
    const [month, year] = str.split('/');
    return new Date(`${year}-${month}-01`);
  };
  function formatDate1(dateInput) {
    if (!dateInput) return '';

    // Handle ISO date format (from date pickers)
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0]; // Already in YYYY-MM-DD format
    }

    // Handle DD/MM/YYYY format
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length !== 3) return '';

      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];

      return `${year}-${month}-${day}`;
    }

    // Handle YYYY-MM-DD format (already correct)
    if (dateInput.includes('-') && dateInput.length === 10) {
      return dateInput;
    }

    return '';
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const payload = {
        assessmentType: 'New Assessment',
        waterConnDate: data.waterConnDate,
        waterConnNo: data.waterConnNo,

        electAccNo: data.electAccNo,
        electBindBookNo: data.electBindBookNo,
        electConsCategory: data.electConsCategory,
        electConsumerNo: data.electConsumerNo,
        zoneMstrId: String(data.zoneMstrId),
        wardMstrId: data.wardMstrId,
        newWardMstrId: String(data.newWardMstrId),
        ownershipTypeMstrId: data.ownershipTypeId || 1,
        propTypeMstrId: data.propTypeMstrId,
        zoneMstrId: String(data.zoneMstrId),
        appartmentDetailsId: String(data.appartmentDetailsId || ''),
        flatRegistryDate: data.flatRegistryDate,
        roadWidth: String(data.roadWidth),
        khataNo: data.khataNo,
        plotNo: data.plotNo,
        villageMaujaName: data.villageMaujaName || 'NA',
        areaOfPlot: String(data.plotArea || data.areaOfPlot || '0'),
        propAddress: data.propAddress || 'NA',
        propCity: data.propCity || 'NA',
        propDist: data.propDist || 'NA',
        propPinCode: parseInt(data.propPinCode || '0', 10),
        propState: data.propState || 'NA',

        isMobileTower: String(data.isMobileTower),
        ...(data.isMobileTower === '1' && {
          towerArea: String(data.towerArea || '50'),
          towerInstallationDate: data.towerInstallationDate || '',
        }),

        isHoardingBoard: String(data.isHoardingBoard === '1' ? 1 : 0),
        ...(data.isHoardingBoard === '1' && {
          hoardingArea: String(data.hoardingArea || '50'),
          hoardingInstallationDate:
            formatDate1(data.hoardingInstallationDate) || '',
        }),

        isPetrolPump: String(data.isPetrolPump === '1' ? 1 : 0),
        ...(data.isPetrolPump === '1' && {
          underGroundArea: String(data.underGroundArea || '25'),
          petrolPumpCompletionDate:
            formatDate1(data.petrolPumpCompletionDate) || '',
        }),

        isWaterHarvesting: String(data.isWaterHarvesting === '1' ? 1 : 0),
        ...(data.isWaterHarvesting === '1' && {
          waterHarvestingDate: formatDate1(data.waterHarvestingDate) || '',
        }),

        landOccupationDate: '2021-02-03',

        ownerDtl: (data.ownerDtl || []).map((owner, index) => ({
          id: owner.id || index + 1,
          ownerName: owner.ownerName || 'NA',
          guardianName: owner.guardianName || '',
          relationType: owner.relationType || '',
          adharNo: owner.aadhaar || '',
          mobileNo: owner.mobile || '1234567890',
          email: owner.email || '',
          gender:
            owner.gender === 'male'
              ? 'Male'
              : owner.gender === 'female'
              ? 'Female'
              : 'Other',
          dob: owner.dob ? formatDate1(owner.dob) : '2000-01-01',
          isArmedForce: owner.armedForces === 'yes' ? '1' : '0',
          isSpeciallyAbled: owner.speciallyAbled === 'yes' ? '1' : '0',
        })),

        floorDtl:
          data.floorDtl && data.floorDtl.length > 0
            ? data.floorDtl.map(floorDtl => ({
                builtupArea: String(floorDtl.builtupArea || '100'),
                dateFrom: floorDtl.dateFrom || '',
                dateUpto: floorDtl.dateUpto1 || '',
                floorMasterId: String(floorDtl.floorMasterId || '2'),
                usageTypeMasterId: String(floorDtl.usageTypeMasterId || '1'),
                constructionTypeMasterId: String(
                  floorDtl.constructionTypeMasterId || '1',
                ),
                occupancyTypeMasterId: String(
                  floorDtl.occupancyTypeMasterId || '1',
                ),
              }))
            : [
                {
                  builtupArea: '100',
                  dateFrom: '2014-01',
                  dateUpto1: '2012-04',
                  floorMasterId: '2',
                  usageTypeMasterId: '1',
                  constructionTypeMasterId: '1',
                  occupancyTypeMasterId: '1',
                },
              ],
      };

      console.log('Final payload:', JSON.stringify(payload, null, 2));
      const response = await axios.post(SAF_API_ROUTES.APPLY_SAF, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      console.log('Full Response:', response.data);
      if (response.data.status) {
        const { message, data } = response.data;
        const safId = data?.safId; // ✅ get SAF ID

        setSavedSafId(safId);

        // Show success message immediately
        showToast('success', message);
        const safNo = data?.safNo;

        if (safNo) {
          Clipboard.setString(safNo); // copy SAF No
          setCopiedSafNo(safNo); // ✅ save SAF No in state
          setTimeout(() => {
            setModalVisible(true); // ✅ show modal
          }, 2000);
        }
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'API request failed');
    }
  };

  const handleOk = () => {
    setModalVisible(false);

    if (savedSafId) {
      navigation.navigate('SafDueDetails', { id: savedSafId }); // ✅ correct navigation
    }
  };

  return (
    <>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {data.id && (
          <Section title="Assessment ID">
            <Row label="ID" value={data.id} />
          </Section>
        )}
        <Section title="Property Details">
          <View style={styles.ownerCard}>
            <Row label="Assessment Type" value="New Assessment" />
            <Row label="Zone" value={data.zoneLabel} />
            <Row label="Old Ward" value={mappedProperty.ward} />
            <Row label="New Ward" value={mappedProperty.newWardLabel} />
            <Row label="Ownership Type" value={mappedProperty.ownershipType} />
            <Row label="Property Type" value={mappedProperty.propertyType} />
            <Row label="Road Width (ft)" value={data.roadWidth} />
          </View>
        </Section>
        <Section title="Property Address">
          <View style={styles.ownerCard}>
            <Row label="Property Address" value={data.propAddress} />
            <Row label="City" value={data.propCity} />
            <Row label="District" value={data.propDist} />
            <Row label="State" value={data.propState} />
            <Row label="Pincode" value={data.propState} />
            <Row
              label="Is Correspondence Address Different?"
              value={data.correspondingAddress ? 'Yes' : 'No'}
            />
            {data.correspondingAddress && (
              <>
                <Row
                  label="Correspondence Address"
                  value={data.correspondingAddress}
                />
                <Row label="City" value={data.correspondingCity} />
                <Row label="District" value={data.correspondingDistrict} />
                <Row label="State" value={data.correspondingState} />
                <Row label="Pincode" value={data.correspondingPincode} />
              </>
            )}
          </View>
        </Section>
        <Section title="Owner Details">
          {(ownerDetails || []).map(
            (
              {
                ownerName,
                guardianName,
                gender,
                dob,
                mobileNo,
                relationType,
                adharNo,
                email,
                pan,
                isArmedForce,
                isSpeciallyAbled,
              },
              index,
            ) => (
              <View key={index} style={styles.ownerCard}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Owner {index + 1}
                </Text>
                <Row label="Owner Name" value={ownerName} />
                <Row label="Guardian Name" value={guardianName} />
                <Row label="Gender" value={gender} />
                <Row label="DOB" value={dob} />
                <Row label="Mobile No." value={mobileNo} />
                <Row label="Email" value={email} />
                <Row label="Relation" value={relationType} />
                <Row label="Aadhaar No." value={adharNo} />
                <Row label="PAN No." value={pan} />
                <Row
                  label="Is Armed Force?"
                  value={
                    isArmedForce === '1' || isArmedForce === 1 ? 'Yes' : 'No'
                  }
                />
                <Row
                  label="Is Specially Abled?"
                  value={
                    isSpeciallyAbled === '1' || isSpeciallyAbled === 1
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            ),
          )}
        </Section>
        <Section title="Electricity Details">
          <View style={styles.ownerCard}>
            <Row label="KNO" value={data.electAccNo} />
            <Row label="ACC No" value={data.electAccNo} />
            <Row label="BIND/BOOK No" value={data.electBindBookNo} />
            <Row label="Electricity Category" value={data.electConsCategory} />
          </View>
        </Section>
        <Section title="Water Connection Details">
          <View style={styles.ownerCard}>
            <Row label="Water Connection No" value={data.waterConnNo} />
            <Row
              label="Water Connection Date"
              value={
                data.waterConnDate
                  ? new Date(data.waterConnDate).toLocaleDateString('en-GB')
                  : ''
              }
            />
          </View>
        </Section>
        <Section title="Extra Charges">
          <View style={styles.ownerCard}>
            {/* Mobile Tower */}
            <Row
              label="Have Mobile Tower?"
              value={
                data.isMobileTower === '1' || data.isMobileTower === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isMobileTower === '1' || data.isMobileTower === 1) && (
              <>
                <Row label="Tower Area" value={data.towerArea} />
                <Row
                  label="Installation Date"
                  value={
                    data.towerInstallationDate
                      ? new Date(data.towerInstallationDate).toLocaleDateString(
                          'en-GB',
                        )
                      : ''
                  }
                />
              </>
            )}

            {/* Hoarding Board */}
            <Row
              label="Have Hoarding Board(s)?"
              value={
                data.isHoardingBoard === '1' || data.isHoardingBoard === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isHoardingBoard === '1' || data.isHoardingBoard === 1) && (
              <>
                <Row label="Hoarding Area" value={data.hoardingArea} />
                <Row
                  label="Hoarding Installation Date"
                  value={
                    data.hoardingInstallationDate
                      ? new Date(
                          data.hoardingInstallationDate,
                        ).toLocaleDateString('en-GB')
                      : ''
                  }
                />
              </>
            )}

            {/* Petrol Pump */}
            <Row
              label="Have Petrol Pump?"
              value={
                data.isPetrolPump === '1' || data.isPetrolPump === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isPetrolPump === '1' || data.isPetrolPump === 1) && (
              <>
                <Row label="Pump Area" value={data.underGroundArea} />
                <Row
                  label="Pump Installation Date"
                  value={
                    data.petrolPumpCompletionDate
                      ? new Date(
                          data.petrolPumpCompletionDate,
                        ).toLocaleDateString('en-GB')
                      : ''
                  }
                />
              </>
            )}

            {/* Rainwater Harvesting */}
            <Row
              label="Have Rainwater Harvesting?"
              value={
                data.isWaterHarvesting === '1' || data.isWaterHarvesting === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isWaterHarvesting === '1' ||
              data.isWaterHarvesting === 1) && (
              <Row
                label="Completion Date"
                value={
                  data.waterHarvestingDate
                    ? new Date(data.waterHarvestingDate).toLocaleDateString(
                        'en-GB',
                      )
                    : ''
                }
              />
            )}
          </View>
        </Section>

        {floorss.map((floor, index) => (
          <View key={index} style={styles.ownerCard}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
              Floor {index + 1}
            </Text>

            <Row label="Floor Name" value={floor.floorName} />
            <Row label="Usage Type" value={floor.usageType} />
            <Row label="Occupancy Type" value={floor.occupancyType} />
            <Row label="Construction Type" value={floor.constructionType} />
            <Row label="Built-Up Area" value={floor.builtUpArea} />
            <Row
              label="From Date"
              value={floor.fromDate ? floor.fromDate.replace('-', '/') : ''} // "2025/10"
            />
            <Row
              label="Upto Date"
              value={floor.uptoDate ? floor.uptoDate.replace('-', '/') : ''} // "2025/10"
            />
          </View>
        ))}

        <View style={{ margin: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.headignColor} />
          ) : (
            <>
              <Button title="Back" onPress={() => navigation.goBack()} />
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Submit Assessment"
                  onPress={handleSubmit}
                  color={Colors.headignColor}
                />
              </View>
            </>
          )}
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Copied!</Text>
              <Text style={styles.modalText}>SAF No: {copiedSafNo}</Text>
              <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.background,
    padding: 10,
    backgroundColor: Colors.headignColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    flex: 1,
    color: '#222',
    textAlign: 'right',
  },
  ownerCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android shadow
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15, // rounded corners
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Android shadow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#555',
  },
  okButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25, // pill-shaped button
    elevation: 2,
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AssessmentSummary;
