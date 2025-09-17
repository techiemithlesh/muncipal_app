import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import VerificationCard from './VerificationCard';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderLogin from '../Screen/HeaderLogin';
import MonthYearPicker from 'react-native-month-year-picker';
import HeaderNavigation from '../Components/HeaderNavigation';
import { BASE_URL } from '../config';

const SurveyPage = ({ route, navigation }) => {
  const { id } = route.params;
  console.log(id);
  // floor related
  const [addExtraFloor, setAddExtraFloor] = useState(false);
  const [floors, setFloors] = useState([]);

  const addFloor = () => {
    setFloors(prev => [
      ...prev,
      {
        floorName: '',
        constructionType: '',
        occupancyType: '',
        usageType: '',
        builtupArea: '',
        fromDate: null,
        toDate: null,
        showFromPicker: false,
        showToPicker: false,
      },
    ]);
  };

  const removeFloor = () => {
    setFloors(prev => prev.slice(0, -1));
  };

  const updateFloor = (index, field, value) => {
    setFloors(prev =>
      prev.map((floor, i) =>
        i === index ? { ...floor, [field]: value } : floor,
      ),
    );
  };

  const getLabelByValue = (options, value) => {
    const found = options.find(option => option.value === value);
    return found ? found.label : '';
  };
  // for remarks
  const [remarks, setRemarks] = useState('');

  // State for API data
  const [data, setData] = useState(null);
  const [masterData, setMasterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Separate state for each card
  const [wardVerification, setWardVerification] = useState(null);
  const [wardDropdown, setWardDropdown] = useState('');

  const [newWardVerification, setNewWardVerification] = useState(null);
  const [newWardDropdown, setNewWardDropdown] = useState('');
  const [newWardInput, setNewWardInput] = useState('');

  const [zoneVerification, setZoneVerification] = useState(null);
  const [zoneDropdown, setZoneDropdown] = useState('');

  const [propertyVerification, setPropertyVerification] = useState(null);
  const [propertyDropdown, setPropertyDropdown] = useState('');

  // #################### Parking #############
  const [usageType, setUsageType] = useState(null);
  const [usageTypeDropdown, setUsageTypeDropdown] = useState('');
  const [occupancyType, setOccupancyType] = useState(null);
  const [occupancyTypeDropdown, setOccupancyTypeDropdown] = useState('');
  const [constructionType, setConstructionType] = useState(null);
  const [constructionTypeDropdown, setConstructionTypeDropdown] = useState('');
  const [buildupArea, setBuildupArea] = useState(null);
  const [buildupAreaDropdown, setBuildupAreaDropdown] = useState('');
  const [builtupAreaIput, setBuiltupAreaInput] = useState(null);
  const [dateFromParking, setDateFromParking] = useState(null);
  const [dateFromParkingDropdown, setDateFromParkingDropdown] = useState(null);
  const [dateToParking, setDateToParking] = useState(null);
  const [dateToParkingDropdown, setDateToParkingDropdown] = useState(null);

  // #################### Basement #############
  const [usageTypeBasement, setUsageTypeBasement] = useState(null);
  const [usageTypeInputBasement, setUsageTypeInputBasement] = useState('');
  const [occupancyTypeBasement, setOccupancyTypeBasement] = useState(null);
  const [occupancyTypeInputBasement, setOccupancyTypeInputBasement] =
    useState('');
  const [constructionTypeBasement, setConstructionTypeBasement] =
    useState(null);
  const [constructionTypeInputBasement, setConstructionTypeInputBasement] =
    useState('');
  const [buildupAreaBasement, setBuildupAreaBasement] = useState(null);
  const [buildupAreaDropdownBasement, setBuildupAreaDropdownBasement] =
    useState('');
  const [builtupAreaInputBasement, setBuiltupAreaInputBasement] =
    useState(null);
  const [dateFromBasement, setDateFromBasement] = useState(null);
  const [dateFromBasementDropdown, setDateFromBasementDropdown] =
    useState(null);
  const [dateToBasement, setDateToBasement] = useState(null);
  const [dateToBasementDropdown, setDateToBasementDropdown] = useState(null);

  // Add more fields as needed
  const [floorType, setFloorType] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({});

  const [floorIds, setFloorIds] = useState([]);

  const showFromPicker = () => setFromPickerVisible(true);
  const hideFromPicker = () => setFromPickerVisible(false);
  const handleFromConfirm = date => {
    setFromDate(date);
    hideFromPicker();
  };

  const getLabelFromOptions = (options, value) => {
    const found = options?.find(item => item.value === value);
    return found?.label || value || 'N/A';
  };

  const getPreviewValue = (
    original,
    dropdownValue,
    verification,
    options,
    inputValue = null,
  ) => {
    if (verification === 'Correct') return original;
    if (inputValue) return inputValue;
    if (dropdownValue instanceof Date) {
      return formatDate(dropdownValue);
    }
    return getLabelFromOptions(options, dropdownValue);
  };

  // const validatePreviewData = () => {
  //   const errors = [];

  //   if (!wardVerification && !wardDropdown) {
  //     errors.push('Please verify/select Ward No');
  //   }

  //   if (!newWardVerification && !newWardDropdown) {
  //     errors.push('Please verify/select New Ward No');
  //   }

  //   if (!zoneVerification && !zoneDropdown) {
  //     errors.push('Please verify/select Zone');
  //   }

  //   if (!propertyVerification && !propertyDropdown) {
  //     errors.push('Please verify/select Property Type');
  //   }

  //   const selectedPropertyLabel =
  //     propertyDropdownOptions?.find(
  //       opt => String(opt.value) === String(propertyDropdown),
  //     )?.label || '';

  //   const shouldShowSections =
  //     data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
  //     (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
  //       selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
  //       selectedPropertyLabel !== '');

  //   if (
  //     shouldShowSections &&
  //     selectedPropertyLabel.toUpperCase() !== 'VACANT LAND'
  //   ) {
  //     floorIds.forEach((floor, index) => {
  //       if (!floor.usageType) {
  //         errors.push(`Please select Usage Type (${floor.floorName})`);
  //       }
  //       if (!floor.occupancyType) {
  //         errors.push(`Please select Occupancy Type (${floor.floorName})`);
  //       }
  //       if (!floor.constructionType) {
  //         errors.push(`Please select Construction Type (${floor.floorName})`);
  //       }
  //       if (!floor.builtupArea) {
  //         errors.push(`Please enter Built-up Area (${floor.floorName})`);
  //       }
  //       if (!floor.fromDate) {
  //         errors.push(`Please select Date From (${floor.floorName})`);
  //       }
  //       if (!floor.toDate) {
  //         errors.push(`Please select Date To (${floor.floorName})`);
  //       }
  //     });
  //   }
  //   // Return only first error (or null if no errors)
  //   return errors.length > 0 ? errors[0] : null;
  // };

  const handleSubmitPreview = () => {
    // Get the verified IDs based on selection
    const getVerifiedId = (verification, originalValue, dropdownValue) => {
      if (verification === 'Correct' || !dropdownValue) {
        // If correct or no change, find the original ID from master data
        return originalValue;
      }
      return dropdownValue; // Return the selected dropdown ID
    };

    // Prepare parking floor data with IDs
    const parkingFloorData = parkingFloor
      ? {
          safFloorDetailId:
            parkingFloor?.id || parkingFloor?.safFloorDetailId || null,
          builtupArea:
            buildupArea === 'Incorrect' && builtupAreaIput
              ? Number(builtupAreaIput)
              : Number(parkingFloor?.builtupArea || 0),
          dateFrom:
            dateFromParking === 'Incorrect' && dateFromParkingDropdown
              ? formatDate(dateFromParkingDropdown)
              : parkingFloor?.dateFrom,
          dateUpto:
            dateToParking === 'Incorrect' && dateToParkingDropdown
              ? formatDate(dateToParkingDropdown)
              : parkingFloor?.dateUpto,
          floorMasterId: parkingFloor?.floorMasterId || '1', // Parking floor ID
          usageTypeMasterId: getVerifiedId(
            usageType,
            parkingFloor?.usageTypeMasterId,
            usageTypeDropdown,
          ),
          constructionTypeMasterId: getVerifiedId(
            constructionType,
            parkingFloor?.constructionTypeMasterId,
            constructionTypeDropdown,
          ),
          occupancyTypeMasterId: getVerifiedId(
            occupancyType,
            parkingFloor?.occupancyTypeMasterId,
            occupancyTypeDropdown,
          ),
        }
      : null;

    // Prepare basement floor data with IDs
    const basementFloorData = basementFloor
      ? {
          safFloorDetailId:
            basementFloor?.id || basementFloor?.safFloorDetailId || null,
          builtupArea:
            buildupAreaBasement === 'Incorrect' && builtupAreaInputBasement
              ? Number(builtupAreaInputBasement)
              : Number(basementFloor?.builtupArea || 0),
          dateFrom:
            dateFromBasement === 'Incorrect' && dateFromBasementDropdown
              ? formatDate(dateFromBasementDropdown)
              : basementFloor?.dateFrom,
          dateUpto:
            dateToBasement === 'Incorrect' && dateToBasementDropdown
              ? formatDate(dateToBasementDropdown)
              : basementFloor?.dateUpto,
          floorMasterId: basementFloor?.floorMasterId || '2', // Basement floor ID
          usageTypeMasterId:
            usageTypeBasement === 'Incorrect' && usageTypeInputBasement
              ? usageTypeInputBasement
              : basementFloor?.usageTypeMasterId,
          constructionTypeMasterId:
            constructionTypeBasement === 'Incorrect' &&
            constructionTypeInputBasement
              ? constructionTypeInputBasement
              : basementFloor?.constructionTypeMasterId,
          occupancyTypeMasterId:
            occupancyTypeBasement === 'Incorrect' && occupancyTypeInputBasement
              ? occupancyTypeInputBasement
              : basementFloor?.occupancyTypeMasterId,
        }
      : null;

    const submissionData = {
      ...previewData,
      // Main property IDs
      safDetailId: id,
      wardMstrId: getVerifiedId(
        wardVerification,
        data?.wardMstrId,
        wardDropdown,
      ),
      newWardMstrId: getVerifiedId(
        newWardVerification,
        data?.newWardMstrId,
        newWardDropdown,
      ),
      propTypeMstrId: getVerifiedId(
        propertyVerification,
        data?.propTypeMstrId,
        propertyDropdown,
      ),
      zoneMstrId: getVerifiedId(
        zoneVerification,
        data?.zoneMstrId,
        zoneDropdown,
      ),
      roadWidth: data?.roadWidth || 20,
      areaOfPlot: data?.areaOfPlot || 80,
      isMobileTower: data?.isMobileTower || false,
      isHoardingBoard: data?.isHoardingBoard || false,
      isPetrolPump: data?.isPetrolPump || false,
      isWaterHarvesting: data?.isWaterHarvesting || false,
      remarks: remarks || '',

      // Floor details
      parkingFloor: parkingFloorData,
      basementFloor: basementFloorData,

      // Extra floors with IDs
      extraFloors: addExtraFloor
        ? floors?.map((floor, index) => ({
            safFloorDetailId: null, // New floor, no existing ID
            floorMasterId: floor.floorName, // This is already the ID from dropdown
            floorName: getLabelByValue(
              floorNameDropdownOptions,
              floor.floorName,
            ),
            constructionTypeMasterId: floor.constructionType,
            constructionType: getLabelByValue(
              constructionTypeDropdownOptions,
              floor.constructionType,
            ),
            occupancyTypeMasterId: floor.occupancyType,
            occupancyType: getLabelByValue(
              occupancyTypeDropdownOptions,
              floor.occupancyType,
            ),
            usageTypeMasterId: floor.usageType,
            usageType: getLabelByValue(
              usageTypeDropdownOptions,
              floor.usageType,
            ),
            builtupArea: floor.builtupArea || 0,
            dateFrom: floor.fromDate ? formatDate(floor.fromDate) : '',
            dateUpto: floor.toDate ? formatDate(floor.toDate) : '',
          }))
        : [],
    };

    console.log('Submitted Data with IDs:', submissionData);

    // Navigate and optionally pass data
    navigation.navigate('VerifiedStatus', {
      submissionData,
      id,
      floorIds,
      data,
    });
  };

  const showToPicker = () => setToPickerVisible(true);
  const hideToPicker = () => setToPickerVisible(false);
  const handleToConfirm = date => {
    setToDate(date);
    hideToPicker();
  };

  const formatDate = date => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    return `${d.toLocaleString('default', {
      month: 'long',
    })} ${d.getFullYear()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log('toke', token);

        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-field-verification`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response1 = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('field Virification data', response.data.data);
        setMasterData(response1.data.data);
        setData(response.data.data);

        const floors = response.data.data.floor || [];
        setFloorIds(floors);

        console.log('All Floor IDs:', floors);
        // console.log('data', data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Prepare dropdown options for ward and zone
  const wardDropdownOptions = (masterData?.wardList || []).map(item => ({
    label: item.wardNo,
    value: item.id,
  }));
  const propertyDropdownOptions = (masterData?.propertyType || []).map(
    item => ({
      label: item.propertyType,
      value: item.id,
    }),
  );

  const selectedPropertyLabel =
    propertyDropdownOptions.find(
      opt => String(opt.value) === String(propertyDropdown),
    )?.label ||
    data?.propertyType ||
    '';
  const isNotVacantLand = selectedPropertyLabel.toUpperCase() !== 'VACANT LAND';
  const shouldShowSections =
    data?.propertyType?.toUpperCase() !== 'VACANT LAND' || // API value not vacant land
    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
      selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
      selectedPropertyLabel !== '');
  const zoneDropdownOptions = [
    { label: 'Zone 1', value: 'zone1' },
    { label: 'Zone 2', value: 'zone2' },
  ];

  const floorNameDropdownOptions = (masterData?.floorType || []).map(item => ({
    label: item.floorName, // What user sees in dropdown
    value: item.id, // What you use internally (e.g. to send to API)
  }));

  // #################### Parking #############
  const usageTypeDropdownOptions = (masterData?.usageType || []).map(item => ({
    label: item.usageType,
    value: item.id,
  }));
  const occupancyTypeDropdownOptions = (masterData?.occupancyType || []).map(
    item => ({
      label: item.occupancyName,
      value: item.id,
    }),
  );
  const constructionTypeDropdownOptions = (
    masterData?.constructionType || []
  ).map(item => ({
    label: item.constructionType,
    value: item.id,
  }));
  const buildupAreaDropdownOptions = (masterData?.buildupArea || []).map(
    item => ({
      label: item.buildupArea,
      value: item.id,
    }),
  );
  const dateFromParkingDropdownOptions = (
    masterData?.dateFromParking || []
  ).map(item => ({
    label: item.dateFromParking,
    value: item.id,
  }));
  const dateToParkingDropdownOptions = (masterData?.dateToParking || []).map(
    item => ({
      label: item.dateToParking,
      value: item.id,
    }),
  );

  const parkingFloor = data?.floor?.[0];
  const basementFloor = data?.floor?.[1];
  // console.log(parkingFloor, ' parkingFloor floor Date');

  // Add state for date picker modals
  const [showDateFromParkingPicker, setShowDateFromParkingPicker] =
    useState(false);
  const [showDateToParkingPicker, setShowDateToParkingPicker] = useState(false);
  const [showDateFromBasementPicker, setShowDateFromBasementPicker] =
    useState(false);
  const [showDateToBasementPicker, setShowDateToBasementPicker] =
    useState(false);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading survey data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.surveyContainer}>
        <HeaderNavigation />
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={['#055441ff', '#110850ff']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.title}>Self Assessment - Field Survey</Text>
          </LinearGradient>
        </View>
        {data && (
          <View style={styles.card}>
            <Text style={styles.label}>
              Your Application No.:{' '}
              <Text style={styles.value}>{data.safNo}</Text>
            </Text>
            <Text style={styles.label}>
              Application Type:{' '}
              <Text style={styles.value}>{data.assessmentType}</Text>
            </Text>
            <Text style={styles.label}>
              Applied Date: <Text style={styles.value}>{data.applyDate}</Text>
            </Text>
          </View>
        )}
        {/* Ward No. Card */}
        <VerificationCard
          label="Ward No."
          value={data?.wardNo || ''}
          dropdownOptions={wardDropdownOptions}
          selectedVerification={wardVerification}
          setSelectedVerification={setWardVerification}
          dropdownValue={wardDropdown}
          setDropdownValue={setWardDropdown}
        />
        {/* New Ward No. Card */}
        <VerificationCard
          label="New Ward No."
          value={data?.newWardNo || ''}
          dropdownOptions={wardDropdownOptions || []}
          selectedVerification={newWardVerification}
          setSelectedVerification={setNewWardVerification}
          dropdownValue={newWardDropdown}
          setDropdownValue={setNewWardDropdown}
        />
        {/* Zone Card */}
        <VerificationCard
          label="Zone"
          value={data?.zone || ''}
          dropdownOptions={zoneDropdownOptions}
          selectedVerification={zoneVerification}
          setSelectedVerification={setZoneVerification}
          dropdownValue={zoneDropdown}
          setDropdownValue={setZoneDropdown}
        />
        <VerificationCard
          label="Property Type"
          value={data?.propertyType || ''}
          dropdownOptions={propertyDropdownOptions || []}
          selectedVerification={propertyVerification}
          setSelectedVerification={setPropertyVerification}
          dropdownValue={propertyDropdown}
          setDropdownValue={setPropertyDropdown}
        />
        {shouldShowSections &&
          selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' && (
            <>
              {/* #################### Parking ############# */}
              <LinearGradient
                colors={['#B6D9E0', '#2C5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                {floorIds.map((floor, index) => (
                  <View key={floor.id} style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        marginTop: 10,
                        marginBottom: 5,
                        marginLeft: 15,
                        marginRight: 8,
                        color: 'red',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {floor.floorName.toUpperCase()}
                    </Text>

                    <VerificationCard
                      label="Usage-Type"
                      value={floor.usageType || ''}
                      dropdownOptions={usageTypeDropdownOptions || []}
                      selectedVerification={usageType}
                      setSelectedVerification={setUsageType}
                      dropdownValue={usageTypeDropdown}
                      setDropdownValue={setUsageTypeDropdown}
                    />
                    <VerificationCard
                      label="Occupancy-Type"
                      value={floor.occupancyName || ''}
                      dropdownOptions={occupancyTypeDropdownOptions || []}
                      selectedVerification={occupancyType}
                      setSelectedVerification={setOccupancyType}
                      dropdownValue={occupancyTypeDropdown}
                      setDropdownValue={setOccupancyTypeDropdown}
                    />
                    <VerificationCard
                      label="Construction-Type"
                      value={floor.constructionType || ''}
                      dropdownOptions={constructionTypeDropdownOptions || []}
                      selectedVerification={constructionType}
                      setSelectedVerification={setConstructionType}
                      dropdownValue={constructionTypeDropdown}
                      setDropdownValue={setConstructionTypeDropdown}
                    />
                    <VerificationCard
                      label="Builtup-Area"
                      value={floor.builtupArea || ''}
                      dropdownOptions={buildupAreaDropdownOptions || []}
                      selectedVerification={buildupArea}
                      setSelectedVerification={setBuildupArea}
                      dropdownValue={buildupAreaDropdown}
                      setDropdownValue={setBuildupAreaDropdown}
                      showInputOnIncorrect={true}
                      inputValue={builtupAreaIput}
                      setInputValue={setBuiltupAreaInput}
                      inputLabel="Enter new builtup area:"
                      inputPlaceholder="Enter new builtup area"
                    />
                    <VerificationCard
                      label="Date From"
                      value={floor.dateFrom || ''}
                      selectedVerification={dateFromParking}
                      setSelectedVerification={setDateFromParking}
                      showCalendarOnIncorrect={true}
                      calendarValue={dateFromParkingDropdown}
                      setCalendarValue={setDateFromParkingDropdown}
                      onCalendarPress={() => setShowDateFromParkingPicker(true)}
                    />
                    <VerificationCard
                      label="Date To"
                      value={floor.dateUpto || ''}
                      selectedVerification={dateToParking}
                      setSelectedVerification={setDateToParking}
                      showCalendarOnIncorrect={true}
                      calendarValue={dateToParkingDropdown}
                      setCalendarValue={setDateToParkingDropdown}
                      onCalendarPress={() => setShowDateToParkingPicker(true)}
                    />
                  </View>
                ))}
              </LinearGradient>

              {/* <LinearGradient
                colors={['#B6D9E0', '#2C5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer} // use your own style
              >
                <Text
                  style={{
                    marginTop: 10,
                    marginBottom: 5,
                    marginLeft: 15,
                    marginRight: 8,
                    color: 'red', // white text to contrast background
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  BASEMENT
                </Text>
                <VerificationCard
                  label="Usage-Type (Basement)"
                  value={basementFloor?.usageType || ''}
                  selectedVerification={usageTypeBasement}
                  setSelectedVerification={setUsageTypeBasement}
                  showDropdown={true} // new prop to show dropdown instead of input
                  dropdownOptions={usageTypeDropdownOptions} // pass your dropdown options
                  dropdownValue={usageTypeInputBasement} // selected dropdown value
                  setDropdownValue={setUsageTypeInputBasement} // setter for dropdown
                />
                <VerificationCard
                  label="Occupancy-Type (Basement)"
                  value={basementFloor?.occupancyName || ''}
                  selectedVerification={occupancyTypeBasement}
                  setSelectedVerification={setOccupancyTypeBasement}
                  showDropdown={true} // new prop to show dropdown
                  dropdownOptions={occupancyTypeDropdownOptions} // your dropdown options
                  dropdownValue={occupancyTypeInputBasement} // selected value
                  setDropdownValue={setOccupancyTypeInputBasement} // setter for selected value
                />
                <VerificationCard
                  label="Construction-Type (Basement)"
                  value={basementFloor?.constructionType || ''}
                  selectedVerification={constructionTypeBasement}
                  setSelectedVerification={setConstructionTypeBasement}
                  showDropdown={true} // show dropdown instead of input
                  dropdownOptions={constructionTypeDropdownOptions} // your dropdown options
                  dropdownValue={constructionTypeInputBasement} // selected value
                  setDropdownValue={setConstructionTypeInputBasement} // setter for selected value
                />
                <VerificationCard
                  label="buildup-Area (Basement)"
                  value={basementFloor?.builtupArea || ''}
                  dropdownOptions={buildupAreaDropdownOptions || []}
                  selectedVerification={buildupAreaBasement}
                  setSelectedVerification={setBuildupAreaBasement}
                  dropdownValue={buildupAreaDropdownBasement}
                  setDropdownValue={setBuildupAreaDropdownBasement}
                  showInputOnIncorrect={true}
                  inputValue={builtupAreaInputBasement}
                  setInputValue={setBuiltupAreaInputBasement}
                  inputLabel="Enter new builtup area (Basement):"
                  inputPlaceholder="Enter new builtup area (Basement)"
                />
                <VerificationCard
                  label="date-From-Basement"
                  value={basementFloor?.dateFrom || ''}
                  selectedVerification={dateFromBasement}
                  setSelectedVerification={setDateFromBasement}
                  showCalendarOnIncorrect={true}
                  calendarValue={dateFromBasementDropdown}
                  setCalendarValue={setDateFromBasementDropdown}
                  onCalendarPress={() => setShowDateFromBasementPicker(true)}
                />
                <VerificationCard
                  label="date-To-Basement"
                  value={basementFloor?.dateUpto || ''}
                  selectedVerification={dateToBasement}
                  setSelectedVerification={setDateToBasement}
                  showCalendarOnIncorrect={true}
                  calendarValue={dateToBasementDropdown}
                  setCalendarValue={setDateToBasementDropdown}
                  onCalendarPress={() => setShowDateToBasementPicker(true)}
                />
              </LinearGradient> */}
              <View style={styles.extraFloorContainer}>
                <View style={styles.row}>
                  <Text style={styles.labelCheckbox}>
                    Do You Want To Add Extra Floor?
                  </Text>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      setAddExtraFloor(!addExtraFloor);
                      if (!addExtraFloor && floors.length === 0) {
                        setFloors([1]); // add first floor when checked
                      } else if (addExtraFloor) {
                        setFloors([]); // reset on uncheck
                      }
                    }}
                  >
                    <View
                      style={
                        addExtraFloor ? styles.checkedBox : styles.uncheckedBox
                      }
                    />
                  </TouchableOpacity>
                </View>

                {addExtraFloor && (
                  <>
                    {floors.map((floor, index) => (
                      <LinearGradient
                        key={index}
                        colors={['#ececf2ff', '#eee7e7ff']}
                        style={styles.card}
                      >
                        <View style={styles.rowlabel}>
                          <Text style={{ color: 'white' }}>
                            Extra Floor {index + 1}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.label}>Floor Name</Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            data={floorNameDropdownOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={floor.floorName}
                            onChange={item =>
                              updateFloor(index, 'floorName', item.value)
                            }
                          />

                          <Text style={styles.label}>Construction Type</Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            data={constructionTypeDropdownOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={floor.constructionType}
                            onChange={item =>
                              updateFloor(index, 'constructionType', item.value)
                            }
                          />

                          <Text style={styles.label}>Occupancy Type</Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            data={occupancyTypeDropdownOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={floor.occupancyType}
                            onChange={item =>
                              updateFloor(index, 'occupancyType', item.value)
                            }
                          />

                          <Text style={styles.label}>Usage Type</Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            data={usageTypeDropdownOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={floor.usageType}
                            onChange={item =>
                              updateFloor(index, 'usageType', item.value)
                            }
                          />

                          <Text style={styles.label}>Built-up Area</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter built-up area"
                            value={floor.builtupArea}
                            onChangeText={text =>
                              updateFloor(index, 'builtupArea', text)
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        <Text style={styles.label}>Date From</Text>
                        <TouchableOpacity
                          style={styles.dateBox}
                          onPress={() =>
                            updateFloor(index, 'showFromPicker', true)
                          }
                        >
                          <Text style={styles.dateText}>
                            {floor.fromDate
                              ? formatDate(floor.fromDate)
                              : 'Select Date'}
                          </Text>
                        </TouchableOpacity>
                        {floor.showFromPicker && (
                          <MonthYearPicker
                            onChange={(event, newDate) => {
                              updateFloor(index, 'showFromPicker', false);
                              if (newDate) {
                                updateFloor(index, 'fromDate', newDate);
                              }
                            }}
                            value={floor.fromDate || new Date()}
                          />
                        )}

                        <Text style={styles.label}>Date Upto</Text>
                        <TouchableOpacity
                          style={styles.dateBox}
                          onPress={() =>
                            updateFloor(index, 'showToPicker', true)
                          }
                        >
                          <Text style={styles.dateText}>
                            {floor.toDate
                              ? formatDate(floor.toDate)
                              : 'Select Date'}
                          </Text>
                        </TouchableOpacity>
                        {floor.showToPicker && (
                          <MonthYearPicker
                            onChange={(event, newDate) => {
                              updateFloor(index, 'showToPicker', false);
                              if (newDate) {
                                updateFloor(index, 'toDate', newDate);
                              }
                            }}
                            value={floor.toDate || new Date()}
                          />
                        )}

                        <Text style={styles.cardText}></Text>
                      </LinearGradient>
                    ))}

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={addFloor}
                        style={styles.addButton}
                      >
                        <Text style={styles.buttonText}>Add Floor</Text>
                      </TouchableOpacity>
                      {floors.length > 0 && (
                        <TouchableOpacity
                          onPress={removeFloor}
                          style={styles.removeButton}
                        >
                          <Text style={styles.buttonText}>Remove Floor</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                )}
              </View>

              {/* Remarks Section */}
              <View style={styles.remarksContainer}>
                <Text style={styles.remarksLabel}>Remarks</Text>
                <TextInput
                  style={styles.remarksInput}
                  placeholder="Enter your remarks here..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={remarks}
                  onChangeText={setRemarks}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => {
            // const errors = validatePreviewData(); // 👈 call validation function

            // const error = validatePreviewData();
            // if (error) {
            //   Alert.alert('Validation Error', error);
            //   return;
            // }
            getPreviewValue();

            const generatedPreview = {
              'Ward No': data?.wardNo,
              Verified_Ward: getPreviewValue(
                data?.wardNo,
                wardDropdown,
                wardVerification,
                wardDropdownOptions,
              ),

              'New Ward No (Current)': data?.newWardNo,
              Verified_NewWard: getPreviewValue(
                data?.newWardNo,
                newWardDropdown,
                newWardVerification,
                wardDropdownOptions,
              ),

              'Zone (Current)': data?.zone,
              Verified_Zone: getPreviewValue(
                data?.zone,
                zoneDropdown,
                zoneVerification,
                zoneDropdownOptions,
              ),
              'Property Type (Current)': data?.propertyType,
              Verified_PropertyType: getPreviewValue(
                data?.propertyType,
                propertyDropdown,
                propertyVerification,
                propertyDropdownOptions,
              ),
            };

            if (data?.propertyType !== 'VACANT LAND') {
              generatedPreview['Remarks (Preview)'] = remarks ?? 'NA';
              // Parking
              generatedPreview['Usage Type (Parking Current)'] =
                parkingFloor?.usageType;
              generatedPreview['Verified_UsageParking'] = getPreviewValue(
                parkingFloor?.usageType,
                usageTypeDropdown,
                usageType,
                usageTypeDropdownOptions,
              );

              generatedPreview['Occupancy Type (Parking Current)'] =
                parkingFloor?.occupancyName;
              generatedPreview['Verified_OccupancyParking'] = getPreviewValue(
                parkingFloor?.occupancyName,
                occupancyTypeDropdown,
                occupancyType,
                occupancyTypeDropdownOptions,
              );

              generatedPreview['Construction Type (Parking Current)'] =
                parkingFloor?.constructionType;
              generatedPreview['Verified_ConstructionParking'] =
                getPreviewValue(
                  parkingFloor?.constructionType,
                  constructionTypeDropdown,
                  constructionType,
                  constructionTypeDropdownOptions,
                );

              generatedPreview['Built-up Area (Parking Current)'] =
                parkingFloor?.builtupArea;
              generatedPreview['Verified_BuiltUpParking'] = getPreviewValue(
                parkingFloor?.builtupArea,
                buildupAreaDropdown,
                buildupArea,
                buildupAreaDropdownOptions,
                builtupAreaIput,
              );

              generatedPreview['Date From (Parking Current)'] =
                parkingFloor?.dateFrom;
              generatedPreview['Verified_DateFromParking'] = getPreviewValue(
                parkingFloor?.dateFrom,
                dateFromParkingDropdown,
                dateFromParking,
                null,
                null,
                true,
              );

              generatedPreview['Date To (Parking Current)'] =
                parkingFloor?.dateUpto;
              generatedPreview['Verified_DateToParking'] = getPreviewValue(
                parkingFloor?.dateUpto,
                dateToParkingDropdown,
                dateToParking,
                null,
                null,
                true,
              );

              // Basement
              generatedPreview['Usage Type (Basement Current)'] =
                basementFloor?.usageType;
              generatedPreview['Verified_UsageBasement'] = getPreviewValue(
                basementFloor?.usageType,
                null,
                usageTypeBasement,
                null,
                usageTypeInputBasement,
              );

              generatedPreview['Occupancy Type (Basement Current)'] =
                basementFloor?.occupancyName;
              generatedPreview['Verified_OccupancyBasement'] = getPreviewValue(
                basementFloor?.occupancyName,
                null,
                occupancyTypeBasement,
                null,
                occupancyTypeInputBasement,
              );

              generatedPreview['Construction Type (Basement Current)'] =
                basementFloor?.constructionType;
              generatedPreview['Verified_ConstructionBasement'] =
                getPreviewValue(
                  basementFloor?.constructionType,
                  null,
                  constructionTypeBasement,
                  null,
                  constructionTypeInputBasement,
                );

              generatedPreview['Built-up Area (Basement Current)'] =
                basementFloor?.builtupArea;
              generatedPreview['Verified_BuiltUpBasement'] = getPreviewValue(
                basementFloor?.builtupArea,
                buildupAreaDropdownBasement,
                buildupAreaBasement,
                buildupAreaDropdownOptions,
                builtupAreaInputBasement,
              );

              generatedPreview['Date From (Basement Current)'] =
                basementFloor?.dateFrom;
              generatedPreview['Verified_DateFromBasement'] = getPreviewValue(
                basementFloor?.dateFrom,
                dateFromBasementDropdown,
                dateFromBasement,
                null,
                null,
                true,
              );

              generatedPreview['Date To (Basement Current)'] =
                basementFloor?.dateUpto;
              generatedPreview['Verified_DateToBasement'] = getPreviewValue(
                basementFloor?.dateUpto,
                dateToBasementDropdown,
                dateToBasement,
                null,
                null,
                true,
              );
            }

            // Add remarks if property type is not VACANT LAND
            if (data?.propertyType !== 'VACANT LAND' && remarks) {
              generatedPreview['Remarks'] = remarks;
            }

            setPreviewData(generatedPreview);
            setIsPreviewVisible(true);
          }}
        >
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
        <Modal
          visible={isPreviewVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPreviewVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Preview Details</Text>
              <ScrollView style={styles.modalContent}>
                {/* Property Details Table */}
                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Property Details</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Field</Text>
                      <Text style={styles.tableHeaderText}>Current Value</Text>
                      <Text style={styles.tableHeaderText}>Verified Value</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellLabel}>Ward No</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Ward No'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_Ward'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                      <Text style={styles.tableCellLabel}>New Ward No</Text>
                      <Text style={styles.tableCell}>
                        {previewData['New Ward No (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_NewWard'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellLabel}>Zone</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Zone (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_Zone'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                      <Text style={styles.tableCellLabel}>Property Type</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Property Type (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_PropertyType'] || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Apply same condition as shouldShowSections */}
                {(() => {
                  const currentPropertyLabel =
                    propertyDropdownOptions?.find(
                      opt => String(opt.value) === String(propertyDropdown),
                    )?.label ||
                    data?.propertyType ||
                    '';

                  const shouldShowPreviewSections =
                    data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
                    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
                      currentPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
                      currentPropertyLabel !== '');

                  return shouldShowPreviewSections &&
                    currentPropertyLabel.toUpperCase() !== 'VACANT LAND' ? (
                    <>
                      {/* Parking Details Table */}
                      <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Parking Details</Text>
                        <View style={styles.table}>
                          <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Field</Text>
                            <Text style={styles.tableHeaderText}>
                              Current Value
                            </Text>
                            <Text style={styles.tableHeaderText}>
                              Verified Value
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>
                              Usage Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Usage Type (Parking Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_UsageParking'] || 'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>
                              Occupancy Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData[
                                'Occupancy Type (Parking Current)'
                              ] || 'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_OccupancyParking'] ||
                                'N/A'}
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>
                              Construction Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData[
                                'Construction Type (Parking Current)'
                              ] || 'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_ConstructionParking'] ||
                                'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>
                              Built-up Area
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Built-up Area (Parking Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_BuiltUpParking'] || 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>Date From</Text>
                            <Text style={styles.tableCell}>
                              {previewData['Date From (Parking Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_DateFromParking'] || 'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>Date To</Text>
                            <Text style={styles.tableCell}>
                              {previewData['Date To (Parking Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_DateToParking'] || 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Basement Details Table */}
                      <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Basement Details</Text>
                        <View style={styles.table}>
                          <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Field</Text>
                            <Text style={styles.tableHeaderText}>
                              Current Value
                            </Text>
                            <Text style={styles.tableHeaderText}>
                              Verified Value
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>
                              Usage Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Usage Type (Basement Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_UsageBasement'] || 'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>
                              Occupancy Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData[
                                'Occupancy Type (Basement Current)'
                              ] || 'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_OccupancyBasement'] ||
                                'N/A'}
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>
                              Construction Type
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData[
                                'Construction Type (Basement Current)'
                              ] || 'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_ConstructionBasement'] ||
                                'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>
                              Built-up Area
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData[
                                'Built-up Area (Basement Current)'
                              ] || 'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_BuiltUpBasement'] || 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>Date From</Text>
                            <Text style={styles.tableCell}>
                              {previewData['Date From (Basement Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_DateFromBasement'] ||
                                'N/A'}
                            </Text>
                          </View>
                          <View
                            style={[styles.tableRow, styles.tableRowAlternate]}
                          >
                            <Text style={styles.tableCellLabel}>Date To</Text>
                            <Text style={styles.tableCell}>
                              {previewData['Date To (Basement Current)'] ||
                                'N/A'}
                            </Text>
                            <Text style={styles.tableCell}>
                              {previewData['Verified_DateToBasement'] || 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {/* Extra Floor Details Cards */}
                      {addExtraFloor &&
                        floors.length > 0 &&
                        floors.map((floor, floorIndex) => (
                          <View key={floorIndex} style={styles.cardContainer}>
                            <Text style={styles.cardTitle}>
                              Extra Floor {floorIndex + 1} Details
                            </Text>

                            {[
                              {
                                label: 'Floor Type',
                                value:
                                  getLabelByValue(
                                    floorNameDropdownOptions,
                                    floor.floorName,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Construction Type',
                                value:
                                  getLabelByValue(
                                    constructionTypeDropdownOptions,
                                    floor.constructionType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Occupancy Type',
                                value:
                                  getLabelByValue(
                                    occupancyTypeDropdownOptions,
                                    floor.occupancyType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Usage Type',
                                value:
                                  getLabelByValue(
                                    usageTypeDropdownOptions,
                                    floor.usageType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Built-up Area',
                                value: floor.builtupArea || 'N/A',
                              },
                              {
                                label: 'Date From',
                                value: floor.fromDate
                                  ? formatDate(floor.fromDate)
                                  : 'N/A',
                              },
                              {
                                label: 'Date To',
                                value: floor.toDate
                                  ? formatDate(floor.toDate)
                                  : 'N/A',
                              },
                            ].map((item, idx) => (
                              <View key={idx} style={styles.cardRow}>
                                <Text style={styles.cardLabel}>
                                  {item.label}
                                </Text>
                                <Text style={styles.cardValue}>
                                  {item.value}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ))}

                      {/* Remarks Section */}
                      {(remarks || previewData['Remarks (Preview)']) && (
                        <View style={styles.remarksContainer}>
                          <Text style={styles.tableTitle}>Remarks</Text>
                          <View style={styles.remarksBox}>
                            <Text style={styles.remarksText}>
                              {remarks ||
                                previewData['Remarks (Preview)'] ||
                                'No remarks'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </>
                  ) : null;
                })()}
              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setIsPreviewVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitPreview}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Date pickers for parking and basement */}
        {showDateFromParkingPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateFromParkingPicker(false);
              if (newDate) setDateFromParkingDropdown(newDate);
            }}
            value={dateFromParkingDropdown || new Date()}
          />
        )}
        {showDateToParkingPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateToParkingPicker(false);
              if (newDate) setDateToParkingDropdown(newDate);
            }}
            value={dateToParkingDropdown || new Date()}
          />
        )}
        {showDateFromBasementPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateFromBasementPicker(false);
              if (newDate) setDateFromBasementDropdown(newDate);
            }}
            value={dateFromBasementDropdown || new Date()}
          />
        )}
        {showDateToBasementPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateToBasementPicker(false);
              if (newDate) setDateToBasementDropdown(newDate);
            }}
            value={dateToBasementDropdown || new Date()}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SurveyPage;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF', // 👈 your dynamic color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
  },

  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label1: {
    color: 'white',
  },
  input: {
    height: responsiveHeight(5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  removeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5',
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    marginBottom: 5,
  },
  extraFloorContainer: {
    // backgroundColor: '#F5F5F5', // background color for the whole section
    // marginLeft:10,
    // marginRight:10
    // borderRadius: 10,
    // marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // background color for the whole section
    marginLeft: responsiveWidth(2),
    marginRight: responsiveWidth(2),
    paddingLeft: responsiveWidth(3),
    borderRadius: 10,
    marginVertical: 10,
  },
  labelCheckbox: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'blue',
  },
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(4),
    margin: responsiveWidth(4),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
  },
  surveyContainer: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: responsiveHeight(10),
  },
  gradientWrapper: {
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  gradient: {
    borderRadius: 8,
    padding: responsiveWidth(3),
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: responsiveHeight(1),
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  gradientContainer: {
    borderRadius: 10,
    margin: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  dropdown: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    fontSize: 16,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 12,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  table: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowAlternate: {
    backgroundColor: '#f9f9f9',
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    paddingRight: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  remarksBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  remarksText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  remarksContainer: {
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(2),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: responsiveWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  remarksLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: responsiveHeight(1),
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: responsiveWidth(3),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    minHeight: responsiveHeight(12),
    backgroundColor: '#f9f9f9',
  },
  remarksPreviewText: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    lineHeight: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(2),
  },
  cardContainer: {
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f3969',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
});
