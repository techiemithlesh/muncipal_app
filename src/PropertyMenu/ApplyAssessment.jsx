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
  const [error, setError] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apartmentList, setApartmentList] = useState([]);
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(false);

  // MULTIPLE OWNERS STATE
  const [ownerDetails, setOwnerDetails] = useState([
    {
      ownerName: '',
      gender: '',
      dob: '',
      guardianName: '',
      relation: '',
      mobile: '',
      aadhaar: '',
      pan: '',
      email: '',
      armedForces: 'no',
      speciallyAbled: 'no',
    },
  ]);

  // Date picker for owners
  const [ownerDatePicker, setOwnerDatePicker] = useState({
    index: null,
    show: false,
  });

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
  const ownerRefs = useRef([]);

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

  // OWNER FUNCTIONS
  const updateOwnerDetail = (index, field, value) => {
    const updated = [...ownerDetails];
    updated[index][field] = value;
    setOwnerDetails(updated);
  };

  const addOwner = () => {
    setOwnerDetails(prev => [
      ...prev,
      {
        ownerName: '',
        gender: '',
        dob: '',
        guardianName: '',
        relation: '',
        mobile: '',
        aadhaar: '',
        pan: '',
        email: '',
        armedForces: 'no',
        speciallyAbled: 'no',
      },
    ]);
  };

  const removeOwner = index => {
    if (ownerDetails.length > 1) {
      const updated = ownerDetails.filter((_, i) => i !== index);
      setOwnerDetails(updated);
    } else {
      showToast('error', 'At least one owner is required');
    }
  };

  const handleOwnerDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const { index } = ownerDatePicker;
      updateOwnerDetail(index, 'dob', formatted);
    }
    setOwnerDatePicker({ index: null, show: false });
  };

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

  const removeFloor = index => {
    if (floorDetails.length > 1) {
      const updated = floorDetails.filter((_, i) => i !== index);
      setFloorDetails(updated);
    } else {
      showToast('error', 'At least one floor is required');
    }
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      console.log('Checkbox checked - Show corresponding address fields');
    } else {
      console.log('Checkbox unchecked - Hide corresponding address fields');
    }
  };

  // Fetch Apartments from API when Flats is selected
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
      console.log('token', body);

      const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      if (response.data?.status) {
        const formatted = response.data.data.map(item => ({
          label: `${item.apartmentName} (${item.aptCode})`,
          value: item.id,
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
      return false;
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

    // Validate each owner
    for (let i = 0; i < ownerDetails.length; i++) {
      const owner = ownerDetails[i];
      const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/; // Only letters and spaces

      if (!owner.ownerName) {
        newErrors[`ownerName_${i}`] = 'Owner Name is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Enter Owner Name for Owner ${i + 1}`);
        return false;
      } else if (!nameRegex.test(owner.ownerName)) {
        newErrors[`ownerName_${i}`] =
          'Owner Name can only contain letters and spaces';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Owner Name for Owner ${i + 1} is invalid`);
        return false;
      }

      if (!owner.guardianName) {
        newErrors[`guardianName_${i}`] = 'Guardian Name is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Enter Guardian Name for Owner ${i + 1}`);
        return false;
      } else if (!nameRegex.test(owner.guardianName)) {
        newErrors[`guardianName_${i}`] =
          'Guardian Name can only contain letters and spaces';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Guardian Name for Owner ${i + 1} is invalid`);
        return false;
      }

      if (!owner.gender) {
        newErrors[`gender_${i}`] = 'Gender is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select Gender for Owner ${i + 1}`);
        return false;
      }
      if (!owner.dob) {
        newErrors[`dob_${i}`] = 'dob is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `dob dob for Owner ${i + 1}`);
        return false;
      }
      if (!owner.relation) {
        newErrors[`relation_${i}`] = 'Relation is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select relation for Owner ${i + 1}`);
        return false;
      }

      if (!owner.relation) {
        newErrors[`relation_${i}`] = 'Relation is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select Relation for Owner ${i + 1}`);
        return false;
      }

      if (!owner.mobile) {
        newErrors[`mobile_${i}`] = 'Mobile is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Enter Mobile Number for Owner ${i + 1}`);
        return false;
      } else if (!/^\d{10}$/.test(owner.mobile)) {
        newErrors[`mobile_${i}`] = 'Mobile number must be 10 digits';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast(
          'error',
          `Mobile Number for Owner ${i + 1} must be 10 digits`,
        );
        return false;
      }

      if (!owner.aadhaar) {
        newErrors[`aadhaar_${i}`] = 'Aadhaar is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Enter Aadhaar Number for Owner ${i + 1}`);
        return false;
      } else if (!/^\d{12}$/.test(owner.aadhaar)) {
        newErrors[`mobile_${i}`] = 'Aadhaar number must be 12 digits';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Aadhaar Number must be 12 digits`);
        return false;
      }
    }
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,./-]+$/; // letters, numbers, space, comma, dot, slash, dash
    const pincodeRegex = /^[0-9]{6}$/;
    // Khata No - required + alphanumeric
    if (!khataNo) {
      newErrors.khataNo = 'Khata No is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Khata No');
      return false;
    } else if (!addressRegex.test(khataNo)) {
      newErrors.khataNo = 'Invalid Khata No';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Khata No can only contain letters, numbers, , . / -');
      return false;
    }

    // Plot No - required + alphanumeric
    if (!plotNo) {
      newErrors.plotNo = 'Plot No is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Plot No');
      return false;
    } else if (!addressRegex.test(plotNo)) {
      newErrors.plotNo = 'Invalid Plot No';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Plot No can only contain letters, numbers, , . / -');
      return false;
    }

    // Village Name - required + only alphabets
    if (!villageName) {
      newErrors.villageName = 'Village Name is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Village Name');
      return false;
    } else if (!alphabetRegex.test(villageName)) {
      newErrors.villageName = 'Invalid Village Name';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Village Name must contain only letters');
      return false;
    }

    // Plot Area - required + must be number
    if (!plotArea) {
      newErrors.plotArea = 'Plot Area is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Plot Area');
      return false;
    } else if (isNaN(plotArea)) {
      newErrors.plotArea = 'Plot Area must be a number';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Plot Area must be numeric');
      return false;
    }

    // Road Width - required + must be number
    if (!roadWidth) {
      newErrors.roadWidth = 'Road Width is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Road Width');
      return false;
    } else if (isNaN(roadWidth)) {
      newErrors.roadWidth = 'Road Width must be a number';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Road Width must be numeric');
      return false;
    }

    // Example extra: Pincode (if you add it)
    if (pincode && !pincodeRegex.test(pincode)) {
      newErrors.pincode = 'Invalid Pincode';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Pincode must be exactly 6 digits');
      return false;
    }

    // Helper regex

    // Address validation
    if (!propertyAddress) {
      newErrors.address = 'Address is required';
      showToast('error', 'Enter Address');
      isValid = false;
    } else if (!addressRegex.test(propertyAddress)) {
      newErrors.address = 'Invalid Address';
      showToast('error', 'Address can contain letters, numbers, and ,.-/');
      isValid = false;
    }

    // City validation
    if (!city) {
      newErrors.city = 'City is required';
      showToast('error', 'Enter City');
      isValid = false;
    } else if (!alphabetRegex.test(city)) {
      newErrors.city = 'City should contain only letters';
      showToast('error', 'City should contain only letters');
      isValid = false;
    }

    // District validation
    if (!district) {
      newErrors.district = 'District is required';
      showToast('error', 'Enter District');
      isValid = false;
    } else if (!alphabetRegex.test(district)) {
      newErrors.district = 'District should contain only letters';
      showToast('error', 'District should contain only letters');
      isValid = false;
    }

    // State validation
    if (!state) {
      newErrors.state = 'State is required';
      showToast('error', 'Enter State');
      isValid = false;
    } else if (!alphabetRegex.test(state)) {
      newErrors.state = 'State should contain only letters';
      showToast('error', 'State should contain only letters');
      isValid = false;
    }

    // Pincode validation
    if (!pincode) {
      newErrors.pincode = 'Pincode is required';
      showToast('error', 'Enter Pincode');
      isValid = false;
    } else if (!pincodeRegex.test(pincode)) {
      newErrors.pincode = 'Pincode should be 6 digits';
      showToast('error', 'Pincode should be 6 digits');
      isValid = false;
    }

    if (mobileTower === 'yes' || mobileTower === true) {
      if (!towerArea) {
        newErrors.towerArea = 'Tower area is required';
        showToast('error', 'Enter Tower Area');
        isValid = false;
      }
      if (!installationDate) {
        newErrors.installationDate = 'Installation date is required';
        showToast('error', 'Select Tower Installation Date');
        isValid = false;
      }
    }

    // Hoarding
    // Hoarding
    if (hoarding === 'yes') {
      if (!hoardingArea) {
        newErrors.hoardingArea = 'Hoarding area is required';
        showToast('error', 'Enter Hoarding Area');
        isValid = false;
      }
      if (!hoardingInstallationDate) {
        newErrors.hoardingInstallationDate =
          'Hoarding Installation Date is required';
        showToast('error', 'Select Hoarding Installation Date');
        isValid = false;
      }
    }

    // Petrol Pump
    if (petrolPump === 'yes') {
      if (!pumpArea) {
        newErrors.pumpArea = 'Pump area is required';
        showToast('error', 'Enter Pump Area');
        isValid = false;
      }
      if (!pumpInstallationDate) {
        newErrors.pumpInstallationDate = 'Pump Installation Date is required';
        showToast('error', 'Select Pump Installation Date');
        isValid = false;
      }
    }

    // Rain Harvesting
    if (rainHarvesting === 'yes') {
      if (!completionDate) {
        newErrors.completionDate = 'Completion date is required';
        showToast('error', 'Select Rain Harvesting Completion Date');
        isValid = false;
      }
    }

    if (floorDetails && floorDetails.length > 0) {
      floorDetails.forEach((floor, index) => {
        const floorErrors = {};

        if (!floor.floorName) {
          floorErrors.floorName = 'Floor name is required';
          showToast('error', `Select Floor Name for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.usageType) {
          floorErrors.usageType = 'Usage type is required';
          showToast('error', `Select Usage Type for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.constructionType) {
          floorErrors.constructionType = 'Construction type is required';
          showToast('error', `Select Construction Type for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.occupancyType) {
          floorErrors.occupancyType = 'Occupancy type is required';
          showToast('error', `Select Occupancy Type for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.builtUpArea || floor.builtUpArea <= 0) {
          floorErrors.builtUpArea = 'Built-up area is required and must be > 0';
          showToast('error', `Enter Built-up Area for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.fromDate) {
          floorErrors.fromDate = 'Start date is required';
          showToast('error', `Select Start Date for Floor ${index + 1}`);
          isValid = false;
        }

        if (!floor.uptoDate) {
          floorErrors.uptoDate = 'End date is required';
          showToast('error', `Select End Date for Floor ${index + 1}`);
          isValid = false;
        }

        if (Object.keys(floorErrors).length > 0) {
          newErrors[`floor_${index}`] = floorErrors;
        }
      });
    }
    setError(prev => ({ ...prev, ...newErrors }));
    return true;
  };
  function convertToYearMonth(date) {
    if (!date) return '2024-01';

    // Handle MM/YYYY format
    if (date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
    }

    // Handle MM-YYYY format
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
    }

    return '2024-01';
  }

  function formatDate1(dateInput) {
    if (!dateInput) return '';

    // Handle ISO date format (from date pickers)
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0]; // Already in YYYY-MM-DD format
    }

    // Handle DD/MM/YYYY format
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length !== 3) return '';

      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];

      return `${year}-${month}-${day}`;
    }

    // Handle YYYY-MM-DD format (already correct)
    if (dateInput.includes('-') && dateInput.length === 10) {
      return dateInput;
    }

    return '';
  }
  console.log('completin date', completionDate);
  const handleSubmit = async () => {
    if (!Validate()) {
      return;
    }

    // ✅ Prepare API request payload in the expected format
    const payload = {
      assessmentType: 'New Assessment',
      zoneMstrId: zone, // map your zone id
      wardMstrId: oldWard,
      newWardMstrId: newWard,
      ownershipTypeMstrId: ownershipType,
      propTypeMstrId: propertyType,
      appartmentDetailsId: apartmentDetail || '',
      flatRegistryDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : '',
      roadWidth: roadWidth,
      khataNo: khataNo,
      plotNo: plotNo,
      villageMaujaName: villageName,
      areaOfPlot: plotArea,
      propAddress: propertyAddress,
      propCity: city,
      propDist: district,
      propPinCode: pincode,
      propState: state,
      isMobileTower: mobileTower === 'yes' ? '1' : '0',
      ...(mobileTower === 'yes' && {
        towerArea: parseInt(towerArea || 50),
        towerInstallationDate: installationDate
          ? formatDate1(installationDate)
          : '',
      }),

      isHoardingBoard: hoarding === 'yes' ? '1' : '0',
      ...(hoarding === 'yes' && {
        hoardingArea: hoardingArea ? String(hoardingArea) : '50',
        hoardingInstallationDate: hoardingInstallationDate
          ? formatDate1(hoardingInstallationDate)
          : '',
      }),

      isPetrolPump: petrolPump === 'yes' ? '1' : '0',
      ...(petrolPump === 'yes' && {
        underGroundArea: pumpArea ? String(pumpArea) : '25',
        petrolPumpCompletionDate: pumpInstallationDate
          ? formatDate1(pumpInstallationDate)
          : '',
      }),

      isWaterHarvesting: rainHarvesting === 'yes' ? '1' : '0',
      ...(rainHarvesting === 'yes' && {
        waterHarvestingDate: completionDate ? formatDate1(completionDate) : '',
      }),

      landOccupationDate: completionDate
        ? formatDate1(completionDate)
        : '2021-02-03',

      // Owner Details
      ownerDtl: (ownerDetails || []).map(owner => ({
        ownerName: owner.ownerName,
        mobileNo: owner.mobile,
        gender: owner.gender,
        dob: owner.dob,
        isArmedForce: owner.isArmedForce ? 1 : 0,
        isSpeciallyAbled: owner.isSpeciallyAbled ? 1 : 0,
      })),

      // Floor Details
      floorDtl:
        propertyTypeLabel !== 'VACANT LAND'
          ? (floorDetails || []).map(floor => ({
              builtupArea: floor.builtUpArea,
              dateFrom: convertToYearMonth(floor.fromDate),
              dateUpto1: convertToYearMonth(floor.uptoDate),
              floorMasterId: floor.floorName,
              usageTypeMasterId: floor.usageType,
              constructionTypeMasterId: floor.constructionType,
              occupancyTypeMasterId: floor.occupancyType,
            }))
          : [],
    };

    console.log(JSON.stringify(payload, null, 2));
    try {
      const token = await getToken();

      // 🔥 Hit the API with mapped payload
      const response = await axios.post(
        PROPERTY_API.TEST_REQUEST_API,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API Response:', response.data);
      if (response.data.status && response.data.message === 'Valid Request') {
        showToast('success', response.data.message); // show success message
        navigation.navigate('AssessmentSummary', { data: payload }); // navigate and pass data
      } else {
        showToast('error', response.data.message); // show error message if not valid
      }
      // Navigate only after successful API call
    } catch (error) {
      console.error('API Test Error:', error.response?.data || error.message);
      showToast('error', 'API Test Failed ❌');
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
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const yesNoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const selectRelation = [
    { label: 'S/O', value: 'S/O' },
    { label: 'D/O', value: 'D/O' },
    { label: 'W/O', value: 'W/O' },
    { label: 'F/O', value: 'F/O' },
  ];

  const selectelectcate =
    data?.electricityType?.map((item, index) => ({
      label: item, // the string itself
      value: item, // you can assign index as value, or keep same string
    })) || [];

  const transferModeOptions = [
    { label: 'Sale', value: '1' },
    { label: 'Gift', value: '2' },
    { label: 'Will', value: '3' },
    { label: 'Lease', value: '4' },
    { label: 'Partition', value: '5' },
    { label: 'Succession', value: '6' },
  ];

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
              F
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
                  Select Flat Registry Date *
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
                    maximumDate={new Date()}
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

        {/* MULTIPLE OWNER DETAILS SECTION */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Owner Details</Text>
          {ownerDetails.map((owner, index) => (
            <View key={index} style={styles.floorCard}>
              <View style={styles.floorHeader}>
                <Text style={styles.floorTitle}>Owner {index + 1}</Text>
                {ownerDetails.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeOwner(index)}
                  >
                    <Text style={styles.removeBtnText}>Remove Owner</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  error[`ownerName_${index}`] && styles.errorLabel,
                ]}
              >
                Owner Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`ownerName_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Owner Name"
                value={owner.ownerName}
                onChangeText={value =>
                  updateOwnerDetail(index, 'ownerName', value)
                }
                editable={!(isRessessment || isMutation)}
              />
              {error[`ownerName_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`ownerName_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`gender_${index}`] && styles.errorLabel,
                ]}
              >
                Gender *
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  error[`gender_${index}`] && styles.errorInput,
                ]}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={owner.gender}
                onChange={item =>
                  updateOwnerDetail(index, 'gender', item.value)
                }
                disable={isRessessment || isMutation}
              />
              {error[`gender_${index}`] && (
                <Text style={styles.errorText}>{error[`gender_${index}`]}</Text>
              )}

              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setOwnerDatePicker({ index, show: true })}
                disabled={isRessessment || isMutation}
              >
                <Text style={styles.dateText}>
                  {owner.dob || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.label,
                  error[`guardianName_${index}`] && styles.errorLabel,
                ]}
              >
                Guardian Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`guardianName_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Guardian Name"
                value={owner.guardianName}
                onChangeText={value =>
                  updateOwnerDetail(index, 'guardianName', value)
                }
                editable={!(isRessessment || isMutation)}
              />
              {error[`guardianName_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`guardianName_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`relation_${index}`] && styles.errorLabel,
                ]}
              >
                Relation *
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  error[`relation_${index}`] && styles.errorInput,
                ]}
                data={selectRelation}
                labelField="label"
                valueField="value"
                placeholder="Select Relation"
                value={owner.relation}
                onChange={item =>
                  updateOwnerDetail(index, 'relation', item.value)
                }
                disable={isRessessment || isMutation}
              />
              {error[`relation_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`relation_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`mobile_${index}`] && styles.errorLabel,
                ]}
              >
                Mobile Number *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`mobile_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                value={owner.mobile}
                onChangeText={value =>
                  updateOwnerDetail(index, 'mobile', value)
                }
                maxLength={10}
                editable={!(isRessessment || isMutation)}
              />
              {error[`mobile_${index}`] && (
                <Text style={styles.errorText}>{error[`mobile_${index}`]}</Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`aadhaar_${index}`] && styles.errorLabel,
                ]}
              >
                Aadhaar Number *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`aadhaar_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Aadhaar Number"
                keyboardType="numeric"
                value={owner.aadhaar}
                onChangeText={value =>
                  updateOwnerDetail(index, 'aadhaar', value)
                }
                maxLength={12}
                editable={!(isRessessment || isMutation)}
              />
              {error[`aadhaar_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`aadhaar_${index}`]}
                </Text>
              )}

              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter PAN Number"
                value={owner.pan}
                onChangeText={value => updateOwnerDetail(index, 'pan', value)}
                maxLength={10}
                editable={!(isRessessment || isMutation)}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                keyboardType="email-address"
                value={owner.email}
                onChangeText={value => updateOwnerDetail(index, 'email', value)}
                editable={!(isRessessment || isMutation)}
              />

              <Text style={styles.label}>Armed Forces</Text>
              <Dropdown
                style={styles.dropdown}
                data={yesNoOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Armed Forces"
                value={owner.armedForces}
                onChange={item =>
                  updateOwnerDetail(index, 'armedForces', item.value)
                }
                disable={isRessessment || isMutation}
              />

              <Text style={styles.label}>Specially Abled</Text>
              <Dropdown
                style={styles.dropdown}
                data={yesNoOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Specially Abled"
                value={owner.speciallyAbled}
                onChange={item =>
                  updateOwnerDetail(index, 'speciallyAbled', item.value)
                }
                disable={isRessessment || isMutation}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addOwner}>
            <Text style={styles.addBtnText}>Add Owner</Text>
          </TouchableOpacity>
        </View>

        {/* Owner Date Picker */}
        {ownerDatePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            maximumDate={new Date()}
            onChange={handleOwnerDateChange}
          />
        )}

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
              setNoRoad={setNoRoad}
              showFieldAlert={msg => {}}
              styles={styles}
              error={error}
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
              {/* <Text style={styles.cardTitle}>Corresponding Address</Text> */}
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
            />
          </View>
        </View>

        {/* UPDATED FLOOR DETAILS SECTION WITH REMOVE BUTTON */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Floor Details</Text>
          {propertyTypeLabel !== 'VACANT LAND' && (
            <>
              {floorDetails.map((floor, index) => (
                <View key={index} style={styles.floorCard}>
                  <View style={styles.floorHeader}>
                    <Text style={styles.floorTitle}>Floor {index + 1}</Text>
                    {floorDetails.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeFloor(index)}
                      >
                        <Text style={styles.removeBtnText}>Remove Floor</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.label}>Floor Name</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={floorNameOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Floor Name"
                    value={floor.floorName}
                    onChange={item =>
                      updateFloorDetail(index, 'floorName', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />

                  <Text style={styles.label}>Usage Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={usageTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Usage Type"
                    value={floor.usageType}
                    onChange={item =>
                      updateFloorDetail(index, 'usageType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />

                  <Text style={styles.label}>Occupancy Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={occupancyTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Occupancy Type"
                    value={floor.occupancyType}
                    onChange={item =>
                      updateFloorDetail(index, 'occupancyType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />

                  <Text style={styles.label}>Construction Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={constructionTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Construction Type"
                    value={floor.constructionType}
                    onChange={item =>
                      updateFloorDetail(index, 'constructionType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />

                  <Text style={styles.label}>Built Up Area (Sq Ft)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Built Up Area"
                    keyboardType="numeric"
                    value={floor.builtUpArea}
                    onChangeText={value =>
                      updateFloorDetail(index, 'builtUpArea', value)
                    }
                    editable={!(isRessessment || isMutation)}
                  />

                  <Text style={styles.label}>From Date (MM/YYYY)</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() =>
                      setDatePicker({ index, field: 'fromDate', show: true })
                    }
                    disabled={isRessessment || isMutation}
                  >
                    <Text style={styles.dateText}>
                      {floor.fromDate || 'Select From Date'}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.label}>Up to Date (MM/YYYY)</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() =>
                      setDatePicker({ index, field: 'uptoDate', show: true })
                    }
                    disabled={isRessessment || isMutation}
                  >
                    <Text style={styles.dateText}>
                      {floor.uptoDate || 'Select Up to Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addBtn} onPress={addFloor}>
                <Text style={styles.addBtnText}>Add Floor</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Date Picker for Floors */}
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
    backgroundColor: '#fff',
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
  floorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  floorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
  removeBtn: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
    elevation: 1,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    fontWeight: '500',
  },
});

export default ApplyAssessment;
