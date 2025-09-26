import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../api/apiRoutes'; // make sure this is your API route
import { getToken } from '../utils/auth';
import { showToast } from '../utils/toast';
import HeaderNavigation from '../Components/HeaderNavigation';
import { validateExtraChargesDates } from '../Validation/validation.';

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
  const data = route.params?.data || {};
  console.log('data  AssessmentSummary', data);
  const ownerDetails = data.ownerDetails || [];
  console.log('owner Datails', ownerDetails);
  const [loading, setLoading] = useState(false);

  function convertToYearMonth(date) {
    if (!date) return '2024-01';

    // Handle MM/YYYY format
    if (date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
    }

    // Handle MM-YYYY format
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
    }

    return '2024-01';
  }

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
        zoneMstrId: String(data.zoneMstrId),
        wardMstrId: String(data.wardMstrId),
        newWardMstrId: String(data.newWardMstrId),
        ownershipTypeMstrId: data.ownershipTypeId || 1,
        propTypeMstrId: data.propertyTypeId || 1,
        appartmentDetailsId: data.apartmentDetail || '',
        flatRegistryDate: data.selectedDate,
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
          relationType: owner.relation || '',
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
          data.floors && data.floors.length > 0
            ? data.floors.map(floor => ({
                builtupArea: String(floor.builtUpArea || '100'),
                dateFrom: convertToYearMonth(floor.fromDate) || '2024-01',
                dateUpto1: convertToYearMonth(floor.uptoDate) || '2024-01',
                floorMasterId: String(floor.floorName || '2'),
                usageTypeMasterId: String(floor.usageType || '1'),
                constructionTypeMasterId: String(floor.constructionType || '1'),
                occupancyTypeMasterId: String(floor.occupancyType || '1'),
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

      console.log('Final payload:', payload);
      const response = await axios.post(SAF_API_ROUTES.APPLY_SAF, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      console.log('Full Response:', response.data);

      if (response.data.message) {
        showToast('success', response.data.message);
        // navigation.navigate('ApplyAssessment');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'API request failed');
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
            <Row label="Zone" value={data.zone} />
            <Row label="Old Ward" value={data.oldWard} />
            <Row label="New Ward" value={data.newWard} />
            <Row label="Ownership Type" value={data.ownershipType} />
            <Row label="Property Type" value={data.propertyType} />
            <Row label="Road Width (ft)" value={data.roadWidth} />
          </View>
        </Section>

        <Section title="Property Address">
          <View style={styles.ownerCard}>
            <Row label="Property Address" value={data.propertyAddress} />
            <Row label="City" value={data.city} />
            <Row label="District" value={data.district} />
            <Row label="State" value={data.state} />
            <Row label="Pincode" value={data.pincode} />
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
                mobile,
                email,
                relation,
                aadhaar,
                pan,
                armedForces,
                speciallyAbled,
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
                <Row label="Mobile No." value={mobile} />
                <Row label="Email" value={email} />
                <Row label="Relation" value={relation} />
                <Row label="Aadhaar No." value={aadhaar} />
                <Row label="PAN No." value={pan} />
                <Row label="Is Armed Force?" value={armedForces} />
                <Row label="Is Specially Abled?" value={speciallyAbled} />
              </View>
            ),
          )}
        </Section>

        <Section title="Electricity Details">
          <View style={styles.ownerCard}>
            <Row label="KNO" value={data.kno} />
            <Row label="ACC No" value={data.accNo} />
            <Row label="BIND/BOOK No" value={data.bindBookNo} />
            <Row
              label="Electricity Category"
              value={data.electricityCategory}
            />
          </View>
        </Section>

        <Section title="Water Connection Details">
          <View style={styles.ownerCard}>
            <Row label="Water Connection No" value={data.waterConnectionNo} />
            <Row
              label="Water Connection Date"
              value={
                data.waterConnectionDate
                  ? new Date(data.waterConnectionDate).toLocaleDateString(
                      'en-GB',
                    )
                  : ''
              }
            />
          </View>
        </Section>

        <Section title="Extra Charges">
          <View style={styles.ownerCard}>
            <Row label="Have Mobile Tower?" value={data.mobileTower} />
            {data.mobileTower === 'yes' && (
              <>
                <Row label="Tower Area" value={data.towerArea} />
                <Row
                  label="Installation Date"
                  value={
                    data.installationDate
                      ? new Date(data.installationDate).toLocaleDateString(
                          'en-GB',
                        )
                      : ''
                  }
                />
              </>
            )}
            <Row label="Have Hoarding Board(s)?" value={data.hoarding} />
            {data.hoarding === 'yes' && (
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
            <Row label="Have Petrol Pump?" value={data.petrolPump} />
            {data.petrolPump === 'yes' && (
              <>
                <Row label="Pump Area" value={data.pumpArea} />
                <Row
                  label="Pump Installation Date"
                  value={
                    data.pumpInstallationDate
                      ? new Date(data.pumpInstallationDate).toLocaleDateString(
                          'en-GB',
                        )
                      : ''
                  }
                />
              </>
            )}
            <Row
              label="Have Rainwater Harvesting?"
              value={data.rainHarvesting}
            />
            {data.rainHarvesting === 'yes' && (
              <Row
                label="Completion Date"
                value={
                  data.completionDate
                    ? new Date(data.completionDate).toLocaleDateString('en-GB')
                    : ''
                }
              />
            )}
          </View>
        </Section>

        {Array.isArray(data.floors) && data.floors.length > 0 && (
          <Section title="Floor Details">
            {data.floors.map((floor, index) => {
              console.log(floor, 'floor');
              return (
                <View key={index} style={styles.ownerCard}>
                  <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                    Floor {index + 1}
                  </Text>
                  <Row label="Floor Name" value={floor.floorName} />
                  <Row label="Usage Type" value={floor.usageType} />
                  <Row label="Occupancy Type" value={floor.occupancyType} />
                  <Row
                    label="Construction Type"
                    value={floor.constructionType}
                  />
                  <Row label="Built-Up Area" value={floor.builtUpArea} />
                  <Row
                    label="From Date"
                    value={
                      floor.fromDate
                        ? parseDate(floor.fromDate).toLocaleDateString('en-GB')
                        : ''
                    }
                  />

                  <Row
                    label="Upto Date"
                    value={
                      floor.uptoDate
                        ? parseDate(floor.uptoDate).toLocaleDateString('en-GB')
                        : ''
                    }
                  />
                </View>
              );
            })}
          </Section>
        )}

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
});

export default AssessmentSummary;
