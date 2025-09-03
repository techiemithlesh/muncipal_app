import React, { useState, useEffect, useRef } from 'react';
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
  addressRef,
  cityRef,
  districtRef,
  stateRef,
  pincodeRef,
}) => (
  <View style={styles.section}>
    {title && <Text style={styles.header}>{title}</Text>}
    <Text style={styles.label}>Property Address *</Text>
    <TextInput
      ref={addressRef}
      style={styles.input}
      placeholder="Property Address *"
      placeholderTextColor="#000"
      value={address}
      onChangeText={setAddress}
    />
    <Text style={styles.label}>City *</Text>
    <TextInput
      ref={cityRef}
      style={styles.input}
      placeholder="City *"
      placeholderTextColor="#000"
      value={city}
      onChangeText={setCity}
    />
    <Text style={styles.label}>District *</Text>
    <TextInput
      ref={districtRef}
      style={styles.input}
      placeholder="District *"
      placeholderTextColor="#000"
      value={district}
      onChangeText={setDistrict}
    />
    <Text style={styles.label}>State *</Text>
    <TextInput
      ref={stateRef}
      style={styles.input}
      placeholder="State *"
      placeholderTextColor="#000"
      value={stateValue}
      onChangeText={setStateValue}
    />
    <Text style={styles.label}>Pincode *</Text>
    <TextInput
      ref={pincodeRef}
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
  // Create refs for all input fields for validation and focus
  const scrollViewRef = useRef(null);
  const ownerNameRef = useRef(null);
  const guardianNameRef = useRef(null);
  const mobileRef = useRef(null);
  const aadhaarRef = useRef(null);
  const panRef = useRef(null);
  const emailRef = useRef(null);
  const knoRef = useRef(null);
  const accNoRef = useRef(null);
  const bindBookNoRef = useRef(null);
  const khataNoRef = useRef(null);
  const plotNoRef = useRef(null);
  const villageNameRef = useRef(null);
  const plotAreaRef = useRef(null);
  const roadWidthRef = useRef(null);
  const noRoadRef = useRef(null);
  const propertyAddressRef = useRef(null);
  const cityRef = useRef(null);
  const districtRef = useRef(null);
  const stateRef = useRef(null);
  const pincodeRef = useRef(null);
  const correspondingAddressRef = useRef(null);
  const correspondingCityRef = useRef(null);
  const correspondingDistrictRef = useRef(null);
  const correspondingStateRef = useRef(null);
  const correspondingPincodeRef = useRef(null);
  const towerAreaRef = useRef(null);
  const hoardingAreaRef = useRef(null);
  const pumpAreaRef = useRef(null);
  const floorRefs = useRef([]);
  const wardNoRef = useRef(null);
  const oldWardRef = useRef(null);
  const newWardRef = useRef(null);
  const ownershipTypeRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const zoneRef = useRef(null);
  const genderRef = useRef(null);
  const relationRef = useRef(null);
  const armedForcesRef = useRef(null);
  const speciallyAbledRef = useRef(null);
  const electricityCategoryRef = useRef(null);
  const mobileTowerRef = useRef(null);
  const hoardingRef = useRef(null);
  const petrolPumpRef = useRef(null);
  const rainHarvestingRef = useRef(null);
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
      floorNameId: '',
      usageType: '',
      usageTypeId: '',
      occupancyType: '',
      occupancyTypeId: '',
      constructionType: '',
      constructionTypeId: '',
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
        floorNameId: '',
        usageType: '',
        usageTypeId: '',
        occupancyType: '',
        occupancyTypeId: '',
        constructionType: '',
        constructionTypeId: '',
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

  // Validation helper function to focus on invalid field
  const focusOnField = (ref, message) => {
    showAlert(message);
    if (ref && ref.current) {
      ref.current.focus();
    }
  };

  // Comprehensive validation function
  const validateAllFields = () => {
    // Assessment Type validations
    if (!oldWard) {
      showAlert('Please select Old Ward');
      return false;
    }
    if (!newWard) {
      showAlert('Please select New Ward');
      return false;
    }
    if (!ownershipType) {
      showAlert('Please select Ownership Type');
      return false;
    }
    if (!propertyType) {
      showAlert('Please select Property Type');
      return false;
    }
    // Zone is optional, default to Zone1 if not selected
    // if (!zone) {
    //   showAlert('Please select Zone');
    //   return false;
    // }

    // Owner Details validations
    if (!ownerName || ownerName.trim().length < 2) {
      focusOnField(
        ownerNameRef,
        'Please enter a valid Owner Name (minimum 2 characters)',
      );
      return false;
    }
    if (!gender) {
      showAlert('Please select Gender');
      return false;
    }
    if (!dob) {
      showAlert('Please select Date of Birth');
      return false;
    }
    if (!guardianName || guardianName.trim().length < 2) {
      focusOnField(
        guardianNameRef,
        'Please enter a valid Guardian Name (minimum 2 characters)',
      );
      return false;
    }
    if (!relation) {
      showAlert('Please select Relation');
      return false;
    }
    if (!mobile || !validateMobile(mobile)) {
      focusOnField(
        mobileRef,
        'Please enter a valid 10-digit Mobile Number starting with 6-9',
      );
      return false;
    }
    if (!aadhaar || !validateAadhaar(aadhaar)) {
      focusOnField(aadhaarRef, 'Please enter a valid 12-digit Aadhaar Number');
      return false;
    }
    if (!pan || !validatePAN(pan)) {
      focusOnField(
        panRef,
        'Please enter a valid PAN Number (e.g., ABCDE1234F)',
      );
      return false;
    }
    if (!email || !validateEmail(email)) {
      focusOnField(emailRef, 'Please enter a valid Email Address');
      return false;
    }
    if (!armedForces) {
      showAlert('Please select Armed Forces status');
      return false;
    }
    if (!speciallyAbled) {
      showAlert('Please select Specially Abled status');
      return false;
    }

    // Electricity Details validations
    if (!kno || kno.trim().length < 4) {
      focusOnField(knoRef, 'Please enter a valid Electricity K. No');
      return false;
    }
    if (!accNo || accNo.trim().length < 2) {
      focusOnField(accNoRef, 'Please enter a valid ACC No');
      return false;
    }
    if (!bindBookNo || bindBookNo.trim().length < 2) {
      focusOnField(bindBookNoRef, 'Please enter a valid BIND/BOOK No');
      return false;
    }
    if (!electricityCategory) {
      showAlert('Please select Electricity Category');
      return false;
    }

    // Property Details validations
    if (!khataNo || khataNo.trim().length < 1) {
      focusOnField(khataNoRef, 'Please enter Khata No');
      return false;
    }
    if (!plotNo || plotNo.trim().length < 1) {
      focusOnField(plotNoRef, 'Please enter Plot No');
      return false;
    }
    if (!villageName || villageName.trim().length < 2) {
      focusOnField(villageNameRef, 'Please enter Village Name');
      return false;
    }
    if (!plotArea || isNaN(plotArea) || parseFloat(plotArea) <= 0) {
      focusOnField(plotAreaRef, 'Please enter a valid Plot Area');
      return false;
    }
    if (!roadWidth || isNaN(roadWidth) || parseFloat(roadWidth) <= 0) {
      focusOnField(roadWidthRef, 'Please enter a valid Road Width');
      return false;
    }
    if (!noRoad || noRoad.trim().length < 1) {
      focusOnField(noRoadRef, 'Please enter No. of Road');
      return false;
    }

    // Property Address validations
    if (!propertyAddress || propertyAddress.trim().length < 5) {
      focusOnField(
        propertyAddressRef,
        'Please enter a valid Property Address (minimum 5 characters)',
      );
      return false;
    }
    if (!city || city.trim().length < 2) {
      focusOnField(cityRef, 'Please enter a valid City name');
      return false;
    }
    if (!district || district.trim().length < 2) {
      focusOnField(districtRef, 'Please enter a valid District name');
      return false;
    }
    if (!state || state.trim().length < 2) {
      focusOnField(stateRef, 'Please enter a valid State name');
      return false;
    }
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      focusOnField(pincodeRef, 'Please enter a valid 6-digit Pincode');
      return false;
    }

    // Corresponding Address validations (if checkbox is checked)
    if (isChecked) {
      if (!correspondingAddress || correspondingAddress.trim().length < 5) {
        focusOnField(
          correspondingAddressRef,
          'Please enter a valid Corresponding Address',
        );
        return false;
      }
      if (!correspondingCity || correspondingCity.trim().length < 2) {
        focusOnField(
          correspondingCityRef,
          'Please enter a valid Corresponding City',
        );
        return false;
      }
      if (!correspondingDistrict || correspondingDistrict.trim().length < 2) {
        focusOnField(
          correspondingDistrictRef,
          'Please enter a valid Corresponding District',
        );
        return false;
      }
      if (!correspondingState || correspondingState.trim().length < 2) {
        focusOnField(
          correspondingStateRef,
          'Please enter a valid Corresponding State',
        );
        return false;
      }
      if (!correspondingPincode || !/^\d{6}$/.test(correspondingPincode)) {
        focusOnField(
          correspondingPincodeRef,
          'Please enter a valid 6-digit Corresponding Pincode',
        );
        return false;
      }
    }

    // Extra Charges validations
    if (!mobileTower) {
      showAlert('Please select Mobile Tower status');
      return false;
    }
    if (mobileTower === 'yes') {
      if (!towerArea || towerArea.trim().length < 1) {
        focusOnField(towerAreaRef, 'Please enter Tower Area');
        return false;
      }
      if (!installationDate) {
        showAlert('Please select Mobile Tower Installation Date');
        return false;
      }
    }

    if (!hoarding) {
      showAlert('Please select Hoarding Board status');
      return false;
    }
    if (hoarding === 'yes') {
      if (!hoardingArea || hoardingArea.trim().length < 1) {
        focusOnField(hoardingAreaRef, 'Please enter Hoarding Area');
        return false;
      }
      if (!hoardingInstallationDate) {
        showAlert('Please select Hoarding Installation Date');
        return false;
      }
    }

    if (!petrolPump) {
      showAlert('Please select Petrol Pump status');
      return false;
    }
    if (petrolPump === 'yes') {
      if (!pumpArea || pumpArea.trim().length < 1) {
        focusOnField(pumpAreaRef, 'Please enter Pump Area');
        return false;
      }
      if (!pumpInstallationDate) {
        showAlert('Please select Pump Installation Date');
        return false;
      }
    }

    if (!rainHarvesting) {
      showAlert('Please select Rainwater Harvesting status');
      return false;
    }
    if (rainHarvesting === 'yes' && !completionDate) {
      showAlert('Please select Rainwater Harvesting Completion Date');
      return false;
    }

    // Floor Details validations (if not VACANT LAND)
    if (propertyTypeLabel !== 'VACANT LAND') {
      for (let i = 0; i < floorDetails.length; i++) {
        const floor = floorDetails[i];
        if (!floor.floorName) {
          showAlert(`Please select Floor Name for Floor ${i + 1}`);
          return false;
        }
        if (!floor.usageType) {
          showAlert(`Please select Usage Type for Floor ${i + 1}`);
          return false;
        }
        if (!floor.occupancyType) {
          showAlert(`Please select Occupancy Type for Floor ${i + 1}`);
          return false;
        }
        if (!floor.constructionType) {
          showAlert(`Please select Construction Type for Floor ${i + 1}`);
          return false;
        }
        if (
          !floor.builtUpArea ||
          isNaN(floor.builtUpArea) ||
          parseFloat(floor.builtUpArea) <= 0
        ) {
          showAlert(`Please enter a valid Built Up Area for Floor ${i + 1}`);
          if (floorRefs.current[i]) {
            floorRefs.current[i].focus();
          }
          return false;
        }
        if (!floor.fromDate) {
          showAlert(`Please select From Date for Floor ${i + 1}`);
          return false;
        }
        if (!floor.uptoDate) {
          showAlert(`Please select Upto Date for Floor ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    // Perform comprehensive validation
    if (!validateAllFields()) {
      return;
    }

    // Base form data
    const formData = {
      oldWard,
      newWard,
      ownershipType,
      ownershipTypeId: ownershipType, // Pass the ID
      propertyType,
      propertyTypeId: propertyType, // Pass the ID
      zone: zone || 'Zone1',
      zoneId: zone === 'Zone2' ? 2 : 1, // Default to Zone1 (ID: 1) if not selected
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
      waterConnectionDate: waterConnectionDate
        ? new Date(waterConnectionDate).toISOString().split('T')[0]
        : '',
      propertyAddress,
      city,
      district,
      state,
      pincode,
      dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
      ownerName,
      guardianName,
      correspondingAddress: isChecked ? correspondingAddress : '',
      correspondingCity: isChecked ? correspondingCity : '',
      correspondingDistrict: isChecked ? correspondingDistrict : '',
      correspondingState: isChecked ? correspondingState : '',
      correspondingPincode: isChecked ? correspondingPincode : '',
      mobileTower,
      towerArea,
      installationDate: installationDate
        ? new Date(installationDate).toISOString().split('T')[0]
        : '',
      hoarding,
      hoardingArea,
      hoardingInstallationDate: hoardingInstallationDate
        ? new Date(hoardingInstallationDate).toISOString().split('T')[0]
        : '',
      petrolPump,
      pumpArea,
      pumpInstallationDate: pumpInstallationDate
        ? new Date(pumpInstallationDate).toISOString().split('T')[0]
        : '',
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
        floorNameId: floor.floorNameId,
        usageType: floor.usageType,
        usageTypeId: floor.usageTypeId,
        occupancyType: floor.occupancyType,
        occupancyTypeId: floor.occupancyTypeId,
        constructionType: floor.constructionType,
        constructionTypeId: floor.constructionTypeId,
        builtUpArea: floor.builtUpArea,
        fromDate: floor.fromDate,
        uptoDate: floor.uptoDate,
      }));
    }
    console.log({ data: formData }, 'Apply Assesmet Data');
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
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        <Text style={styles.header}>Assessment Type</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Old Ward *</Text>
          <Dropdown
            useRef={wardNoRef}
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
            valueField="value"
            placeholder="Select Ownership Type"
            value={ownershipType}
            onChange={item => setOwnershipType(item.value)}
          />
          <Text style={styles.label}>Property Type *</Text>
          <Dropdown
            style={styles.dropdown}
            data={propertyTypeDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Property Type"
            value={propertyType}
            onChange={item => {
              setPropertyType(item.value);
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
            ref={ownerNameRef}
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="black"
            value={ownerName}
            onChangeText={setOwnerName}
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
            ref={guardianNameRef}
            style={styles.input}
            placeholder="Guardian Name"
            placeholderTextColor="black"
            value={guardianName}
            onChangeText={setGuardianName}
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
            ref={mobileRef}
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="black"
          />
          <Text style={styles.label}>Aadhaar Number *</Text>
          <TextInput
            ref={aadhaarRef}
            style={styles.input}
            keyboardType="numeric"
            maxLength={12}
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChangeText={setAadhaar}
            placeholderTextColor="black"
          />
          <Text style={styles.label}>PAN Number *</Text>
          <TextInput
            ref={panRef}
            style={styles.input}
            autoCapitalize="characters"
            maxLength={10}
            placeholder="Enter PAN Number"
            value={pan}
            onChangeText={setPan}
            placeholderTextColor="black"
          />
          <Text style={styles.label}>Email *</Text>
          <TextInput
            ref={emailRef}
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="black"
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
            ref={knoRef}
            style={styles.input}
            placeholder="Electricity K. No (e.g. xxxx xxxx xxxx)"
            keyboardType="numeric"
            placeholderTextColor="black"
            maxLength={14}
            value={kno}
            onChangeText={setKno}
          />
          <Text style={styles.label}>ACC No *</Text>
          <TextInput
            ref={accNoRef}
            style={styles.input}
            placeholder="ACC No"
            keyboardType="numeric"
            placeholderTextColor="black"
            value={accNo}
            onChangeText={setAccNo}
          />
          <Text style={styles.label}>BIND/BOOK No *</Text>
          <TextInput
            ref={bindBookNoRef}
            style={styles.input}
            placeholder="BIND/BOOK No"
            placeholderTextColor="black"
            value={bindBookNo}
            onChangeText={setBindBookNo}
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
          khataNoRef={khataNoRef}
          plotNoRef={plotNoRef}
          villageNameRef={villageNameRef}
          plotAreaRef={plotAreaRef}
          roadWidthRef={roadWidthRef}
          noRoadRef={noRoadRef}
          isEditable={true}
        />

        <Text style={styles.header}>Water Connection Details</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Water Connection No</Text>
          <TextInput
            style={styles.input}
            placeholder="Water Connection No"
            placeholderTextColor="black"
            value={waterConnectionNo}
            onChangeText={setWaterConnectionNo}
          />
          <Text style={styles.label}>Water Connection Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowWaterConnectionDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {waterConnectionDate
                ? new Date(waterConnectionDate).toLocaleDateString('en-GB')
                : 'Select Water Connection Date'}
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
              addressRef={correspondingAddressRef}
              cityRef={correspondingCityRef}
              districtRef={correspondingDistrictRef}
              stateRef={correspondingStateRef}
              pincodeRef={correspondingPincodeRef}
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
                ref={towerAreaRef}
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
                ref={hoardingAreaRef}
                style={styles.input}
                placeholder="Total Area of Wall / Roof / Land (in Sq. Ft.) *"
                value={hoardingArea}
                onChangeText={setHoardingArea}
                placeholderTextColor="#000"
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
                ref={pumpAreaRef}
                style={styles.input}
                placeholder="Total Area of Petrol Pump (in Sq. Ft.) *"
                value={pumpArea}
                onChangeText={setPumpArea}
                placeholderTextColor="#000"
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
                valueField="value"
                placeholder="Select Floor Name"
                value={floor.floorName}
                onChange={item => {
                  updateFloorDetail(index, 'floorName', item.label);
                  updateFloorDetail(index, 'floorNameId', item.value);
                }}
              />

              <Text style={styles.label}>Usage Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={usageTypeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Usage Type"
                value={floor.usageType}
                onChange={item => {
                  updateFloorDetail(index, 'usageType', item.label);
                  updateFloorDetail(index, 'usageTypeId', item.value);
                }}
              />

              <Text style={styles.label}>Occupancy Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={occupancyTypeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Occupancy Type"
                value={floor.occupancyType}
                onChange={item => {
                  updateFloorDetail(index, 'occupancyType', item.label);
                  updateFloorDetail(index, 'occupancyTypeId', item.value);
                }}
              />

              <Text style={styles.label}>Construction Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={constructionTypeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Construction Type"
                value={floor.constructionType}
                onChange={item => {
                  updateFloorDetail(index, 'constructionType', item.label);
                  updateFloorDetail(index, 'constructionTypeId', item.value);
                }}
              />

              <Text style={styles.label}>Built Up Area (in Sq. Ft) *</Text>
              <TextInput
                ref={el => (floorRefs.current[index] = el)}
                style={styles.input}
                placeholder="Built Up Area (in Sq. Ft)"
                keyboardType="numeric"
                placeholderTextColor="black"
                value={floor.builtUpArea}
                onChangeText={text =>
                  updateFloorDetail(index, 'builtUpArea', text)
                }
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
