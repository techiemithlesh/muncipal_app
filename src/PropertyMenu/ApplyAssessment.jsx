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
  const [newWardLabel, setNewWardLabel] = useState('');
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
  const [zoneLabel, setZoneLabel] = useState('');
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

  // Track touched fields
  const [touchedFields, setTouchedFields] = useState({});

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

  // NEW: Mark field as touched
  const markFieldAsTouched = fieldName => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  // NEW: Validate single field
  const validateField = (fieldName, value) => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,./-]+$/;

    switch (fieldName) {
      case 'oldWard':
        return !value ? 'Old Ward is required' : '';
      case 'newWard':
        return !value ? 'New Ward is required' : '';
      case 'ownershipType':
        return !value ? 'Ownership Type is required' : '';
      case 'propertyType':
        return !value ? 'Property Type is required' : '';
      case 'zone':
        return !value ? 'Zone is required' : '';
      case 'khataNo':
        if (!value) return 'Khata No is required';
        if (!addressRegex.test(value)) return 'Invalid Khata No';
        return '';
      case 'plotNo':
        if (!value) return 'Plot No is required';
        if (!addressRegex.test(value)) return 'Invalid Plot No';
        return '';
      case 'villageName':
        if (!value) return 'Village Name is required';
        if (!alphabetRegex.test(value))
          return 'Village Name must contain only letters';
        return '';
      case 'plotArea':
        if (!value) return 'Plot Area is required';
        if (isNaN(value)) return 'Plot Area must be a number';
        return '';
      case 'roadWidth':
        if (!value) return 'Road Width is required';
        if (isNaN(value)) return 'Road Width must be a number';
        if (Number(value) > 499)
          return 'Road Width must not be greater than 499';
        return '';
      default:
        return '';
    }
  };

  // NEW: Validate owner field
  const validateOwnerField = (index, fieldName, value) => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;

    switch (fieldName) {
      case 'ownerName':
        if (!value) return 'Owner Name is required';
        if (!nameRegex.test(value))
          return 'Owner Name can only contain letters and spaces';
        return '';
      case 'guardianName':
        if (!value) return 'Guardian Name is required';
        if (!nameRegex.test(value))
          return 'Guardian Name can only contain letters and spaces';
        return '';
      case 'relation':
        return !value ? 'Relation is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'dob':
        return !value ? 'Date of Birth is required' : '';
      case 'mobile':
        if (!value) return 'Mobile is required';
        if (!/^\d{10}$/.test(value)) return 'Mobile number must be 10 digits';
        return '';
      default:
        return '';
    }
  };

  // NEW: Validate floor field
  const validateFloorField = (index, fieldName, value) => {
    switch (fieldName) {
      case 'floorName':
        return !value ? 'Floor name is required' : '';
      case 'usageType':
        return !value ? 'Usage type is required' : '';
      case 'constructionType':
        return !value ? 'Construction type is required' : '';
      case 'occupancyType':
        return !value ? 'Occupancy type is required' : '';
      case 'builtUpArea':
        if (!value || value <= 0)
          return 'Built-up area is required and must be > 0';
        return '';
      case 'fromDate':
        return !value ? 'Start date is required' : '';
      default:
        return '';
    }
  };

  // OWNER FUNCTIONS
  const updateOwnerDetail = (index, field, value) => {
    const updated = [...ownerDetails];
    updated[index][field] = value;
    setOwnerDetails(updated);

    // Real-time validation
    const errorKey = `${field}_${index}`;
    markFieldAsTouched(errorKey);
    const fieldError = validateOwnerField(index, field, value);

    if (fieldError) {
      setError(prev => ({ ...prev, [errorKey]: fieldError }));
    } else {
      clearFieldError(errorKey);
    }
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

      // Remove errors for this owner
      const newErrors = { ...error };
      Object.keys(newErrors).forEach(key => {
        if (key.endsWith(`_${index}`)) {
          delete newErrors[key];
        }
      });
      setError(newErrors);
    } else {
      showToast('error', 'At least one owner is required');
    }
  };

  const handleOwnerDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      const { index } = ownerDatePicker;
      updateOwnerDetail(index, 'dob', formatted);
    }
    setOwnerDatePicker({ index: null, show: false });
  };

  const updateFloorDetail = (index, field, value) => {
    const updated = [...floorDetails];
    updated[index][field] = value;
    setFloorDetails(updated);

    // Real-time validation for floors
    const errorKey = `floor_${index}_${field}`;
    markFieldAsTouched(errorKey);
    const fieldError = validateFloorField(index, field, value);

    if (fieldError) {
      setError(prev => ({ ...prev, [errorKey]: fieldError }));
    } else {
      clearFieldError(errorKey);
    }
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

      // Remove errors for this floor
      const newErrors = { ...error };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`floor_${index}_`)) {
          delete newErrors[key];
        }
      });
      setError(newErrors);
    } else {
      showToast('error', 'At least one floor is required');
    }
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
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

      const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status) {
        const formatted = response.data.data.map(item => ({
          label: `${item.apartmentName} (${item.aptCode})`,
          value: item.id,
        }));
        setApartmentList(formatted);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoadingApartments(false);
    }
  };

  // Modified field change handlers with real-time validation
  const handleFieldChange = (fieldName, value, setter) => {
    setter(value);
    markFieldAsTouched(fieldName);

    const fieldError = validateField(fieldName, value);
    if (fieldError) {
      setError(prev => ({ ...prev, [fieldName]: fieldError }));
    } else {
      clearFieldError(fieldName);
    }
  };

  const Validate = () => {
    let newErrors = {};

    // Mark all fields as touched on submit
    const allTouched = {
      oldWard: true,
      newWard: true,
      ownershipType: true,
      propertyType: true,
      zone: true,
    };
    setTouchedFields(prev => ({ ...prev, ...allTouched }));

    // Basic Field Validations
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

    // Owner Validations
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
    for (let i = 0; i < ownerDetails.length; i++) {
      const owner = ownerDetails[i];

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

      if (!owner.relation) {
        newErrors[`relation_${i}`] = 'Relation is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select Relation for Owner ${i + 1}`);
        return false;
      }

      if (!owner.gender) {
        newErrors[`gender_${i}`] = 'Gender is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select Gender for Owner ${i + 1}`);
        return false;
      }

      if (!owner.dob) {
        newErrors[`dob_${i}`] = 'Date of Birth is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', `Select Date of Birth for Owner ${i + 1}`);
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
    }

    // Property Details Validations
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,./-]+$/;
    const pincodeRegex = /^[0-9]{6}$/;

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
    } else if (Number(roadWidth) > 499) {
      newErrors.roadWidth = 'Road Width must not be greater than 499';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Road Width equal or less than 499');
      return false;
    }

    // Address Validations
    if (!propertyAddress) {
      newErrors.address = 'Address is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Address');
      return false;
    } else if (!addressRegex.test(propertyAddress)) {
      newErrors.address = 'Invalid Address';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Address can contain letters, numbers, and ,.-/');
      return false;
    }

    if (!city) {
      newErrors.city = 'City is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter City');
      return false;
    } else if (!alphabetRegex.test(city)) {
      newErrors.city = 'City should contain only letters';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'City should contain only letters');
      return false;
    }

    if (!district) {
      newErrors.district = 'District is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter District');
      return false;
    } else if (!alphabetRegex.test(district)) {
      newErrors.district = 'District should contain only letters';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'District should contain only letters');
      return false;
    }

    if (!state) {
      newErrors.state = 'State is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter State');
      return false;
    } else if (!alphabetRegex.test(state)) {
      newErrors.state = 'State should contain only letters';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'State should contain only letters');
      return false;
    }

    if (!pincode) {
      newErrors.pincode = 'Pincode is required';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Enter Pincode');
      return false;
    } else if (!pincodeRegex.test(pincode)) {
      newErrors.pincode = 'Pincode should be 6 digits';
      setError(prev => ({ ...prev, ...newErrors }));
      showToast('error', 'Pincode should be 6 digits');
      return false;
    }

    // Extra Charges Validations
    if (mobileTower === 'yes' || mobileTower === true) {
      if (!towerArea) {
        newErrors.towerArea = 'Tower area is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Enter Tower Area');
        return false;
      }
      if (!installationDate) {
        newErrors.installationDate = 'Installation date is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Select Tower Installation Date');
        return false;
      }
    }

    if (hoarding === 'yes') {
      if (!hoardingArea) {
        newErrors.hoardingArea = 'Hoarding area is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Enter Hoarding Area');
        return false;
      }
      if (!hoardingInstallationDate) {
        newErrors.hoardingInstallationDate =
          'Hoarding Installation Date is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Select Hoarding Installation Date');
        return false;
      }
    }

    if (petrolPump === 'yes') {
      if (!pumpArea) {
        newErrors.pumpArea = 'Pump area is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Enter Pump Area');
        return false;
      }
      if (!pumpInstallationDate) {
        newErrors.pumpInstallationDate = 'Pump Installation Date is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Select Pump Installation Date');
        return false;
      }
    }

    if (rainHarvesting === 'yes') {
      if (!completionDate) {
        newErrors.completionDate = 'Completion date is required';
        setError(prev => ({ ...prev, ...newErrors }));
        showToast('error', 'Select Rain Harvesting Completion Date');
        return false;
      }
    }

    // Floor Details Validations
    if (propertyTypeLabel !== 'VACANT LAND') {
      if (floorDetails && floorDetails.length > 0) {
        for (let index = 0; index < floorDetails.length; index++) {
          const floor = floorDetails[index];

          if (!floor.floorName) {
            newErrors[`floor_${index}_floorName`] = 'Floor name is required';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast('error', `Select Floor Name for Floor ${index + 1}`);
            return false;
          }

          if (!floor.usageType) {
            newErrors[`floor_${index}_usageType`] = 'Usage type is required';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast('error', `Select Usage Type for Floor ${index + 1}`);
            return false;
          }

          if (!floor.constructionType) {
            newErrors[`floor_${index}_constructionType`] =
              'Construction type is required';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast(
              'error',
              `Select Construction Type for Floor ${index + 1}`,
            );
            return false;
          }

          if (!floor.occupancyType) {
            newErrors[`floor_${index}_occupancyType`] =
              'Occupancy type is required';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast('error', `Select Occupancy Type for Floor ${index + 1}`);
            return false;
          }

          if (!floor.builtUpArea || floor.builtUpArea <= 0) {
            newErrors[`floor_${index}_builtUpArea`] =
              'Built-up area is required and must be > 0';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast('error', `Enter Built-up Area for Floor ${index + 1}`);
            return false;
          }

          if (!floor.fromDate) {
            newErrors[`floor_${index}_fromDate`] = 'Start date is required';
            setError(prev => ({ ...prev, ...newErrors }));
            showToast('error', `Select Start Date for Floor ${index + 1}`);
            return false;
          }
        }
      }
    }
    // All validations passed
    setError({});
    return true;
  };

  const clearFieldError = fieldName => {
    setError(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  function convertToYearMonth(date) {
    if (!date) return '';
    if (date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 2) {
        const [month, year] = parts;
        return `${year}-${month.padStart(2, '0')}`;
      }
    }
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
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0];
    }
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length !== 3) return '';
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    if (dateInput.includes('-') && dateInput.length === 10) {
      return dateInput;
    }
    return '';
  }

  const handleSubmit = async () => {
    const isValid = await Validate();
    console.log('isValid:', isValid);
    if (!isValid) {
      return;
    }

    const payload = {
      newWardLabel,
      zoneLabel,
      assessmentType: 'New Assessment',
      zoneMstrId: zone,
      wardMstrId: oldWard,
      newWardMstrId: newWard,
      ownershipTypeMstrId: ownershipType,
      electAccNo: khataNo,
      electBindBookNo: bindBookNo,
      electConsCategory: electricityCategory,
      electConsumerNo: kno,
      waterConnDate: waterConnectionDate,
      waterConnNo: waterConnectionNo,
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
      ownerDtl: (ownerDetails || []).map(owner => ({
        ownerName: owner.ownerName,
        guardianName: owner.guardianName,
        mobileNo: owner.mobile,
        relationType: owner.relation,
        gender: owner.gender,
        dob: owner.dob,
        isArmedForce: owner.isArmedForce ? 1 : 0,
        isSpeciallyAbled: owner.isSpeciallyAbled ? 1 : 0,
      })),
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
        showToast('success', response.data.message);
        navigation.navigate('AssessmentSummary', {
          data: payload,
          masterData: data,
        });
      } else {
        showToast('error', response.data.message);
      }
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
      label: item,
      value: item,
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
              placeholder="Select"
              placeholderTextColor="grey"
              value={oldWard}
              onChange={item => {
                handleFieldChange('oldWard', item.value, setOldWard);
              }}
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
              placeholder="Select"
              placeholderTextColor="grey"
              value={newWard}
              onChange={item => {
                setNewWard(item.value);
                setNewWardLabel(item.label);
                markFieldAsTouched('newWard');
                clearFieldError('newWard');
              }}
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
              placeholder="Select"
              placeholderTextColor="grey"
              value={ownershipType}
              onChange={item => {
                handleFieldChange(
                  'ownershipType',
                  item.value,
                  setOwnershipType,
                );
              }}
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
              placeholder="Select"
              placeholderTextColor="grey"
              value={propertyType}
              onChange={item => {
                setPropertyType(item.value);
                setPropertyTypeLabel(item.label);
                markFieldAsTouched('propertyType');
                clearFieldError('propertyType');
              }}
              disable={isRessessment || isMutation}
            />
            {error.propertyType && (
              <Text style={styles.errorText}>{error.propertyType}</Text>
            )}

            {propertyTypeLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING' && (
              <View>
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
                      ? selectedDate.toISOString().split('T')[0]
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
              placeholder="Select"
              placeholderTextColor="grey"
              value={zone}
              onChange={item => {
                setZone(item.value);
                setZoneLabel(item.label);
                markFieldAsTouched('zone');
                clearFieldError('zone');
              }}
              disable={isRessessment || isMutation}
            />
            {error.zone && <Text style={styles.errorText}>{error.zone}</Text>}
            <Text style={styles.infoText}>
              Zone 1: Over bridge to Saheed chowk.
            </Text>
            <Text style={styles.infoText}>
              Zone 2: Rest area other than Zone 1.
            </Text>

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

              <Text
                style={[
                  styles.label,
                  error[`dob_${index}`] && styles.errorLabel,
                ]}
              >
                Date of Birth *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  error[`dob_${index}`] && styles.errorInput,
                ]}
                onPress={() => setOwnerDatePicker({ index, show: true })}
                disabled={isRessessment || isMutation}
              >
                <Text style={styles.dateText}>
                  {owner.dob || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {error[`dob_${index}`] && (
                <Text style={styles.errorText}>{error[`dob_${index}`]}</Text>
              )}

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

              <Text style={styles.label}>Aadhaar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Aadhaar Number"
                keyboardType="numeric"
                value={owner.aadhaar}
                onChangeText={value =>
                  updateOwnerDetail(index, 'aadhaar', value)
                }
                maxLength={12}
                editable={!(isRessessment || isMutation)}
              />

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

        {ownerDatePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            maximumDate={new Date()}
            onChange={handleOwnerDateChange}
          />
        )}

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
              errors={{
                kno: !kno ? 'K. No is required' : '',
                accNo: !accNo ? 'ACC No is required' : '',
                electricityCategory: !electricityCategory
                  ? 'Select a category'
                  : '',
              }}
            />
          </View>
        </View>

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

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Property Details</Text>
          <View style={styles.card}>
            <PropertyDetails
              khataNo={khataNo}
              setKhataNo={value =>
                handleFieldChange('khataNo', value, setKhataNo)
              }
              plotNo={plotNo}
              setPlotNo={value => handleFieldChange('plotNo', value, setPlotNo)}
              villageName={villageName}
              setVillageName={value =>
                handleFieldChange('villageName', value, setVillageName)
              }
              plotArea={plotArea}
              setPlotArea={value =>
                handleFieldChange('plotArea', value, setPlotArea)
              }
              roadWidth={roadWidth}
              setRoadWidth={value =>
                handleFieldChange('roadWidth', value, setRoadWidth)
              }
              setNoRoad={setNoRoad}
              showFieldAlert={msg => {}}
              styles={styles}
              errors={{
                khataNo: error.khataNo || '',
                plotNo: error.plotNo || '',
                villageName: error.villageName || '',
                plotArea: error.plotArea || '',
                roadWidth: error.roadWidth || '',
              }}
            />
          </View>
        </View>

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
              errors={{
                address: !propertyAddress ? 'Property Address is required' : '',
                city: !city ? 'City is required' : '',
                district: !district ? 'District is required' : '',
                stateValue: !state ? 'State is required' : '',
                pincode: !pincode ? 'Pincode is required' : '',
              }}
            />
          </View>
        </View>

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

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Extra Charges</Text>
          <View style={styles.card}>
            <ExtraChargesSection
              propertyTypeId={propertyType}
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

        <View style={styles.cardContainer}>
          {propertyTypeLabel !== 'VACANT LAND' && (
            <>
              <Text style={styles.cardTitle}>Floor Details</Text>
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

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_floorName`] && styles.errorLabel,
                    ]}
                  >
                    Floor Name *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_floorName`] && styles.errorInput,
                    ]}
                    data={floorNameOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.floorName}
                    onChange={item =>
                      updateFloorDetail(index, 'floorName', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />
                  {error[`floor_${index}_floorName`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_floorName`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_usageType`] && styles.errorLabel,
                    ]}
                  >
                    Usage Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_usageType`] && styles.errorInput,
                    ]}
                    data={usageTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.usageType}
                    onChange={item =>
                      updateFloorDetail(index, 'usageType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />
                  {error[`floor_${index}_usageType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_usageType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_occupancyType`] &&
                        styles.errorLabel,
                    ]}
                  >
                    Occupancy Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_occupancyType`] &&
                        styles.errorInput,
                    ]}
                    data={occupancyTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.occupancyType}
                    onChange={item =>
                      updateFloorDetail(index, 'occupancyType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />
                  {error[`floor_${index}_occupancyType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_occupancyType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_constructionType`] &&
                        styles.errorLabel,
                    ]}
                  >
                    Construction Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_constructionType`] &&
                        styles.errorInput,
                    ]}
                    data={constructionTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.constructionType}
                    onChange={item =>
                      updateFloorDetail(index, 'constructionType', item.value)
                    }
                    disable={isRessessment || isMutation}
                  />
                  {error[`floor_${index}_constructionType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_constructionType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_builtUpArea`] && styles.errorLabel,
                    ]}
                  >
                    Built Up Area (Sq Ft) *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      error[`floor_${index}_builtUpArea`] && styles.errorInput,
                    ]}
                    placeholder="Enter Built Up Area"
                    placeholderStyle={{ color: 'grey' }}
                    keyboardType="numeric"
                    value={floor.builtUpArea}
                    onChangeText={value =>
                      updateFloorDetail(index, 'builtUpArea', value)
                    }
                    editable={!(isRessessment || isMutation)}
                  />
                  {error[`floor_${index}_builtUpArea`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_builtUpArea`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_fromDate`] && styles.errorLabel,
                    ]}
                  >
                    From Date (MM/YYYY) *
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      error[`floor_${index}_fromDate`] && styles.errorInput,
                    ]}
                    onPress={() =>
                      setDatePicker({ index, field: 'fromDate', show: true })
                    }
                    disabled={isRessessment || isMutation}
                  >
                    <Text style={styles.dateText}>
                      {floor.fromDate || 'Select From Date'}
                    </Text>
                  </TouchableOpacity>
                  {error[`floor_${index}_fromDate`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_fromDate`]}
                    </Text>
                  )}

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
