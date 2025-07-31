import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import FormField from '../Components/FormField';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const commonOptions = [
  { label: 'PROPRIETORSHIP', value: 'proprietorship' },
  { label: 'PARTNERSHIP', value: 'partnership' },
];

const ownershipTypeOptions = [
  { label: 'OWN PROPERTY', value: '1' },
  { label: 'ON RENT', value: '2' },
  { label: 'ON LEASE', value: '3' },
];

const categoryOptions = [
  { label: 'Hostel/Lodge/Banquet Hall/DharamShala', value: '1' },
  { label: 'Dangerous Trade', value: '2' },
  { label: 'Others', value: '3' },
];

const ApplyLicense = () => {
  const [applicationType, setApplicationType] = useState('');
  const [firmType, setFirmType] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [category, setCategory] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [holdingNo, setHoldingNo] = useState('');
  const [firmName, setFirmName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [newWardNo, setNewWardNo] = useState('');
  const [ownerOfPremises, setOwnerOfPremises] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [natureOfBusiness, setNatureOfBusiness] = useState('');
  const [licenseFor, setLicenseFor] = useState('');
  const [chargeApplied, setChargeApplied] = useState('');
  const [penalty, setPenalty] = useState('');
  const [denialAmount, setDenialAmount] = useState('');
  const [totalCharge, setTotalCharge] = useState('');
  const [payload, setPayload] = useState('');
  const [data, setData] = useState('');
  const [wardList, setWardList] = useState([]);
  const [wardNos, setWardNos] = useState([]);
  const [ulbIds, setUlbIds] = useState([]);

  const handleSubmit = async () => {
    const payload = {
      applicationType,
      firmType,
      ownershipType,
      category,
      wardNo,
      holdingNo,
      firmName,
      totalArea,
      establishmentDate,
      businessAddress,
      landmark,
      pinCode,
      newWardNo,
      ownerOfPremises,
      businessDescription,
      ownerName,
      guardianName,
      mobileNo,
      email,
      natureOfBusiness,
      licenseFor,
      chargeApplied,
      penalty,
      denialAmount,
      totalCharge,
    };
    setPayload(payload);
    console.log('Submitted Payload:', payload);
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-saf-master-data`,
        {},
        { headers },
      );

      if (response?.data?.status) {
        const masterData = response.data.data;
        const wards = masterData.wardList || [];
        setData(masterData);
        setWardList(wards);
        setWardNos(wards.map(item => item.wardNo));
        setUlbIds(wards.map(item => item.ulbId));
        console.log('Master data:', masterData);
        fetchNewWardList(wards, headers);
      } else {
        console.warn('Failed to fetch master data:', response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const fetchNewWardList = async (wardList, headers) => {
    for (const item of wardList) {
      const body = { wardNo: item.wardNo, ulbId: item.ulbId };
      try {
        const responseWard = await axios.post(`${BASE_URL}/api/ward`, body, {
          headers,
        });

        console.log('Raw response:', responseWard?.data);

        const wardNumbers =
          responseWard?.data?.data?.map(item => item.wardNo) || [];
        console.log('My new ward numbers:', wardNumbers);

        // setWardList(wardNumbers);
      } catch (error) {
        console.error(`Error for ${item.wardNo}:`, error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Apply License</Text>

      {/* License Section */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBox}>
          <Text style={styles.headingText}>APPLY LICENSE (NEW LICENSE)</Text>
        </View>
        <FormField
          label="Application Type"
          placeholder="NEW LICENCE"
          value={applicationType}
          onChange={setApplicationType}
        />
        <FormField
          label="Firm Type"
          type="dropdown"
          placeholder="Select"
          value={firmType}
          onChange={setFirmType}
          options={commonOptions}
        />
        <FormField
          label="Type of Ownership of Business Premises"
          type="dropdown"
          placeholder="Select Type of Ownership"
          value={ownershipType}
          onChange={setOwnershipType}
          options={ownershipTypeOptions}
        />
        <FormField
          label="Category"
          type="dropdown"
          placeholder="Select Category"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />
      </View>

      {/* Firm Details Section */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBox}>
          <Text style={styles.headingText}>FIRM DETAILS</Text>
        </View>
        <FormField
          label="Ward No"
          type="dropdown"
          value={wardNo}
          onChange={setWardNo}
          options={commonOptions}
        />
        <FormField
          label="Holding No"
          value={holdingNo}
          onChange={setHoldingNo}
        />
        <FormField label="Firm Name" value={firmName} onChange={setFirmName} />
        <FormField
          label="Total Area (in Sq. Ft)"
          value={totalArea}
          onChange={setTotalArea}
        />
        <FormField
          label="Firm Establishment Date"
          type="date"
          placeholder="dd-mm-yyyy"
          value={establishmentDate}
          onChange={setEstablishmentDate}
        />
        <FormField
          label="Business Address"
          value={businessAddress}
          onChange={setBusinessAddress}
        />
        <FormField label="Landmark" value={landmark} onChange={setLandmark} />
        <FormField label="Pin Code" value={pinCode} onChange={setPinCode} />
        <FormField
          label="New Ward No"
          type="dropdown"
          value={newWardNo}
          onChange={setNewWardNo}
          options={commonOptions}
        />
        <FormField
          label="Owner of Business Premises"
          value={ownerOfPremises}
          onChange={setOwnerOfPremises}
        />
        <FormField
          label="Business Description"
          value={businessDescription}
          onChange={setBusinessDescription}
        />
      </View>

      {/* Owner Details Section */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBox}>
          <Text style={styles.headingText}>OWNER DETAILS</Text>
        </View>
        <FormField
          label="Owner Name"
          value={ownerName}
          onChange={setOwnerName}
        />
        <FormField
          label="Guardian Name"
          value={guardianName}
          onChange={setGuardianName}
        />
        <FormField label="Mobile No" value={mobileNo} onChange={setMobileNo} />
        <FormField label="Email ID" value={email} onChange={setEmail} />
      </View>

      {/* Nature of Business Section */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBox}>
          <Text style={styles.headingText}>NATURE OF BUSINESS</Text>
        </View>
        <FormField
          label="Nature of Business"
          value={natureOfBusiness}
          onChange={setNatureOfBusiness}
        />
      </View>

      {/* License Details Section */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBox}>
          <Text style={styles.headingText}>LICENSE REQUIRED FOR THE YEAR</Text>
        </View>
        <FormField
          label="License For"
          type="dropdown"
          value={licenseFor}
          onChange={setLicenseFor}
          options={commonOptions}
        />
        <FormField
          label="Charge Applied"
          value={chargeApplied}
          onChange={setChargeApplied}
        />
        <FormField label="Penalty" value={penalty} onChange={setPenalty} />
        <FormField
          label="Denial Amount / Arrears"
          value={denialAmount}
          onChange={setDenialAmount}
        />
        <FormField
          label="Total Charge"
          value={totalCharge}
          onChange={setTotalCharge}
        />
      </View>

      {/* Submit Button */}
      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ApplyLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: responsiveWidth(4),
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: Colors.primaryText || '#000',
    textAlign: 'center',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headingBox: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(1),
    marginBottom: responsiveHeight(1.5),
  },
  headingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
});
