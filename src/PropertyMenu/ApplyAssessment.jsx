import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../Screen/Header';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
// Reusable address section component
const AddressSection = ({
  address,
  setAddress,
  city,
  setCity,
  district,
  setDistrict,
  stateValue,
  setStateValue,
  pincode,
  setPincode,
  title,
}) => (
  <View style={styles.section}>
    {title && <Text style={styles.header}>{title}</Text>}
    <TextInput
      style={styles.input}
      placeholder="Property Address *"
      placeholderTextColor="#000"
      value={address}
      onChangeText={setAddress}
    />
    <TextInput
      style={styles.input}
      placeholder="City *"
      placeholderTextColor="#000"
      value={city}
      onChangeText={setCity}
    />
    <TextInput
      style={styles.input}
      placeholder="District *"
      placeholderTextColor="#000"
      value={district}
      onChangeText={setDistrict}
    />
    <TextInput
      style={styles.input}
      placeholder="State *"
      placeholderTextColor="#000"
      value={stateValue}
      onChangeText={setStateValue}
    />
    <TextInput
      style={styles.input}
      placeholder="Pincode *"
      placeholderTextColor="#000"
      value={pincode}
      onChangeText={setPincode}
      keyboardType="numeric"
    />
  </View>
);

const ApplyAssessment = ({ navigation }) => {
  // water conection deatilas related useState varible
  const [waterConnectionNo, setWaterConnectionNo] = useState('');
  const [waterConnectionDate, setWaterConnectionDate] = useState('');

  // mobile email pan adhar state Varible
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');

  //Electrity input Field Usetae Varible
  const [kno, setKno] = useState('');
  const [accNo, setAccNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  // property Details realtes Usesate variable
  const [khataNo, setKhataNo] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [villageName, setVillageName] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [noRoad, setNoRoad] = useState('');

  // proprety address related useState Varible

  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // if mobile tower yes then
  const [towerArea, setTowerArea] = useState('');
  const [installationDate, setInstallationDate] = useState('');

  // hoarifing area
  const [hoardingArea, setHoardingArea] = useState('');
  const [hoardingInstallationDate, setHoardingInstallationDate] = useState('');
  // if petrol punp yes then
  const [pumpArea, setPumpArea] = useState('');
  const [pumpInstallationDate, setPumpInstallationDate] = useState('');

  // if raain harvesting yes then
  const [completionDate, setCompletionDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [oldWard, setOldWard] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [armedForces, setArmedForces] = useState('');
  const [speciallyAbled, setSpeciallyAbled] = useState('');
  const [electricityCategory, setElectricityCategory] = useState('');

  const [mobileTower, setMobileTower] = useState('');
  const [hoarding, setHoarding] = useState('');
  const [petrolPump, setPetrolPump] = useState('');
  const [rainHarvesting, setRainHarvesting] = useState('');
  const [data, setData] = useState(null);
  const [zone, setZone] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // Add new show/hide states for each date picker
  const [showWaterConnectionDatePicker, setShowWaterConnectionDatePicker] =
    useState(false);
  const [showInstallationDatePicker, setShowInstallationDatePicker] =
    useState(false);
  const [
    showHoardingInstallationDatePicker,
    setShowHoardingInstallationDatePicker,
  ] = useState(false);
  const [showPumpInstallationDatePicker, setShowPumpInstallationDatePicker] =
    useState(false);

  // Add new state for corresponding address fields
  const [correspondingAddress, setCorrespondingAddress] = useState('');
  const [correspondingCity, setCorrespondingCity] = useState('');
  const [correspondingDistrict, setCorrespondingDistrict] = useState('');
  const [correspondingState, setCorrespondingState] = useState('');
  const [correspondingPincode, setCorrespondingPincode] = useState('');

  // Owner details state
  const [dob, setDob] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [guardianName, setGuardianName] = useState('');

  const validateMobile = mobile => /^[6-9]\d{9}$/.test(mobile);
  const validateAadhaar = aadhaar => /^\d{12}$/.test(aadhaar);
  const validatePAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);

    // 👉 Perform your action here when checkbox is checked
    if (!isChecked) {
      console.log('Checkbox checked - Show corresponding address fields');
    } else {
      console.log('Checkbox unchecked - Hide corresponding address fields');
    }
  };

  const handleSubmit = async () => {
    if (!validateMobile(mobile)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number starting with 6-9.',
      );
      return;
    }
    if (!validateAadhaar(aadhaar)) {
      Alert.alert('Invalid Aadhaar', 'Aadhaar must be 12 digits.');
      return;
    }
    if (!validatePAN(pan)) {
      Alert.alert(
        'Invalid PAN',
        'PAN must be in correct format (e.g., ABCDE1234F).',
      );
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Collect all form data
    const formData = {
      oldWard,
      newWard,
      ownershipType,
      propertyType,
      zone,
      gender,
      relation,
      mobile,
      aadhaar,
      pan,
      email,
      armedForces,
      speciallyAbled,
      kno,
      accNo,
      bindBookNo,
      electricityCategory,
      khataNo,
      plotNo,
      villageName,
      plotArea,
      roadWidth,
      noRoad,
      waterConnectionNo,
      waterConnectionDate,
      propertyAddress,
      city,
      district,
      state,
      pincode,
      dob: dob ? new Date(dob).toLocaleDateString('en-GB') : '',
      ownerName,
      guardianName,
      correspondingAddress: isChecked ? correspondingAddress : '',
      correspondingCity: isChecked ? correspondingCity : '',
      correspondingDistrict: isChecked ? correspondingDistrict : '',
      correspondingState: isChecked ? correspondingState : '',
      correspondingPincode: isChecked ? correspondingPincode : '',
      mobileTower,
      towerArea,
      installationDate,
      hoarding,
      hoardingArea,
      hoardingInstallationDate,
      petrolPump,
      pumpArea,
      pumpInstallationDate,
      rainHarvesting,
      completionDate: completionDate ? completionDate.toISOString() : '',
    };

    navigation.navigate('AssessmentSummary', { data: formData });
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (oldWard) {
      fetchNewWardByOldWard(oldWard);
    }
  }, [oldWard]);

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
        setData(masterData);
        console.log('Master data:', masterData);
      } else {
        console.warn('Failed to fetch master data:', response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const fetchNewWardByOldWard = async wardId => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-new-ward-by-old`,
        { oldWardId: wardId },
        { headers },
      );

      console.log('New ward response:', response?.data);

      if (response?.data?.status) {
        const newOptions = response.data.data.map(item => ({
          label: item.wardNo,
          value: item.id,
        }));
        setNewWardOptions(newOptions);
      } else {
        console.warn('Failed to fetch new wards:', response?.data?.message);
        setNewWardOptions([]);
      }
    } catch (error) {
      console.error('Error fetching new ward:', error);
    }
  };

  const wardDropdownOptions =
    data?.wardList?.map(ward => ({
      label: ward?.wardNo,
      value: ward?.id,
    })) || [];

  const ownershipDropdownOptions =
    data?.ownershipType?.map(item => ({
      label: item.ownershipType,
      value: item.id,
    })) || [];

  const propertyTypeDropdownOptions =
    data?.propertyType?.map(item => ({
      label: item.propertyType,
      value: item.id,
    })) || [];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const yesNoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const selectRelation = [
    { label: 'S/O', value: 'so' },
    { label: 'D/O', value: 'do' },
    { label: 'W/O', value: 'wo' },
    { label: 'F/O', value: 'fo' },
  ];
  const selectelectcate = [
    { label: 'DSI', value: 'DSI' },
    { label: 'DSII', value: 'DSII' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Assessment Type</Text>
        <View style={styles.section}>
          <Dropdown
            style={styles.dropdown}
            data={wardDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Old Ward"
            value={oldWard}
            onChange={item => setOldWard(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={newWardOptions}
            labelField="label"
            valueField="value"
            placeholder="Select New Ward"
            value={newWard}
            onChange={item => setNewWard(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={ownershipDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Ownership Type"
            value={ownershipType}
            onChange={item => setOwnershipType(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={propertyTypeDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Property Type"
            value={propertyType}
            onChange={item => setPropertyType(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Zone 1', value: 'Zone1' },
              { label: 'Zone 2', value: 'Zone2' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Zone"
            value={zone}
            onChange={item => setZone(item.value)}
          />

          <Text style={{ color: 'red' }}>
            Zone 1: Over bridge to Saheed chowk.
          </Text>
          <Text style={{ color: 'red' }}>
            Zone 2: Rest area other than Zone 1.
          </Text>
        </View>

        <Text style={styles.header}>Owner Details</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="black"
            value={ownerName}
            onChangeText={setOwnerName}
          />
          <Dropdown
            style={styles.dropdown}
            data={genderOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={gender}
            onChange={item => setGender(item.value)}
          />
          {/* DOB Date Picker */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDobPicker(true)}
          >
            <Text style={{ color: dob ? '#000' : '#999' }}>
              {dob ? new Date(dob).toLocaleDateString('en-GB') : 'DOB *'}
            </Text>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDobPicker(false);
                if (event.type === 'set' && selectedDate) {
                  setDob(selectedDate.toISOString());
                }
              }}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Guardian Name"
            placeholderTextColor="black"
            value={guardianName}
            onChangeText={setGuardianName}
          />
          <Dropdown
            style={styles.dropdown}
            data={selectRelation}
            labelField="label"
            valueField="value"
            placeholder="Select Relation"
            value={relation}
            onChange={item => setRelation(item.value)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="black"
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={12}
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChangeText={setAadhaar}
            placeholderTextColor="black"
          />

          <TextInput
            style={styles.input}
            autoCapitalize="characters"
            maxLength={10}
            placeholder="Enter PAN Number"
            value={pan}
            onChangeText={setPan}
            placeholderTextColor="black"
          />

          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="black"
          />
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Member of Armed Forces?"
            value={armedForces}
            onChange={item => setArmedForces(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Specially Abled?"
            value={speciallyAbled}
            onChange={item => setSpeciallyAbled(item.value)}
          />
        </View>

        <Text style={styles.header}>Electricity Details</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Electricity K. No (e.g. xxxx xxxx xxxx)"
            keyboardType="numeric"
            placeholderTextColor="black"
            maxLength={14}
            value={kno}
            onChangeText={setKno}
          />

          <TextInput
            style={styles.input}
            placeholder="ACC No"
            keyboardType="numeric"
            placeholderTextColor="black"
            value={accNo}
            onChangeText={setAccNo}
          />

          <TextInput
            style={styles.input}
            placeholder="BIND/BOOK No"
            placeholderTextColor="black"
            value={bindBookNo}
            onChangeText={setBindBookNo}
          />
          <Dropdown
            style={styles.dropdown}
            data={selectelectcate}
            labelField="label"
            valueField="value"
            placeholder="Electricity Category"
            value={electricityCategory}
            onChange={item => setElectricityCategory(item.value)}
          />
        </View>

        <Text style={styles.header}>Water Connection Details</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Water Connection No"
            placeholderTextColor="#000"
            value={waterConnectionNo}
            onChangeText={setWaterConnectionNo}
          />

          {/* Date Picker for Water Connection Date */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowWaterConnectionDatePicker(true)}
          >
            <Text style={{ color: waterConnectionDate ? '#000' : '#999' }}>
              {waterConnectionDate
                ? new Date(waterConnectionDate).toLocaleDateString('en-GB')
                : 'Water Connection Date (DD/MM/YYYY)'}
            </Text>
          </TouchableOpacity>
          {showWaterConnectionDatePicker && (
            <DateTimePicker
              value={
                waterConnectionDate ? new Date(waterConnectionDate) : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowWaterConnectionDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setWaterConnectionDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>

        <Text style={styles.header}>Property Address</Text>
        <AddressSection
          address={propertyAddress}
          setAddress={setPropertyAddress}
          city={city}
          setCity={setCity}
          district={district}
          setDistrict={setDistrict}
          stateValue={state}
          setStateValue={setState}
          pincode={pincode}
          setPincode={setPincode}
        />
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleCheckboxToggle}
        >
          <View style={[styles.checkbox, isChecked && styles.checked]} />
          <Text style={styles.label}>
            If Corresponding Address Different from Property Address
          </Text>
        </TouchableOpacity>

        {isChecked && (
          <View style={styles.extraFields}>
            <AddressSection
              address={correspondingAddress}
              setAddress={setCorrespondingAddress}
              city={correspondingCity}
              setCity={setCorrespondingCity}
              district={correspondingDistrict}
              setDistrict={setCorrespondingDistrict}
              stateValue={correspondingState}
              setStateValue={setCorrespondingState}
              pincode={correspondingPincode}
              setPincode={setCorrespondingPincode}
              title="Corresponding Address"
            />
          </View>
        )}

        <Text style={styles.header}>Extra Charges</Text>
        <View style={styles.section}>
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Mobile Tower"
            value={mobileTower}
            onChange={item => setMobileTower(item.value)}
          />
          {mobileTower === 'yes' && (
            <View style={styles.extraInputs}>
              <Text style={styles.label}>
                Total Area Covered by Mobile Tower & Supporting Equipments (in
                Sq. Ft.)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Eg. 200 SQMTR"
                value={towerArea}
                onChangeText={setTowerArea}
              />

              <Text style={styles.label}>
                Date of Installation of Mobile Tower *
              </Text>
              {/* Date Picker for Mobile Tower Installation Date */}
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowInstallationDatePicker(true)}
              >
                <Text style={{ color: installationDate ? '#000' : '#999' }}>
                  {installationDate
                    ? new Date(installationDate).toLocaleDateString('en-GB')
                    : 'DD-MM-YYYY'}
                </Text>
              </TouchableOpacity>
              {showInstallationDatePicker && (
                <DateTimePicker
                  value={
                    installationDate ? new Date(installationDate) : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowInstallationDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setInstallationDate(selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </View>
          )}
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Does Property Have Hoarding Board(s) ? *"
            value={hoarding}
            onChange={item => setHoarding(item.value)}
          />
          {hoarding === 'yes' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Total Area of Wall / Roof / Land (in Sq. Ft.) *"
                value={hoardingArea}
                onChangeText={setHoardingArea}
                placeholderTextColor="#000"
              />
              {/* Date Picker for Hoarding Installation Date */}
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowHoardingInstallationDatePicker(true)}
              >
                <Text
                  style={{ color: hoardingInstallationDate ? '#000' : '#999' }}
                >
                  {hoardingInstallationDate
                    ? new Date(hoardingInstallationDate).toLocaleDateString(
                        'en-GB',
                      )
                    : 'Date of Installation of Hoarding Board(s) *'}
                </Text>
              </TouchableOpacity>
              {showHoardingInstallationDatePicker && (
                <DateTimePicker
                  value={
                    hoardingInstallationDate
                      ? new Date(hoardingInstallationDate)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowHoardingInstallationDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setHoardingInstallationDate(selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </>
          )}

          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Is property a Petrol Pump ? *"
            value={petrolPump}
            onChange={item => setPetrolPump(item.value)}
          />

          {petrolPump === 'yes' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Total Area of Petrol Pump (in Sq. Ft.) *"
                value={pumpArea}
                onChangeText={setPumpArea}
                placeholderTextColor="#000"
              />
              {/* Date Picker for Petrol Pump Installation Date */}
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPumpInstallationDatePicker(true)}
              >
                <Text style={{ color: pumpInstallationDate ? '#000' : '#999' }}>
                  {pumpInstallationDate
                    ? new Date(pumpInstallationDate).toLocaleDateString('en-GB')
                    : 'Date of Installation *'}
                </Text>
              </TouchableOpacity>
              {showPumpInstallationDatePicker && (
                <DateTimePicker
                  value={
                    pumpInstallationDate
                      ? new Date(pumpInstallationDate)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPumpInstallationDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setPumpInstallationDate(selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </>
          )}
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Rainwater harvesting provision ? *"
            value={rainHarvesting}
            onChange={item => setRainHarvesting(item.value)}
          />
        </View>
        {rainHarvesting === 'yes' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: completionDate ? '#000' : '#999' }}>
                {completionDate
                  ? completionDate.toLocaleDateString('en-GB')
                  : 'Completion Date of Petrol Pump *'}
              </Text>
            </TouchableOpacity>

            {/* DateTimePicker should be outside TouchableOpacity and inside conditional block */}
            {/* DateTimePicker should be outside TouchableOpacity and inside conditional block */}
            {showDatePicker && (
              <DateTimePicker
                value={completionDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    setCompletionDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  checked: {
    backgroundColor: 'green',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
});

export default ApplyAssessment;
