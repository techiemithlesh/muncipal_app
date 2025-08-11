import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import FormField from '../Components/FormField';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../Components/CustomAlert';
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

const ApplyLicense = ({ navigation }) => {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
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
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const applicationTypeRef = useRef(null);
  const firmTypeRef = useRef(null);
  const ownershipTypeRef = useRef(null);
  const categoryRef = useRef(null);
  const wardNoRef = useRef(null);
  const holdingNoRef = useRef(null);
  const firmNameRef = useRef(null);
  const totalAreaRef = useRef(null);
  const establishmentDateRef = useRef(null);
  const businessAddressRef = useRef(null);
  const landmarkRef = useRef(null);
  const pinCodeRef = useRef(null);

  const newWardNoRef = useRef(null);
  const ownerOfPremisesRef = useRef(null);
  const businessDescriptionRef = useRef(null);
  const ownerNameRef = useRef(null);
  const guardianNameRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailRef = useRef(null);
  const natureOfBusinessRef = useRef(null);
  const licenseForRef = useRef(null);
  const chargeAppliedRef = useRef(null);
  const penaltyRef = useRef(null);
  const denialAmountRef = useRef(null);
  const totalChargeRef = useRef(null);
  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (!applicationType) {
      showAlert('Please select Application Type');
      return;
    }
    if (!firmType) {
      showAlert('Please select Firm Type');
      return;
    }
    if (!ownershipType) {
      showAlert('Please select Type of Ownership of Business Premises');
      return;
    }
    if (!category) {
      showAlert('Please select Category');
      return;
    }
    if (!wardNo) {
      showAlert('Please select Ward No');
      return;
    }
    if (!holdingNo) {
      showAlert('Please enter Holding No');
      return;
    }
    if (!firmName) {
      showAlert('Please enter Firm Name');
      return;
    }
    if (!totalArea) {
      showAlert('Please enter Total Area');
      return;
    }
    if (!establishmentDate) {
      showAlert('Please select Firm Establishment Date');
      return;
    }
    if (!businessAddress) {
      showAlert('Please enter Business Address');
      return;
    }
    if (!landmark) {
      showAlert('Please enter Landmark');
      return;
    }
    if (!pinCode) {
      showAlert('Please enter Pin Code');
      return;
    }
    if (!newWardNo) {
      showAlert('Please select New Ward No');
      return;
    }
    if (!ownerOfPremises) {
      showAlert('Please enter Owner of Business Premises');
      return;
    }
    if (!businessDescription) {
      showAlert('Please enter Business Description');
      return;
    }
    if (!ownerName) {
      showAlert('Please enter Owner Name');
      return;
    }
    if (!guardianName) {
      showAlert('Please enter Guardian Name');
      return;
    }
    if (!mobileNo) {
      showAlert('Please enter Mobile No');
      return;
    }
    if (!email) {
      showAlert('Please enter Email ID');
      return;
    }
    if (!natureOfBusiness) {
      showAlert('Please enter Nature of Business');
      return;
    }
    if (!licenseFor) {
      showAlert('Please select License For');
      return;
    }
    if (!chargeApplied) {
      showAlert('Please enter Charge Applied');
      return;
    }
    if (!penalty) {
      showAlert('Please enter Penalty');
      return;
    }
    if (!denialAmount) {
      showAlert('Please enter Denial Amount / Arrears');
      return;
    }
    if (!totalCharge) {
      showAlert('Please enter Total Charge');
      return;
    }
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

    // Navigate to summary page with the submitted data
    navigation.navigate('ApplyLicenseSummary', { submittedData: payload });
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

        // Create ward dropdown options
        const wardOptions = wards.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setWardDropdownOptions(wardOptions);

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
      const body = { oldWardId: item.id };
      try {
        const responseWard = await axios.post(
          `${BASE_URL}/api/property/get-new-ward-by-old`,
          body,
          {
            headers,
          },
        );

        console.log('Raw response:', responseWard?.data);

        if (responseWard?.data?.status) {
          const newWardOptions = responseWard.data.data.map(ward => ({
            label: ward.wardNo,
            value: ward.id,
          }));
          console.log('My new ward options:', newWardOptions);
          // Store the new ward options for the current ward
          setNewWardOptions(prevOptions => [...prevOptions, ...newWardOptions]);
        } else {
          console.warn(
            'Failed to fetch new wards:',
            responseWard?.data?.message,
          );
        }
      } catch (error) {
        console.error(`Error for ward ID ${item.id}:`, error.message);
      }
    }
  };

  const handleWardChange = async selectedWardId => {
    setWardNo(selectedWardId);
    setNewWardNo(''); // Reset new ward when ward changes

    if (selectedWardId) {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.post(
          `${BASE_URL}/api/property/get-new-ward-by-old`,
          { oldWardId: selectedWardId },
          { headers },
        );

        if (response?.data?.status) {
          const newWardOptions = response.data.data.map(ward => ({
            label: ward.wardNo,
            value: ward.id,
          }));
          setNewWardOptions(newWardOptions);
          console.log('New ward options for selected ward:', newWardOptions);
        } else {
          console.warn(
            'Failed to fetch new wards for selected ward:',
            response?.data?.message,
          );
          setNewWardOptions([]);
        }
      } catch (error) {
        console.error('Error fetching new wards for selected ward:', error);
        setNewWardOptions([]);
      }
    } else {
      setNewWardOptions([]);
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
          ref={applicationTypeRef}
          onFocus={() => console.log('Application Type focused')}
          onSubmitEditing={() => {
            console.log('Application Type onSubmitEditing called');
            console.log('firmTypeRef:', firmTypeRef.current);
            if (firmTypeRef.current) {
              console.log('Attempting to focus firmTypeRef');
              firmTypeRef.current.focus();
            }
          }}
        />
        <FormField
          label="Firm Type"
          type="dropdown"
          placeholder="Select"
          value={firmType}
          onChange={setFirmType}
          options={commonOptions}
          ref={firmTypeRef}
          onFocus={() => console.log('Firm Type focused')}
          onSubmitEditing={() => {
            console.log('Firm Type onSubmitEditing called');
            console.log('ownershipTypeRef:', ownershipTypeRef.current);
            if (ownershipTypeRef.current) {
              console.log('Attempting to focus ownershipTypeRef');
              ownershipTypeRef.current.focus();
            }
          }}
        />
        <FormField
          label="Type of Ownership of Business Premises"
          type="dropdown"
          placeholder="Select Type of Ownership"
          value={ownershipType}
          onChange={setOwnershipType}
          options={ownershipTypeOptions}
          ref={ownershipTypeRef}
          onSubmitEditing={() => categoryRef.current?.focus()}
        />
        <FormField
          label="Category"
          type="dropdown"
          placeholder="Select Category"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          ref={categoryRef}
          onSubmitEditing={() => wardNoRef.current?.focus()}
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
          onChange={handleWardChange}
          options={wardDropdownOptions}
          ref={wardNoRef}
          onSubmitEditing={() => holdingNoRef.current?.focus()}
        />
        <FormField
          label="Holding No"
          value={holdingNo}
          onChange={setHoldingNo}
          ref={holdingNoRef}
          onSubmitEditing={() => firmNameRef.current?.focus()}
        />
        <FormField
          label="Firm Name"
          value={firmName}
          onChange={setFirmName}
          ref={firmNameRef}
          onSubmitEditing={() => totalAreaRef.current?.focus()}
        />
        <FormField
          label="Total Area (in Sq. Ft)"
          value={totalArea}
          onChange={setTotalArea}
          ref={totalAreaRef}
          onSubmitEditing={() => establishmentDateRef.current?.focus()}
        />
        <FormField
          label="Firm Establishment Date"
          type="date"
          placeholder="dd-mm-yyyy"
          value={establishmentDate}
          onChange={setEstablishmentDate}
          ref={establishmentDateRef}
          onSubmitEditing={() => businessAddressRef.current?.focus()}
        />
        <FormField
          label="Business Address"
          value={businessAddress}
          onChange={setBusinessAddress}
          ref={businessAddressRef}
          onSubmitEditing={() => landmarkRef.current?.focus()}
        />
        <FormField
          label="Landmark"
          value={landmark}
          onChange={setLandmark}
          ref={landmarkRef}
          onSubmitEditing={() => pinCodeRef.current?.focus()}
        />
        <FormField
          label="Pin Code"
          value={pinCode}
          onChange={setPinCode}
          ref={pinCodeRef}
          onSubmitEditing={() => newWardNoRef.current?.focus()}
        />
        <FormField
          label="New Ward No"
          type="dropdown"
          value={newWardNo}
          onChange={setNewWardNo}
          options={newWardOptions}
          ref={newWardNoRef}
          onSubmitEditing={() => ownerOfPremisesRef.current?.focus()}
        />
        <FormField
          label="Owner of Business Premises"
          value={ownerOfPremises}
          onChange={setOwnerOfPremises}
          ref={ownerOfPremisesRef}
          onSubmitEditing={() => businessDescriptionRef.current?.focus()}
        />
        <FormField
          label="Business Description"
          value={businessDescription}
          onChange={setBusinessDescription}
          ref={businessDescriptionRef}
          onSubmitEditing={() => ownerNameRef.current?.focus()}
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
          ref={ownerNameRef}
          onSubmitEditing={() => guardianNameRef.current?.focus()}
        />
        <FormField
          label="Guardian Name"
          value={guardianName}
          onChange={setGuardianName}
          ref={guardianNameRef}
          onSubmitEditing={() => mobileNoRef.current?.focus()}
        />
        <FormField
          label="Mobile No"
          value={mobileNo}
          onChange={setMobileNo}
          ref={mobileNoRef}
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <FormField
          label="Email ID"
          value={email}
          onChange={setEmail}
          ref={emailRef}
          onSubmitEditing={() => natureOfBusinessRef.current?.focus()}
        />
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
          ref={natureOfBusinessRef}
          onSubmitEditing={() => licenseForRef.current?.focus()}
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
          ref={licenseForRef}
          onSubmitEditing={() => chargeAppliedRef.current?.focus()}
        />
        <FormField
          label="Charge Applied"
          value={chargeApplied}
          onChange={setChargeApplied}
          ref={chargeAppliedRef}
          onSubmitEditing={() => penaltyRef.current?.focus()}
        />
        <FormField
          label="Penalty"
          value={penalty}
          onChange={setPenalty}
          ref={penaltyRef}
          onSubmitEditing={() => denialAmountRef.current?.focus()}
        />
        <FormField
          label="Denial Amount / Arrears"
          value={denialAmount}
          onChange={setDenialAmount}
          ref={denialAmountRef}
          onSubmitEditing={() => totalChargeRef.current?.focus()}
        />
        <FormField
          label="Total Charge"
          value={totalCharge}
          onChange={setTotalCharge}
          ref={totalChargeRef}
          onSubmitEditing={handleSubmit}
        />
      </View>

      {/* Test Focus Button */}
      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: 'green' }]} 
          onPress={() => {
            console.log('Test focus button pressed');
            console.log('applicationTypeRef:', applicationTypeRef.current);
            if (applicationTypeRef.current) {
              console.log('Calling applicationTypeRef.current.focus()');
              applicationTypeRef.current.focus();
            }
          }}
        >
          <Text style={styles.submitButtonText}>Test Focus</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
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
