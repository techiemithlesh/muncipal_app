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
import Header from '../Screen/Header';
import axios from 'axios';
import { SAF_API_ROUTES } from '../api/apiRoutes'; // make sure this is your API route
import { getToken } from '../utils/auth';

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // if async
      // Map data to API structure
      const payload = data => {
        return {
          assessmentType: data.assessmentType || 'New Assessment',
          zoneMstrId: data.zone || null,
          wardMstrId: data.oldWard || null,
          newWardMstrId: data.newWard || null,
          ownershipTypeMstrId: data.ownershipType || null,
          propTypeMstrId: data.propertyType || null,
          appartmentDetailsId: data.appartmentDetailsId || '',
          flatRegistryDate: data.flatRegistryDate || null,
          roadWidth: data.roadWidth || '',
          khataNo: data.khataNo || '',
          plotNo: data.plotNo || '',
          villageMaujaName: data.villageName || '',
          areaOfPlot: data.plotArea || 0,
          propAddress: data.propertyAddress || '',
          propCity: data.city || '',
          propDist: data.district || '',
          propPinCode: data.pincode || '',
          propState: data.state || '',
          isMobileTower: data.mobileTower === 'yes' ? 1 : 0,
          towerArea: data.towerArea || 0,
          towerInstallationDate: data.installationDate || null,
          isHoardingBoard: data.hoarding === 'yes' ? 1 : 0,
          hoardingArea: data.hoardingArea || 0,
          hoardingInstallationDate: data.hoardingInstallationDate || null,
          isPetrolPump: data.petrolPump === 'yes' ? 1 : 0,
          underGroundArea: data.underGroundArea || 0,
          petrolPumpCompletionDate: data.pumpInstallationDate || null,
          landOccupationDate: data.landOccupationDate || null,
          isWaterHarvesting: data.rainHarvesting === 'yes' ? 1 : 0,
          waterConnectionNo: data.waterConnectionNo || '',
          waterConnectionDate: data.waterConnectionDate || null,
          ownerDtl: [
            {
              ownerName: data.ownerName || '',
              mobileNo: data.mobile || '',
              gender: data.gender || '',
              dob: data.dob || null,
              isArmedForce: data.armedForces === 'yes' ? 1 : 0,
              isSpeciallyAbled: data.speciallyAbled === 'yes' ? 1 : 0,
              relation: data.relation || '',
              aadhaar: data.aadhaar || '',
              pan: data.pan || '',
            },
          ],
          floorDtl: (data.floors || []).map(floor => ({
            builtupArea: floor.builtUpArea || 0,
            dateFrom: floor.fromDate || null,
            dateUpto1: floor.uptoDate || null,
            floorMasterId: floor.floorName || null,
            usageTypeMasterId: floor.usageType || null,
            constructionTypeMasterId: floor.constructionType || null,
            occupancyTypeMasterId: floor.occupancyType || null,
          })),
        };
      };
      console.log(payload, 'my payload data');
      const response = await axios.post(SAF_API_ROUTES.APPLY_SAF, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      if (response.data.success) {
        Alert.alert('Success', 'Assessment submitted successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'API request failed');
    }
  };

  return (
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
                  ? new Date(data.installationDate).toLocaleDateString('en-GB')
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
                  ? new Date(data.hoardingInstallationDate).toLocaleDateString(
                      'en-GB',
                    )
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
          {data.floors.map((floor, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
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
                value={
                  floor.fromDate
                    ? new Date(floor.fromDate).toLocaleDateString('en-GB')
                    : ''
                }
              />
              <Row
                label="Upto Date"
                value={
                  floor.uptoDate
                    ? new Date(floor.uptoDate).toLocaleDateString('en-GB')
                    : ''
                }
              />
            </View>
          ))}
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
    color: '#333',
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
