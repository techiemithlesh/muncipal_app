import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import HeaderNavigation from '../Components/HeaderNavigation';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddressSection from './components/AddressSection';
import OwnerDetailsSection from './components/OwnerDetailsSection';
import ElectricityDetailsSection from './components/ElectricityDetailsSection';
import WaterConnectionDetailsSection from './components/WaterConnectionDetailsSection';
import ExtraChargesSection from './components/ExtraChargesSection';
import FloorDetailsSection from './components/FloorDetailsSection';
import PropertyDetails from './components/PropertyDetails';
import { handleValidation, scrollToInput } from './AssessmentValidation';
import { getToken } from '../utils/auth';
import { PROPERTY_API } from '../api/apiRoutes';
import { showToast } from '../utils/toast';
const ApplyAssessment = ({ navigation, route }) => {
  // Get data from route params if it's a reassessment or mutation
  const {
    id,
    isRessessment,
    isMutation,
    safData,
    ownerList,
    taxDetails,
    transDtls,
    memoDtls,
    tcVerfivication,
    paymentDtls,
  } = route?.params || {};

  // All state variables
  const [waterConnectionNo, setWaterConnectionNo] = useState('');
  const [waterConnectionDate, setWaterConnectionDate] = useState('');
  const [propertyTypeLabel, setPropertyTypeLabel] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [kno, setKno] = useState('');
  const [accNo, setAccNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  const [khataNo, setKhataNo] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [villageName, setVillageName] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [noRoad, setNoRoad] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [towerArea, setTowerArea] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [hoardingArea, setHoardingArea] = useState('');
  const [hoardingInstallationDate, setHoardingInstallationDate] = useState('');
  const [pumpArea, setPumpArea] = useState('');
  const [pumpInstallationDate, setPumpInstallationDate] = useState('');
  const [completionDate, setCompletionDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [oldWard, setOldWard] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [armedForces, setArmedForces] = useState('no');
  const [speciallyAbled, setSpeciallyAbled] = useState('no');
  const [electricityCategory, setElectricityCategory] = useState('');
  const [mobileTower, setMobileTower] = useState('no');
  const [hoarding, setHoarding] = useState('no');
  const [petrolPump, setPetrolPump] = useState('no');
  const [rainHarvesting, setRainHarvesting] = useState('no');
  const [data, setData] = useState(null);
  const [zone, setZone] = useState('');
  const [transferMode, setTransferMode] = useState('');
  const [propertyTransferPercentage, setPropertyTransferPercentage] =
    useState('');
  const [isChecked, setIsChecked] = useState(false);
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
  const [correspondingAddress, setCorrespondingAddress] = useState('');
  const [correspondingCity, setCorrespondingCity] = useState('');
  const [correspondingDistrict, setCorrespondingDistrict] = useState('');
  const [correspondingState, setCorrespondingState] = useState('');
  const [correspondingPincode, setCorrespondingPincode] = useState('');
  const [dob, setDob] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [error, setError] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [apartmentList, setApartmentList] = useState([]); // dropdown data
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(false);

  const apartmentDropdownOptions = [
    { label: 'Apartment A', value: 'A' },
    { label: 'Apartment B', value: 'B' },
  ];

  // Create refs for all form fields
  const scrollViewRef = useRef(null);
  const oldWardRef = useRef(null);
  const newWardRef = useRef(null);
  const ownershipTypeRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const zoneRef = useRef(null);
  const ownerNameRef = useRef(null);
  const genderRef = useRef(null);
  const guardianNameRef = useRef(null);
  const relationRef = useRef(null);
  const mobileRef = useRef(null);
  const aadhaarRef = useRef(null);
  const panRef = useRef(null);
  const emailRef = useRef(null);
  const armedForcesRef = useRef(null);
  const speciallyAbledRef = useRef(null);
  const knoRef = useRef(null);
  const accNoRef = useRef(null);
  const bindBookNoRef = useRef(null);
  const electricityCategoryRef = useRef(null);
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
  const mobileTowerRef = useRef(null);
  const towerAreaRef = useRef(null);
  const hoardingRef = useRef(null);
  const hoardingAreaRef = useRef(null);
  const petrolPumpRef = useRef(null);
  const pumpAreaRef = useRef(null);
  const rainHarvestingRef = useRef(null);
  const floorRefs = useRef([]);

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

  const updateFloorDetail = (index, field, value) => {
    const updated = [...floorDetails];
    updated[index][field] = value;
    setFloorDetails(updated);
  };
  const handleDateChange1 = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
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
    if (!isChecked) {
      console.log('Checkbox checked - Show corresponding address fields');
    } else {
      console.log('Checkbox unchecked - Hide corresponding address fields');
    }
  };

  // 🔹 Fetch Apartments from API when Flats is selected
  useEffect(() => {
    if (propertyTypeLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING') {
      fetchApartments();
    }
  }, [propertyTypeLabel]);

  const fetchApartments = async () => {
    try {
      setLoadingApartments(true);
      const token = await getToken();
      const body = oldWard ? { oldWardId: oldWard } : {};
      console.log('tooek', body);

      const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('responmse', response);
      if (response.data?.status) {
        const formatted = response.data.data.map(item => ({
          label: `${item.apartmentName} (${item.aptCode})`, // 👈 show name + code in dropdown
          value: item.id, // 👈 use id as valu
        }));

        setApartmentList(formatted);
        console.log('Formatted apartments:', formatted);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoadingApartments(false);
    }
  };

  const Validate = () => {
    let newErrors = {};

    if (!oldWard) {
      newErrors.oldWard = 'Old Ward is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Old Ward');
      return false; // stop at first error
    }

    if (!newWard) {
      newErrors.newWard = 'New Ward is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select New Ward');
      return false;
    }

    if (!ownershipType) {
      newErrors.ownershipType = 'Ownership Type is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Ownership Type');
      return false;
    }

    if (!propertyType) {
      newErrors.propertyType = 'Property Type is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Property Type');
      return false;
    }

    if (!zone) {
      newErrors.zone = 'Zone is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Zone');
      return false;
    }
    if (!ownerName) {
      newErrors.ownerName = 'Owner Name is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Owner Name');
      return false;
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Gender');
      return false;
    }

    if (!relation) {
      newErrors.relation = 'Relation is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Select Relation');
      return false;
    }

    if (!mobile) {
      newErrors.mobile = 'Mobile is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Mobile Number');
      return false;
    }

    if (!aadhaar) {
      newErrors.aadhaar = 'Aadhaar is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Aadhaar Number');
      return false;
    }

    if (!pan) {
      newErrors.pan = 'PAN is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter PAN Number');
      return false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Email');
      return false;
    }

    if (!guardianName) {
      newErrors.guardianName = 'Guardian Name is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Guardian Name');
      return false;
    }
    // If we reached here, all fields are valid
    setError(prev => ({ ...prev, ...newErrors })); // clear any previous errors
    return true;
  };

  const handleSubmit = async () => {
    console.log(error);

    if (!Validate()) {
      return; // stop if invalid
    }
    const formData = {
      oldWard,
      newWard,
      ownershipType,
      propertyType,
      zone,
      transferMode: isMutation ? transferMode : '',
      propertyTransferPercentage: isMutation ? propertyTransferPercentage : '',
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
      apartmentDetail,
      selectedDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : '', // YYYY-MM-DD
    };
    console.log('Foe,dnmg', formData);

    if (propertyTypeLabel !== 'VACANT LAND') {
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

    if (isRessessment) {
      navigation.navigate('RessesmentSummry', { data: formData });
    } else if (isMutation) {
      navigation.navigate('MutationScreen', { data: formData });
    } else {
      navigation.navigate('AssessmentSummary', { data: formData });
    }
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

  // Dropdown options
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

  const transferModeOptions = [
    { label: 'Sale', value: '1' },
    { label: 'Gift', value: '2' },
    { label: 'Will', value: '3' },
    { label: 'Lease', value: '4' },
    { label: 'Partition', value: '5' },
    { label: 'Succession', value: '6' },
  ];

  // Populate form data when it's a reassessment or mutation
  useEffect(() => {
    if ((isRessessment || isMutation) && safData && data) {
      console.log('Populating reassessment data:', safData);
      console.log('Owner list:', ownerList);
      console.log('Master data:', data);

      // Basic Details - Assessment Type
      const oldWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.wardNo,
      );
      setOldWard(oldWardOption?.id || '');

      const newWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.newWardNo,
      );
      setNewWard(newWardOption?.id || '');

      const ownershipOption = data?.ownershipType?.find(
        item => item.ownershipType === safData.ownershipType,
      );
      setOwnershipType(ownershipOption?.id || '');

      const propertyTypeOption = data?.propertyType?.find(
        item => item.propertyType === safData.propertyType,
      );
      setPropertyType(propertyTypeOption?.id || '');
      setPropertyTypeLabel(safData.propertyType || '');

      const zoneValue = safData.zone || '';
      let mappedZone = '';
      if (
        zoneValue.toLowerCase().includes('zone 1') ||
        zoneValue.toLowerCase().includes('zone1')
      ) {
        mappedZone = 'Zone1';
      } else if (
        zoneValue.toLowerCase().includes('zone 2') ||
        zoneValue.toLowerCase().includes('zone2')
      ) {
        mappedZone = 'Zone2';
      } else {
        mappedZone = zoneValue;
      }
      setZone(mappedZone);

      // Property Details
      setKhataNo(safData.khataNo || '');
      setPlotNo(safData.plotNo || '');
      setVillageName(safData.villageMaujaName || '');
      setPlotArea(safData.areaOfPlot || '');
      setRoadWidth(safData.roadWidth || '');

      // Populate owner details if available
      if (ownerList && ownerList.length > 0) {
        const owner = ownerList[0];
        console.log('Setting owner data:', owner);

        setOwnerName(owner.ownerName || '');
        const genderValue = owner.gender?.toLowerCase() || '';
        setGender(genderValue);
        setDob(owner.dob || '');
        setGuardianName(owner.guardianName || '');

        const relationOption = selectRelation.find(
          item => item.label === owner.relationType,
        );
        setRelation(relationOption?.value || '');

        setMobile(owner.mobileNo || '');
        setAadhaar(owner.aadharNo || '');
        setPan(owner.panNo || '');
        setEmail(owner.email || '');
        setArmedForces(owner.isArmedForce ? 'yes' : 'no');
        setSpeciallyAbled(owner.isSpeciallyAbled ? 'yes' : 'no');
      }

      // Electricity Details
      setKno(safData.electConsumerNo || '');
      setAccNo(safData.electAccNo || '');
      setBindBookNo(safData.electBindBookNo || '');

      const electricityCategoryOption = selectelectcate.find(
        item => item.label === safData.electConsCategory,
      );
      setElectricityCategory(electricityCategoryOption?.value || '');

      // Water Connection Details
      setWaterConnectionNo(safData.waterConnNo || '');
      setWaterConnectionDate(safData.waterConnDate || '');

      // Property Address
      setPropertyAddress(safData.propAddress || '');
      setCity(safData.propCity || '');
      setDistrict(safData.propDist || '');
      setState(safData.propState || '');
      setPincode(safData.propPinCode || '');

      // Corresponding Address if different
      if (safData.isCorrAddDiffer) {
        setIsChecked(true);
        setCorrespondingAddress(safData.corrAddress || '');
        setCorrespondingCity(safData.corrCity || '');
        setCorrespondingDistrict(safData.corrDist || '');
        setCorrespondingState(safData.corrState || '');
        setCorrespondingPincode(safData.corrPinCode || '');
      }

      // Extra Charges
      setMobileTower(safData.isMobileTower ? 'yes' : 'no');
      setTowerArea(safData.towerArea || '');
      setInstallationDate(safData.towerInstallationDate || '');
      setHoarding(safData.isHoardingBoard ? 'yes' : 'no');
      setHoardingArea(safData.hoardingArea || '');
      setHoardingInstallationDate(safData.hoardingInstallationDate || '');
      setPetrolPump(safData.isPetrolPump ? 'yes' : 'no');
      setPumpArea(safData.underGroundArea || '');
      setPumpInstallationDate(safData.petrolPumpCompletionDate || '');
      setRainHarvesting(safData.isWaterHarvesting ? 'yes' : 'no');
      setCompletionDate(
        safData.petrolPumpCompletionDate
          ? new Date(safData.petrolPumpCompletionDate)
          : null,
      );

      // Populate floor details from existing data
      if (safData.floors && safData.floors.length > 0) {
        console.log('Setting floor data:', safData.floors);

        const populatedFloorDetails = safData.floors.map(floor => {
          const floorNameOption = data?.floorType?.find(
            item => item.floorName === floor.floorName,
          );
          const usageTypeOption = data?.usageType?.find(
            item => item.usageType === floor.usageType,
          );
          const occupancyTypeOption = data?.occupancyType?.find(
            item => item.occupancyName === floor.occupancyName,
          );
          const constructionTypeOption = data?.constructionType?.find(
            item => item.constructionType === floor.constructionType,
          );

          return {
            floorName: floorNameOption?.id || floor.floorName || '',
            usageType: usageTypeOption?.id || floor.usageType || '',
            occupancyType: occupancyTypeOption?.id || floor.occupancyName || '',
            constructionType:
              constructionTypeOption?.id || floor.constructionType || '',
            builtUpArea: floor.builtupArea || '',
            fromDate: floor.dateFrom || '',
            uptoDate: floor.dateUpto || '',
          };
        });

        setFloorDetails(populatedFloorDetails);
        console.log('Floor details populated:', populatedFloorDetails);
      }

      console.log('Reassessment/Mutation data populated successfully');
    }
  }, [isRessessment, isMutation, safData, ownerList, data]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        {/* Assessment Type Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>
            {isRessessment
              ? 'Reassessment Type'
              : isMutation
              ? 'Mutation Type'
              : 'Assessment Type'}
          </Text>
          <View style={styles.card}>
            <Text style={[styles.label, error.oldWard && styles.errorLabel]}>
              Old Ward *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.oldWard && styles.errorInput]}
              data={wardDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Old Ward"
              value={oldWard}
              onChange={item => setOldWard(item.value)}
              disable={isRessessment || isMutation}
            />
            {error.oldWard && (
              <Text style={styles.errorText}>{error.oldWard}</Text>
            )}

            <Text style={[styles.label, error.newWard && styles.errorLabel]}>
              New Ward *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.newWard && styles.errorInput]}
              data={newWardOptions}
              labelField="label"
              valueField="value"
              placeholder="Select New Ward"
              value={newWard}
              onChange={item => setNewWard(item.value)}
              disable={isRessessment || isMutation}
            />
            {error.newWard && (
              <Text style={styles.errorText}>{error.newWard}</Text>
            )}

            <Text
              style={[styles.label, error.ownershipType && styles.errorLabel]}
            >
              Ownership Type *
            </Text>
            <Dropdown
              style={[
                styles.dropdown,
                error.ownershipType && styles.errorInput,
              ]}
              data={ownershipDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Ownership Type"
              value={ownershipType}
              onChange={item => setOwnershipType(item.value)}
              disable={isRessessment || isMutation}
            />
            {error.ownershipType && (
              <Text style={styles.errorText}>{error.ownershipType}</Text>
            )}

            <Text
              style={[styles.label, error.propertyType && styles.errorLabel]}
            >
              Property Type *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.propertyType && styles.errorInput]}
              data={propertyTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Property Type"
              value={propertyType}
              onChange={item => {
                setPropertyType(item.value);
                setPropertyTypeLabel(item.label);
              }}
              disable={isRessessment || isMutation}
            />
            {error.propertyType && (
              <Text style={styles.errorText}>{error.propertyType}</Text>
            )}

            {propertyTypeLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING' && (
              <View>
                {/* Date Picker */}
                <Text
                  style={[
                    styles.label,
                    error.ownershipType && styles.errorLabel,
                  ]}
                >
                  Select Date *
                </Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {selectedDate
                      ? selectedDate.toISOString().split('T')[0] // Y-M-D format
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange1}
                  />
                )}

                {/* Apartment Details Dropdown */}
                <Text
                  style={[
                    styles.label,
                    error.ownershipType && styles.errorLabel,
                  ]}
                >
                  Appartment Datails *
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    error.propertyType && styles.errorInput,
                  ]}
                  data={apartmentList}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Apartment"
                  value={apartmentDetail}
                  onChange={item => setApartmentDetail(item.value)}
                />
              </View>
            )}

            <Text style={[styles.label, error.zone && styles.errorLabel]}>
              Zone *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.zone && styles.errorInput]}
              data={[
                { label: 'Zone 1', value: '1' },
                { label: 'Zone 2', value: '2' },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Zone"
              value={zone}
              onChange={item => setZone(item.value)}
              disable={isRessessment || isMutation}
            />
            {error.zone && <Text style={styles.errorText}>{error.zone}</Text>}
            <Text style={styles.infoText}>
              Zone 1: Over bridge to Saheed chowk.
            </Text>
            <Text style={styles.infoText}>
              Zone 2: Rest area other than Zone 1.
            </Text>

            {/* Mutation-specific fields */}
            {isMutation && (
              <>
                <Text style={styles.label}>Mode of Ownership Transfer *</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={transferModeOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Mode of Ownership Transfer"
                  value={transferMode}
                  onChange={item => setTransferMode(item.value)}
                />
                <Text style={styles.label}>Property Transfer (0-100%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage (0-100)"
                  keyboardType="numeric"
                  value={propertyTransferPercentage}
                  onChangeText={setPropertyTransferPercentage}
                  maxLength={3}
                />
              </>
            )}
          </View>
        </View>

        {/* Owner Details Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Owner Details</Text>
          <View style={styles.card}>
            <OwnerDetailsSection
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              gender={gender}
              setGender={setGender}
              genderOptions={genderOptions}
              dob={dob}
              setDob={setDob}
              showDobPicker={showDobPicker}
              setShowDobPicker={setShowDobPicker}
              guardianName={guardianName}
              setGuardianName={setGuardianName}
              relation={relation}
              setRelation={setRelation}
              selectRelation={selectRelation}
              mobile={mobile}
              setMobile={setMobile}
              aadhaar={aadhaar}
              setAadhaar={setAadhaar}
              pan={pan}
              setPan={setPan}
              email={email}
              setEmail={setEmail}
              armedForces={armedForces}
              setArmedForces={setArmedForces}
              speciallyAbled={speciallyAbled}
              setSpeciallyAbled={setSpeciallyAbled}
              yesNoOptions={yesNoOptions}
              isRessessment={isRessessment}
              isMutation={isMutation}
              error={error}
              ownerNameRef={ownerNameRef}
              genderRef={genderRef}
              guardianNameRef={guardianNameRef}
              relationRef={relationRef}
              mobileRef={mobileRef}
              aadhaarRef={aadhaarRef}
              panRef={panRef}
              emailRef={emailRef}
              armedForcesRef={armedForcesRef}
              speciallyAbledRef={speciallyAbledRef}
            />
          </View>
        </View>

        {/* Electricity Details Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Electricity Details</Text>
          <View style={styles.card}>
            <ElectricityDetailsSection
              kno={kno}
              setKno={setKno}
              accNo={accNo}
              setAccNo={setAccNo}
              bindBookNo={bindBookNo}
              setBindBookNo={setBindBookNo}
              electricityCategory={electricityCategory}
              setElectricityCategory={setElectricityCategory}
              selectelectcate={selectelectcate}
              isRessessment={isRessessment}
              isMutation={isMutation}
              error={error}
              knoRef={knoRef}
              accNoRef={accNoRef}
              bindBookNoRef={bindBookNoRef}
              electricityCategoryRef={electricityCategoryRef}
            />
          </View>
        </View>

        {/* Water Connection Details Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Water Connection Details</Text>
          <View style={styles.card}>
            <WaterConnectionDetailsSection
              waterConnectionNo={waterConnectionNo}
              setWaterConnectionNo={setWaterConnectionNo}
              waterConnectionDate={waterConnectionDate}
              setWaterConnectionDate={setWaterConnectionDate}
              showWaterConnectionDatePicker={showWaterConnectionDatePicker}
              setShowWaterConnectionDatePicker={
                setShowWaterConnectionDatePicker
              }
              isRessessment={isRessessment}
              isMutation={isMutation}
            />
          </View>
        </View>

        {/* Property Details Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Property Details</Text>
          <View style={styles.card}>
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
              // noRoad={noRoad}
              setNoRoad={setNoRoad}
              showFieldAlert={msg => {}}
              styles={styles}
              error={error}
              khataNoRef={khataNoRef}
              plotNoRef={plotNoRef}
              villageNameRef={villageNameRef}
              plotAreaRef={plotAreaRef}
              roadWidthRef={roadWidthRef}
              // noRoadRef={noRoadRef}
            />
          </View>
        </View>

        {/* Property Address Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Property Address</Text>
          <View style={styles.card}>
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
              isRessessment={isRessessment}
              isMutation={isMutation}
              error={error}
              addressRef={propertyAddressRef}
              cityRef={cityRef}
              districtRef={districtRef}
              stateRef={stateRef}
              pincodeRef={pincodeRef}
            />
          </View>
        </View>

        {/* Corresponding Address Section */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleCheckboxToggle}
            disabled={isRessessment || isMutation}
          >
            <View style={[styles.checkbox, isChecked && styles.checked]} />
            <Text style={styles.checkboxLabel}>
              If Corresponding Address Different from Property Address
            </Text>
          </TouchableOpacity>
          {isChecked && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Corresponding Address</Text>
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
                isRessessment={isRessessment}
                isMutation={isMutation}
                error={error}
                addressRef={correspondingAddressRef}
                cityRef={correspondingCityRef}
                districtRef={correspondingDistrictRef}
                stateRef={correspondingStateRef}
                pincodeRef={correspondingPincodeRef}
              />
            </View>
          )}
        </View>

        {/* Extra Charges Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Extra Charges</Text>
          <View style={styles.card}>
            <ExtraChargesSection
              mobileTower={mobileTower}
              setMobileTower={setMobileTower}
              towerArea={towerArea}
              setTowerArea={setTowerArea}
              installationDate={installationDate}
              setInstallationDate={setInstallationDate}
              showInstallationDatePicker={showInstallationDatePicker}
              setShowInstallationDatePicker={setShowInstallationDatePicker}
              hoarding={hoarding}
              setHoarding={setHoarding}
              hoardingArea={hoardingArea}
              setHoardingArea={setHoardingArea}
              hoardingInstallationDate={hoardingInstallationDate}
              setHoardingInstallationDate={setHoardingInstallationDate}
              showHoardingInstallationDatePicker={
                showHoardingInstallationDatePicker
              }
              setShowHoardingInstallationDatePicker={
                setShowHoardingInstallationDatePicker
              }
              petrolPump={petrolPump}
              setPetrolPump={setPetrolPump}
              pumpArea={pumpArea}
              setPumpArea={setPumpArea}
              pumpInstallationDate={pumpInstallationDate}
              setPumpInstallationDate={setPumpInstallationDate}
              showPumpInstallationDatePicker={showPumpInstallationDatePicker}
              setShowPumpInstallationDatePicker={
                setShowPumpInstallationDatePicker
              }
              rainHarvesting={rainHarvesting}
              setRainHarvesting={setRainHarvesting}
              completionDate={completionDate}
              setCompletionDate={setCompletionDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              yesNoOptions={yesNoOptions}
              isRessessment={isRessessment}
              isMutation={isMutation}
              error={error}
              mobileTowerRef={mobileTowerRef}
              towerAreaRef={towerAreaRef}
              hoardingRef={hoardingRef}
              hoardingAreaRef={hoardingAreaRef}
              petrolPumpRef={petrolPumpRef}
              pumpAreaRef={pumpAreaRef}
              rainHarvestingRef={rainHarvestingRef}
            />
          </View>
        </View>

        {/* Floor Details Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Floor Details</Text>
          <View style={styles.card}>
            <FloorDetailsSection
              propertyTypeLabel={propertyTypeLabel}
              floorDetails={floorDetails}
              updateFloorDetail={updateFloorDetail}
              addFloor={addFloor}
              datePicker={datePicker}
              setDatePicker={setDatePicker}
              floorNameOptions={floorNameOptions}
              usageTypeOptions={usageTypeOptions}
              occupancyTypeOptions={occupancyTypeOptions}
              constructionTypeOptions={constructionTypeOptions}
              isRessessment={isRessessment}
              isMutation={isMutation}
              error={error}
              floorRefs={floorRefs}
            />
          </View>
        </View>

        {/* Date Picker */}
        {datePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Submit Button */}
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
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
    paddingLeft: 4,
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
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  errorInput: {
    borderColor: '#e74c3c',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorLabel: {
    color: '#e74c3c',
  },
  infoText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  dropdown: {
    height: 50,
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 4,
    marginRight: 12,
  },
  checked: {
    backgroundColor: '#3498db',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flexShrink: 1,
    fontWeight: '500',
  },
  dateInput: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#e1e8ed',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    color: '#333',
  },
  floorCard: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    elevation: 1,
  },
  floorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#2c3e50',
  },
  addBtn: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    fontWeight: '500',
  },
});

export default ApplyAssessment;
