import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import MessageModal from '../../../../utils/MessageModal';

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

const RessesmentSummry = ({ route, navigation }) => {
  const data = route.params?.data || {};
  const safData = route?.params?.safData || {};

  const [loading, setLoading] = useState(false);
  const [safId, setSafId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  const handleCloseModal = id => {
    setModalVisible(false);
    if (id) {
      navigation.navigate('SafDueDetails', { id });
    } else {
      console.warn('SAF ID is missing. Navigation cancelled.');
    }
  };

  const formatDate1 = dob => {
    if (!dob) return '2019-02-14';
    const parts = dob.split('/');
    if (parts.length !== 3) return '2019-02-14';

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${year}-${month}-${day}`;
  };

  const convertToYearMonth = dateStr => {
    if (!dateStr) return null;
    const parts = dateStr.includes('/')
      ? dateStr.split('/')
      : dateStr.split('-');
    if (parts.length === 2) {
      const [month, year] = parts;
      return `${year}-${month.padStart(2, '0')}`;
    }
    if (parts.length === 3) {
      const [year, month] = parts;
      return `${year}-${month}`;
    }
    return dateStr;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const payload = {
        assessmentType: 'Reassessment',
        appartmentDetailsId: data?.appartmentDetailsId || '',
        previousHoldingId: data.holdingId,
        zoneMstrId: data.zoneId || 1,
        wardMstrId: Number(data.oldWard || 1),
        newWardMstrId: data.newWard || 1,
        ownershipTypeMstrId: data.ownershipTypeId || data.ownershipType || 1,
        propTypeMstrId: data.propertyTypeId || data.propertyType || 1,
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
        waterHarvestingDate:
          data.rainHarvesting === 'yes'
            ? formatDate1(data.waterHarvestingDate)
            : '2020-04-10',
        ownerDtl: [
          {
            email: '',
            guardianName: '',
            ownerName: data.ownerName || '10',
            mobileNo: data.mobile || '1234567890',
            gender:
              data.gender === 'male'
                ? 'Male'
                : data.gender === 'female'
                ? 'Female'
                : 'Male',
            dob: formatDate1(data.dob) || '2019-02-14',
            isArmedForce: data.armedForces === 'yes' ? 1 : 0,
            isSpeciallyAbled: data.speciallyAbled === 'yes' ? 1 : 0,
          },
        ],
        floorDtl:
          data.floors && data.floors.length > 0
            ? data.floors.map(floor => ({
                builtupArea: String(floor.builtUpArea || '100'),
                dateFrom: floor.fromDate
                  ? convertToYearMonth(floor.fromDate.replace('/', '-'))
                  : '',
                dateUpto: floor.uptoDate
                  ? convertToYearMonth(floor.uptoDate.replace('/', '-'))
                  : '',
                floorMasterId: String(floor.floorName || '2'), // floorName instead of floorNameId
                usageTypeMasterId: String(floor.usageType || '1'), // usageType instead of usageTypeId
                constructionTypeMasterId: floor.constructionType || 1,
                occupancyTypeMasterId: floor.occupancyType || 1,
              }))
            : [],
      };
      console.log(JSON.stringify(payload));

      // Log as a pretty-printed string (with indentation)
      console.log(JSON.stringify(payload, null, 2));
      const response = await axios.post(
        SAF_API_ROUTES.APPLY_SAF_RESSESMENT_API,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setLoading(false);
      const safIdValue = response?.data?.data?.safId;
      setSafId(safIdValue);

      if (response.data.success) {
        setModalType('success');
        setModalMessage('Reassessment submitted successfully');
        setModalVisible(true);
      } else {
        setModalType('error');
        setModalMessage(response.data.message || 'Something went wrong');
        setModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      setModalType('error');
      setModalMessage('Something went wrong');
      setModalVisible(true);
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Assessment Section */}
      {data.id && (
        <Section title="Assessment ID">
          <Row label="ID" value={data.id} />
        </Section>
      )}

      {/* Property Details */}
      <Section title="Property Details">
        <Row label="Assessment Type" value="Ressesment" />
        <Row label="Zone" value={safData.zone} />
        <Row label="Old Ward" value={safData.wardNo} />
        <Row label="New Ward" value={safData.newWardNo} />
        <Row label="Ownership Type" value={safData.ownershipType} />
        <Row label="Property Type" value={safData.propertyType} />
        <Row label="Road Width (ft)" value={data.roadWidth} />
      </Section>

      {/* Property Address */}
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

      {/* Owner Details */}
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

      {/* Electricity Details */}
      <Section title="Electricity Details">
        <Row label="KNO" value={data.kno} />
        <Row label="ACC No" value={data.accNo} />
        <Row label="BIND/BOOK No" value={data.bindBookNo} />
        <Row label="Electricity Category" value={data.electricityCategory} />
      </Section>

      {/* Water Connection Details */}
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

      {/* Extra Charges */}
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

      {/* Floor Details */}
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
                value={convertToYearMonth(floor.fromDate)}
              />
              <Row
                label="Upto Date"
                value={convertToYearMonth(floor.uptoDate)}
              />
            </View>
          ))}
        </Section>
      )}

      {/* Submit Buttons */}
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

      {/* Message Modal */}
      <MessageModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => handleCloseModal(safId)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
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
    color: '#fff',
    padding: 10,
    backgroundColor: Colors.headignColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { fontWeight: '600', color: '#555', flex: 1 },
  value: { flex: 1, color: '#222', textAlign: 'right' },
});

export default RessesmentSummry;
