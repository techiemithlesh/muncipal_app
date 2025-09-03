import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../Constants/Colors';
import { useMasterData } from '../../Context/MasterDataContext';
import HeaderNavigation from '../../Components/HeaderNavigation';
import { BASE_URL } from '../../config';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { useNavigation } from '@react-navigation/native';
import { scrollToInput, handleValidation } from './validation';

const ApplyWaterConnectionForm = () => {
  const [focusedField, setFocusedField] = useState(null);

  const [typeOfConnection, setTypeOfConnection] = useState(null);
  const [connectionThrough, setConnectionThrough] = useState(null);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [propertyType, setPropertyType] = useState(null);

  const [ownerType, setOwnerType] = useState(null);
  const [ownershipType, setOwnershipType] = useState([]);

  const [wardNo, setWardNo] = useState(null);
  const [wardNo2, setWardNo2] = useState(null);
  const [newWardOptions, setNewWardOptions] = useState([]);

  const [totalArea, setTotalArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');

  // Electricity Details states
  const [kNo, setKNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [electricityType, setElectricityType] = useState('');
  // const { wardList, ownerTypeList } = useMasterData();

  const [data, setData] = useState({});

  // Store multiple applicants in array
  const [applicants, setApplicants] = useState([
    { ownerName: '', guardianName: '', mobileNo: '', email: '' },
  ]);

  const { wardList } = useMasterData();
  const { ownerTypeList } = useMasterData();

  const wardOptions =
    wardList?.map(item => ({
      label: item.wardNo,
      value: item.id,
    })) || [];

  const dropdownData = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  const addApplicant = () => {
    setApplicants(prev => [
      ...prev,
      { ownerName: '', guardianName: '', mobileNo: '', email: '' },
    ]);
  };

  const removeApplicant = index => {
    setApplicants(prev => prev.filter((_, i) => i !== index));
  };

  const updateApplicantField = (index, field, value) => {
    const updated = [...applicants];
    updated[index][field] = value;
    setApplicants(updated);
  };

  useEffect(() => {
    const fetchNewWardByOldWard = async wardId => {
      try {
        const token = await getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.post(
          `${BASE_URL}/api/property/get-new-ward-by-old`,
          { oldWardId: wardId },
          { headers },
        );

        if (response?.data?.status) {
          const newOptions = response.data.data.map(item => ({
            label: item.wardNo,
            value: item.id,
          }));
          setNewWardOptions(newOptions);
        } else {
          setNewWardOptions([]);
        }
      } catch (error) {
        console.error('Error fetching new ward:', error);
        setNewWardOptions([]);
      }
    };

    if (wardNo) {
      fetchNewWardByOldWard(wardNo);
    }
  }, [wardNo]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = await getToken();
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
          setData(masterData);
          console.log('Master Data:', masterData);

          const ownershipList =
            masterData?.ownershipType?.map(item => ({
              label: item.ownershipType,
              value: item.id,
            })) || [];

          const propertyTypeList =
            masterData?.propertyType?.map(item => ({
              label: item.propertyType,
              value: item.id,
            })) || [];

          setOwnershipType(ownershipList);
          setPropertyTypeOptions(propertyTypeList);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchMasterData();
  }, []);

  // Refs
  const navigation = useNavigation();
  const totalAreaRef = useRef(null);
  const landmarRef = useRef(null);
  const pincodeRef = useRef(null);
  const addressRef = useRef(null);
  const khataNoRef = useRef(null);
  const accountNoRef = useRef(null);
  const bindBookNoRef = useRef(null);
  const electricityTypeRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Dynamic refs for applicants
  const applicantRefs = useRef([]);

  const [error, setError] = useState({});
  const handleSubmit = () => {
    const isValid = handleValidation({
      totalArea,
      landmark,
      pin,
      address,
      applicants,
      kNo,
      bindBookNo,
      accountNo,
      electricityType,
      totalAreaRef,
      landmarRef,
      pincodeRef,
      addressRef,
      applicantRefs,
      khataNoRef,
      bindBookNoRef,
      electricityTypeRef,
      scrollViewRef,
      setError,
    });

    if (!isValid) return;

    // Form payload
    const payload = {
      typeOfConnection,
      connectionThrough,
      propertyType,
      ownerType,
      wardNo,
      newWardNo: wardNo2,
      newWardOptions,
      totalArea,
      landmark,
      pin,
      address,
      applicants,
      electricityDetails: { kNo, bindBookNo, accountNo, electricityType },
    };

    console.log('Form Data:', payload);
    navigation.navigate('SubmitApply', { formData: payload, masterData: data });
  };
  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
        <Text style={styles.sectionTitle}>Apply Water Connection Form</Text>

        {/* Type of Connection & Connection Through */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type of Connection *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'typeOfConnection' && styles.inputFocused,
              ]}
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={typeOfConnection}
              onChange={item => setTypeOfConnection(item.value)}
              onFocus={() => setFocusedField('typeOfConnection')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Connection Through *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'connectionThrough' && styles.inputFocused,
              ]}
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={connectionThrough}
              onChange={item => setConnectionThrough(item.value)}
              onFocus={() => setFocusedField('connectionThrough')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Property Type & Owner Type */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Property Type *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'propertyType' && styles.inputFocused,
              ]}
              data={propertyTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={propertyType}
              onChange={item => setPropertyType(item.value)}
              onFocus={() => setFocusedField('propertyType')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Owner Type *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'ownerType' && styles.inputFocused,
              ]}
              data={ownershipType}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={ownerType}
              onChange={item => setOwnerType(item.value)}
              onFocus={() => setFocusedField('ownerType')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Ward Details */}
        <Text style={styles.sectionTitle}>Applicant Property Details</Text>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ward No. *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'wardNo' && styles.inputFocused,
              ]}
              data={wardOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={wardNo}
              onChange={item => setWardNo(item.value)}
              onFocus={() => setFocusedField('wardNo')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Ward No *</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusedField === 'wardNo2' && styles.inputFocused,
              ]}
              data={newWardOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={wardNo2}
              onChange={item => setWardNo2(item.value)}
              onFocus={() => setFocusedField('wardNo2')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Total Area */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Area (in Sq. Ft) *</Text>
            <TextInput
              ref={totalAreaRef}
              style={[
                styles.input,
                focusedField === 'totalArea' && styles.inputFocused,
              ]}
              placeholder="Enter Total Area"
              value={totalArea}
              onChangeText={setTotalArea}
              onFocus={() => setFocusedField('totalArea')}
              onBlur={() => setFocusedField(null)}
            />
            {error.totalArea && (
              <Text style={{ color: 'red' }}>{error.totalArea}</Text>
            )}
          </View>
        </View>

        {/* Landmark & Pin */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Landmark *</Text>
            <TextInput
              ref={landmarRef}
              style={[
                styles.input,
                focusedField === 'landmark' && styles.inputFocused,
              ]}
              placeholder="Enter Landmark"
              value={landmark}
              onChangeText={setLandmark}
              onFocus={() => setFocusedField('landmark')}
              onBlur={() => setFocusedField(null)}
            />
            {error.landmark && (
              <Text style={{ color: 'red' }}>{error.landmark}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pin *</Text>
            <TextInput
              ref={pincodeRef}
              style={[
                styles.input,
                focusedField === 'pin' && styles.inputFocused,
              ]}
              placeholder="Enter Pin"
              value={pin}
              onChangeText={setPin}
            />
            {error.pin && <Text style={{ color: 'red' }}>{error.pin}</Text>}
          </View>
        </View>

        {/* Address */}
        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            ref={addressRef}
            style={[
              styles.input,
              focusedField === 'address' && styles.inputFocused,
            ]}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
          />
          {error.address && (
            <Text style={{ color: 'red' }}>{error.address}</Text>
          )}
        </View>

        {/* Applicants */}
        <Text style={styles.sectionTitle}>Applicant Details</Text>
        {applicants.map((applicant, index) => (
          <View key={index} style={styles.applicantCard}>
            <Text style={styles.applicantTitle}>Applicant {index + 1}</Text>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Owner Name *</Text>
                <TextInput
                  ref={el => (applicantRefs.current[index * 2] = el)}
                  style={[
                    styles.input,
                    focusedField === `ownerName-${index}` &&
                      styles.inputFocused,
                  ]}
                  placeholder="Owner Name"
                  value={applicant.ownerName}
                  onChangeText={value =>
                    updateApplicantField(index, 'ownerName', value)
                  }
                  onFocus={() => setFocusedField(`ownerName-${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                {error[`ownerName-${index}`] && (
                  <Text style={{ color: 'red' }}>
                    {error[`ownerName-${index}`]}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Guardian Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === `guardianName-${index}` &&
                      styles.inputFocused,
                  ]}
                  placeholder="Guardian Name"
                  value={applicant.guardianName}
                  onChangeText={value =>
                    updateApplicantField(index, 'guardianName', value)
                  }
                  onFocus={() => setFocusedField(`guardianName-${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile No. *</Text>
                <TextInput
                  ref={el => (applicantRefs.current[index * 2 + 1] = el)}
                  style={[
                    styles.input,
                    focusedField === `mobileNo-${index}` && styles.inputFocused,
                  ]}
                  placeholder="Mobile No."
                  value={applicant.mobileNo}
                  onChangeText={value =>
                    updateApplicantField(index, 'mobileNo', value)
                  }
                  onFocus={() => setFocusedField(`mobileNo-${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
                {error[`mobileNo-${index}`] && (
                  <Text style={{ color: 'red' }}>
                    {error[`mobileNo-${index}`]}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email ID</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === `email-${index}` && styles.inputFocused,
                  ]}
                  placeholder="Email ID"
                  value={applicant.email}
                  onChangeText={value =>
                    updateApplicantField(index, 'email', value)
                  }
                  onFocus={() => setFocusedField(`email-${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {applicants.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeApplicant(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addApplicant}>
          <Text style={styles.addButtonText}>+ Add Applicant</Text>
        </TouchableOpacity>

        {/* Electricity Details */}
        <Text style={styles.sectionTitle}>APPLICANT ELECTRICITY DETAILS</Text>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>K. No. *</Text>
            <TextInput
              ref={khataNoRef}
              style={[
                styles.input,
                focusedField === 'kNo' && styles.inputFocused,
              ]}
              placeholder="Enter K No."
              value={kNo}
              onChangeText={setKNo}
            />
            {error.kNo && <Text style={{ color: 'red' }}>{error.kNo}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bind Book No. *</Text>
            <TextInput
              ref={bindBookNoRef}
              style={[
                styles.input,
                focusedField === 'bindBookNo' && styles.inputFocused,
              ]}
              placeholder="Enter Bind Book No."
              value={bindBookNo}
              onChangeText={setBindBookNo}
            />
            {error.bindBookNo && (
              <Text style={{ color: 'red' }}>{error.bindBookNo}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account No. *</Text>
            <TextInput
              ref={accountNoRef}
              style={[
                styles.input,
                focusedField === 'accountNo' && styles.inputFocused,
              ]}
              placeholder="Enter Account No."
              value={accountNo}
              onChangeText={setAccountNo}
            />
            {error.accountNo && (
              <Text style={{ color: 'red' }}>{error.accountNo}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Electricity Type *</Text>
            <TextInput
              ref={electricityTypeRef}
              style={[
                styles.input,
                focusedField === 'electricityType' && styles.inputFocused,
              ]}
              placeholder="Enter Electricity Type"
              value={electricityType}
              onChangeText={setElectricityType}
            />
            {error.electricityType && (
              <Text style={{ color: 'red' }}>{error.electricityType}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: rf(2.2), fontWeight: 'bold', marginVertical: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputContainer: { flex: 1, marginRight: 8 },
  fullWidthInputContainer: { flex: 1, marginBottom: 12 },
  label: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
  inputFocused: { borderColor: Colors.primary },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },
  applicantCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  applicantTitle: { fontWeight: 'bold', marginBottom: 8 },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: rf(2) },
});

export default ApplyWaterConnectionForm;
