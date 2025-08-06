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
import CustomAlert from '../Components/CustomAlert';
import PropertyDetails from './components/PropertyDetails';
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
    <Text style={styles.label}>Property Address *</Text>
    <TextInput
      style={styles.input}
      placeholder="Property Address *"
      placeholderTextColor="#000"
      value={address}
      onChangeText={setAddress}
    />
    <Text style={styles.label}>City *</Text>
    <TextInput
      style={styles.input}
      placeholder="City *"
      placeholderTextColor="#000"
      value={city}
      onChangeText={setCity}
    />
    <Text style={styles.label}>District *</Text>
    <TextInput
      style={styles.input}
      placeholder="District *"
      placeholderTextColor="#000"
      value={district}
      onChangeText={setDistrict}
    />
    <Text style={styles.label}>State *</Text>
    <TextInput
      style={styles.input}
      placeholder="State *"
      placeholderTextColor="#000"
      value={stateValue}
      onChangeText={setStateValue}
    />
    <Text style={styles.label}>Pincode *</Text>
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
  const [propertyTypeLabel, setPropertyTypeLabel] = useState('');

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

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateMobile = mobile => /^[6-9]\d{9}$/.test(mobile);
  const validateAadhaar = aadhaar => /^\d{12}$/.test(aadhaar);
  const validatePAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  const [floorDetails, setFloorDetails] = useState([
    {
      floorName: '',
      usageType: '',
      occupancyType: '',
      constructionType: '',
      builtUpArea: '',
      fromDate: '',
      uptoDate: '',
    },
  ]);

  const [datePicker, setDatePicker] = useState({
    index: null,
    field: '',
    show: false,
  });

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateFloorDetail = (index, field, value) => {
    const updated = [...floorDetails];
    updated[index][field] = value;
    setFloorDetails(updated);
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formatted = `${month}/${year}`;

      const { index, field } = datePicker;
      updateFloorDetail(index, field, formatted);
    }
    setDatePicker({ index: null, field: '', show: false });
  };

  const addFloor = () => {
    setFloorDetails(prev => [
      ...prev,
      {
        floorName: '',
        usageType: '',
        occupancyType: '',
        constructionType: '',
        builtUpArea: '',
        fromDate: '',
        uptoDate: '',
      },
    ]);
  };
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
    if (!oldWard) {
      showAlert('Please select an oldWard type.');
      return;
    }
    // Validations

    // Base form data
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

    // Conditionally add floor details
    if (propertyTypeLabel !== 'VACANT LAND') {
      const isValid = floorDetails.every(
        floor =>
          floor.floorName &&
          floor.usageType &&
          floor.occupancyType &&
          floor.constructionType &&
          floor.builtUpArea &&
          floor.fromDate &&
          floor.uptoDate,
      );

      formData.floors = floorDetails.map(floor => ({
        floorName: floor.floorName,
        usageType: floor.usageType,
        occupancyType: floor.occupancyType,
        constructionType: floor.constructionType,
        builtUpArea: floor.builtUpArea,
        fromDate: floor.fromDate,
        uptoDate: floor.uptoDate,
      }));
    }

    // Navigate to summary screen with full data
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

  const floorNameOptions =
    data?.floorType?.map(floor => ({
      label: floor.floorName,
      value: floor.id,
    })) || [];

  const usageTypeOptions =
    data?.usageType?.map(usetype => ({
      label: usetype.usageType,
      value: usetype.id,
    })) || [];

  const occupancyTypeOptions =
    data?.occupancyType?.map(occupy => ({
      label: occupy.occupancyName,
      value: occupy.id,
    })) || [];

  const constructionTypeOptions =
    data?.constructionType?.map(cunstruct => ({
      label: cunstruct.constructionType,
      value: cunstruct.id,
    })) || [];

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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const showFieldAlert = msg => {
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Assessment Type</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Old Ward *</Text>
          <Dropdown
            style={styles.dropdown}
            data={wardDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Old Ward"
            value={oldWard}
            onChange={item => setOldWard(item.value)}
          />
          <Text style={styles.label}>New Ward *</Text>
          <Dropdown
            style={styles.dropdown}
            data={newWardOptions}
            labelField="label"
            valueField="value"
            placeholder="Select New Ward"
            value={newWard}
            onChange={item => setNewWard(item.value)}
          />
          <Text style={styles.label}>Ownership Type *</Text>
          <Dropdown
            style={styles.dropdown}
            data={ownershipDropdownOptions}
            labelField="label"
            valueField="label"
            placeholder="Select Ownership Type"
            value={ownershipType}
            onChange={item => setOwnershipType(item.label)}
          />
          <Text style={styles.label}>Property Type *</Text>
          <Dropdown
            style={styles.dropdown}
            data={propertyTypeDropdownOptions}
            labelField="label"
            valueField="label"
            placeholder="Select Property Type"
            value={propertyType}
            onChange={item => {
              setPropertyType(item.label);
              setPropertyTypeLabel(item.label); // store label to compare later
            }}
          />
          <Text style={styles.label}>Zone *</Text>
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
          <Text style={styles.label}>Owner Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="black"
            value={ownerName}
            onChangeText={setOwnerName}
            onFocus={() => showFieldAlert('Owner Name')}
          />
          <Text style={styles.label}>Gender *</Text>
          <Dropdown
            style={styles.dropdown}
            data={genderOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={gender}
            onChange={item => setGender(item.value)}
          />
          <Text style={styles.label}>Date of Birth *</Text>
          {/* DOB Date Picker */}
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDobPicker(true)}
          >
            <Text style={styles.dateText}>
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
          <Text style={styles.label}>Guardian Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Guardian Name"
            placeholderTextColor="black"
            value={guardianName}
            onChangeText={setGuardianName}
            onFocus={() => showFieldAlert('Guardian Name')}
          />
          <Text style={styles.label}>Relation *</Text>
          <Dropdown
            style={styles.dropdown}
            data={selectRelation}
            labelField="label"
            valueField="value"
            placeholder="Select Relation"
            value={relation}
            onChange={item => setRelation(item.value)}
          />
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="black"
            onFocus={() => showFieldAlert('Mobile Number')}
          />
          <Text style={styles.label}>Aadhaar Number *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={12}
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChangeText={setAadhaar}
            placeholderTextColor="black"
            onFocus={() => showFieldAlert('Aadhaar Number')}
          />
          <Text style={styles.label}>PAN Number *</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="characters"
            maxLength={10}
            placeholder="Enter PAN Number"
            value={pan}
            onChangeText={setPan}
            placeholderTextColor="black"
            onFocus={() => showFieldAlert('PAN Number')}
          />
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="black"
            onFocus={() => showFieldAlert('Email')}
          />
          <Text style={styles.label}>Member of Armed Forces? *</Text>
          <Dropdown
            style={styles.dropdown}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Member of Armed Forces?"
            value={armedForces}
            onChange={item => setArmedForces(item.value)}
          />
          <Text style={styles.label}>Specially Abled? *</Text>
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
          <Text style={styles.label}>Electricity K. No *</Text>
          <TextInput
            style={styles.input}
            placeholder="Electricity K. No (e.g. xxxx xxxx xxxx)"
            keyboardType="numeric"
            placeholderTextColor="black"
            maxLength={14}
            value={kno}
            onChangeText={setKno}
            onFocus={() => showFieldAlert('Electricity K. No')}
          />
          <Text style={styles.label}>ACC No *</Text>
          <TextInput
            style={styles.input}
            placeholder="ACC No"
            keyboardType="numeric"
            placeholderTextColor="black"
            value={accNo}
            onChangeText={setAccNo}
            onFocus={() => showFieldAlert('ACC No')}
          />
          <Text style={styles.label}>BIND/BOOK No *</Text>
          <TextInput
            style={styles.input}
            placeholder="BIND/BOOK No"
            placeholderTextColor="black"
            value={bindBookNo}
            onChangeText={setBindBookNo}
            onFocus={() => showFieldAlert('BIND/BOOK No')}
          />
          <Text style={styles.label}>Electricity Category *</Text>
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

        <Text style={styles.header}>Property Details</Text>
        <PropertyDetails
          khataNo={khataNo}
          setKhataNo={setKhataNo}
          plotNo={plotNo}
          setPlotNo={setPlotNo}
          villageName={villageName}
          setVillageName={setVillageName}
          plotArea={plotArea}
          setPlotArea={setPlotArea}
          roadWidth={roadWidth}
          setRoadWidth={setRoadWidth}
          noRoad={noRoad}
          setNoRoad={setNoRoad}
          showFieldAlert={showFieldAlert}
          styles={styles}
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
          <Text style={styles.label}>Mobile Tower *</Text>
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
                onFocus={() =>
                  showFieldAlert(
                    'Total Area Covered by Mobile Tower & Supporting Equipments',
                  )
                }
              />
              <Text style={styles.label}>
                Date of Installation of Mobile Tower *
              </Text>
              {/* Date Picker for Mobile Tower Installation Date */}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowInstallationDatePicker(true)}
              >
                <Text style={styles.dateText}>
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
          <Text style={styles.label}>
            Does Property Have Hoarding Board(s)? *
          </Text>
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
              <Text style={styles.label}>
                Total Area of Wall / Roof / Land (in Sq. Ft.) *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Total Area of Wall / Roof / Land (in Sq. Ft.) *"
                value={hoardingArea}
                onChangeText={setHoardingArea}
                placeholderTextColor="#000"
                onFocus={() =>
                  showFieldAlert('Total Area of Wall / Roof / Land')
                }
              />
              <Text style={styles.label}>
                Date of Installation of Hoarding Board(s) *
              </Text>
              {/* Date Picker for Hoarding Installation Date */}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowHoardingInstallationDatePicker(true)}
              >
                <Text style={styles.dateText}>
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
          <Text style={styles.label}>Is property a Petrol Pump? *</Text>
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
              <Text style={styles.label}>
                Total Area of Petrol Pump (in Sq. Ft.) *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Total Area of Petrol Pump (in Sq. Ft.) *"
                value={pumpArea}
                onChangeText={setPumpArea}
                placeholderTextColor="#000"
                onFocus={() => showFieldAlert('Total Area of Petrol Pump')}
              />
              <Text style={styles.label}>Date of Installation *</Text>
              {/* Date Picker for Petrol Pump Installation Date */}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowPumpInstallationDatePicker(true)}
              >
                <Text style={styles.dateText}>
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
          <Text style={styles.label}>Rainwater harvesting provision? *</Text>
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
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
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

        {propertyTypeLabel !== 'VACANT LAND' &&
          floorDetails.map((floor, index) => (
            <View key={index} style={styles.floorCard}>
              <Text style={styles.floorTitle}>Floor {index + 1}</Text>

              <Text style={styles.label}>Floor Name *</Text>
              <Dropdown
                style={styles.dropdown}
                data={floorNameOptions}
                labelField="label"
                valueField="label"
                placeholder="Select Floor Name"
                value={floor.floorName}
                onChange={item =>
                  updateFloorDetail(index, 'floorName', item.label)
                }
              />

              <Text style={styles.label}>Usage Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={usageTypeOptions}
                labelField="label"
                valueField="label"
                placeholder="Select Usage Type"
                value={floor.usageType}
                onChange={item =>
                  updateFloorDetail(index, 'usageType', item.label)
                }
              />

              <Text style={styles.label}>Occupancy Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={occupancyTypeOptions}
                labelField="label"
                valueField="label"
                placeholder="Select Occupancy Type"
                value={floor.occupancyType}
                onChange={item =>
                  updateFloorDetail(index, 'occupancyType', item.label)
                }
              />

              <Text style={styles.label}>Construction Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={constructionTypeOptions}
                labelField="label"
                valueField="label"
                placeholder="Select Construction Type"
                value={floor.constructionType}
                onChange={item =>
                  updateFloorDetail(index, 'constructionType', item.label)
                }
              />

              <Text style={styles.label}>Built Up Area (in Sq. Ft) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Built Up Area (in Sq. Ft)"
                keyboardType="numeric"
                placeholderTextColor="black"
                value={floor.builtUpArea}
                onChangeText={text =>
                  updateFloorDetail(index, 'builtUpArea', text)
                }
                onFocus={() => showFieldAlert('Built Up Area')}
              />

              <Text style={styles.label}>From Date (MM/YYYY) *</Text>
              {/* From Date */}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() =>
                  setDatePicker({ index, field: 'fromDate', show: true })
                }
              >
                <Text style={styles.dateText}>
                  {floor.fromDate || 'Select From Date (MM/YYYY)'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Upto Date (MM/YYYY) *</Text>
              {/* Upto Date */}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() =>
                  setDatePicker({ index, field: 'uptoDate', show: true })
                }
              >
                <Text style={styles.dateText}>
                  {floor.uptoDate || 'Select Upto Date (MM/YYYY)'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

        {propertyTypeLabel !== 'VACANT LAND' && (
          <TouchableOpacity onPress={addFloor} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add Floor</Text>
          </TouchableOpacity>
        )}

        {/* Render Date Picker only when needed */}
        {datePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            onChange={handleDateChange}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
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
    color: 'black',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 6,
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateInput: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#333',
  },
  floorCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  floorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  addBtn: {
    backgroundColor: '#2e86de',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ApplyAssessment;
