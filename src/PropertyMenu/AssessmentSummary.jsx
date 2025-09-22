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
  console.log('data', data);
  const [loading, setLoading] = useState(false);

  function convertToYearMonth(date) {
    const [month, year] = date.split('-');
    return `${year}-${month}`;
  }

  const parseDate = str => {
    if (!str) return null;
    // Convert MM/YYYY → YYYY-MM-01
    const [month, year] = str.split('/');
    return new Date(`${year}-${month}-01`);
  };
  function formatDate1(dob) {
    if (!dob) return '2019-02-14'; // fallback if empty
    const parts = dob.split('/'); // ["18", "09", "1901"]
    if (parts.length !== 3) return '2019-02-14'; // fallback for invalid format

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // if async

      // Convert DD/MM/YYYY to YYYY-MM-DD format
      const formatDate = dateStr => {
        if (!dateStr) return '2024-01';

        if (dateStr.includes('T')) {
          const [year, month] = dateStr.split('T')[0].split('-');
          return `${year}-${month}`;
        }

        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}`;
        }

        if (dateStr.includes('-')) {
          const [year, month] = dateStr.split('-');
          return `${year}-${month.padStart(2, '0')}`;
        }

        return dateStr;
      };

      // Map data to API structure
      const payload = {
        assessmentType: 'New Assessment',
        zoneMstrId: data.zone || 1,
        wardMstrId: String(data.oldWard || 1),
        newWardMstrId: data.newWard || 1,
        ownershipTypeMstrId: data.ownershipTypeId || data.ownershipType || 1,
        propTypeMstrId: data.propertyTypeId || data.propertyType || 1,
        appartmentDetailsId: data.apartmentDetail,
        flatRegistryDate: '2024-01-01',
        roadWidth: String(data.roadWidth || '40'),
        khataNo: data.khataNo || 'a',
        plotNo: data.plotNo || 'a',
        villageMaujaName: data.villageName || 'a',
        areaOfPlot: String(data.plotArea || '100'),
        propAddress: data.propertyAddress || 'a',
        propCity: data.city || 'a',
        propDist: data.district || 'a',
        propPinCode: data.pincode || '123456',
        propState: data.state || 'a',
        isMobileTower: data.mobileTower === 'yes' ? 1 : 0,
        towerArea:
          data.mobileTower === 'yes' ? parseInt(data.towerArea || 50) : 50,
        towerInstallationDate:
          data.mobileTower === 'yes'
            ? formatDate1(data.installationDate)
            : '2024-01-01',
        isHoardingBoard: data.hoarding === 'yes' ? 1 : 0,
        hoardingArea:
          data.hoarding === 'yes' ? String(data.hoardingArea || '50') : '50',
        hoardingInstallationDate:
          data.hoarding === 'yes'
            ? formatDate1(data.hoardingInstallationDate)
            : '2016-04-17',
        isPetrolPump: data.petrolPump === 'yes' ? 1 : 0,
        underGroundArea:
          data.petrolPump === 'yes' ? String(data.pumpArea || '25') : '25',
        petrolPumpCompletionDate:
          data.petrolPump === 'yes'
            ? formatDate1(data.pumpInstallationDate)
            : '2020-04-10',
        landOccupationDate: '2021-02-03',
        isWaterHarvesting: data.rainHarvesting === 'yes' ? 1 : 0,

        ownerDtl: [
          {
            ownerName: data.ownerName || '10',
            mobileNo: data.mobile || '1234567890',
            gender:
              data.gender === 'male'
                ? 'Male'
                : data.gender === 'female'
                ? 'Female'
                : 'Male',
            dob: formatDate1(data.dob),
            isArmedForce:
              data.armedForces === 'yes'
                ? 1
                : data.armedForces === 'no'
                ? 0
                : 1,
            isSpeciallyAbled: data.speciallyAbled === 'yes' ? 1 : 0,
          },
        ],
        floorDtl:
          data.floors && data.floors.length > 0
            ? data.floors.map(floor => ({
                builtupArea: String(floor.builtUpArea || '100'),
                dateFrom:
                  convertToYearMonth(floor.fromDate.replace('/', '-')) ||
                  '2014-01',
                dateUpto1:
                  convertToYearMonth(floor.uptoDate.replace('/', '-')) ||
                  '2012-04',
                floorMasterId: String(floor.floorName || '2'),
                usageTypeMasterId: String(floor.usageType || '1'),
                constructionTypeMasterId: floor.constructionType || 1,
                occupancyTypeMasterId: floor.occupancyType || 1,
              }))
            : [
                {
                  builtupArea: '100',
                  dateFrom: '2014-01',
                  dateUpto1: '2012-04',
                  floorMasterId: '2',
                  usageTypeMasterId: '1',
                  constructionTypeMasterId: 1,
                  occupancyTypeMasterId: 1,
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

      if (response.data.message) {
        // Alert.alert('Success', response.data.message);
        showToast('success', response.data.message);
        // navigation.goBack();
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
          <Row label="Assessment Type" value="New Assessment" />
          <Row label="Zone" value={data.zone} />
          <Row label="Old Ward" value={data.oldWard} />
          <Row label="New Ward" value={data.newWard} />
          <Row label="Ownership Type" value={data.ownershipType} />
          <Row label="Property Type" value={data.propertyType} />
          <Row label="Road Width (ft)" value={data.roadWidth} />
        </Section>

        <Section title="Property Address">
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
        </Section>

        <Section title="Owner Details">
          <Row label="Owner Name" value={data.ownerName} />
          <Row label="Guardian Name" value={data.guardianName} />
          <Row label="Gender" value={data.gender} />
          <Row label="DOB" value={data.dob} />
          <Row label="Mobile No." value={data.mobile} />
          <Row label="Email" value={data.email} />
          <Row label="Relation" value={data.relation} />
          <Row label="Aadhaar No." value={data.aadhaar} />
          <Row label="PAN No." value={data.pan} />
          <Row label="Is Armed Force?" value={data.armedForces} />
          <Row label="Is Specially Abled?" value={data.speciallyAbled} />
        </Section>

        <Section title="Electricity Details">
          <Row label="KNO" value={data.kno} />
          <Row label="ACC No" value={data.accNo} />
          <Row label="BIND/BOOK No" value={data.bindBookNo} />
          <Row label="Electricity Category" value={data.electricityCategory} />
        </Section>

        <Section title="Water Connection Details">
          <Row label="Water Connection No" value={data.waterConnectionNo} />
          <Row
            label="Water Connection Date"
            value={
              data.waterConnectionDate
                ? new Date(data.waterConnectionDate).toLocaleDateString('en-GB')
                : ''
            }
          />
        </Section>

        <Section title="Extra Charges">
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
          <Row label="Have Rainwater Harvesting?" value={data.rainHarvesting} />
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
        </Section>

        {Array.isArray(data.floors) && data.floors.length > 0 && (
          <Section title="Floor Details">
            {data.floors.map((floor, index) => {
              console.log(floor, 'floor');
              return (
                <View key={index} style={{ marginBottom: 10 }}>
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
});

export default AssessmentSummary;
