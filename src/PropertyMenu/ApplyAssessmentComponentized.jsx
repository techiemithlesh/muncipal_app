import React, { useState, useEffect } from 'react';
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
import Header from '../Screen/Header';
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
import { showToast } from '../utils/toast';

const ApplyAssessmentComponentized = ({ navigation, route }) => {
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

  // All state and logic copied from ApplyAssessment.jsx

  const [error, setError] = useState({});
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    safData.flatRegistryDate ? new Date(safData.flatRegistryDate) : new Date(),
  );

  const [apartmentList, setApartmentList] = useState([]);
  const [apartmentDetail, setApartmentDetail] = useState(null);

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
  const [armedForces, setArmedForces] = useState('');
  const [speciallyAbled, setSpeciallyAbled] = useState('');
  const [electricityCategory, setElectricityCategory] = useState('');
  const [mobileTower, setMobileTower] = useState('');
  const [hoarding, setHoarding] = useState('');
  const [petrolPump, setPetrolPump] = useState('');
  const [rainHarvesting, setRainHarvesting] = useState('');
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
  //   const validateMobile = mobile => /^[6-9]\d{9}$/.test(mobile);
  //   const validateAadhaar = aadhaar => /^\d{12}$/.test(aadhaar);
  //   const validatePAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  //   const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
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
  const handleSubmit = async () => {
    let newErrors = {};

    if (isMutation) {
      if (!transferMode) {
        newErrors.transferMode = 'Please select mode of ownership transfer';
        showToast(
          'error',
          'Validation Error',
          'Please select mode of ownership transfer',
        );
      }

      if (!propertyTransferPercentage) {
        newErrors.propertyTransferPercentage =
          'Please enter property transfer percentage';
        showToast(
          'error',
          'Validation Error',
          'Please enter property transfer percentage',
        );
      } else if (
        isNaN(propertyTransferPercentage) ||
        propertyTransferPercentage < 0 ||
        propertyTransferPercentage > 100
      ) {
        newErrors.propertyTransferPercentage =
          'Percentage must be between 0 and 100';
        showToast(
          'error',
          'Validation Error',
          'Percentage must be between 0 and 100',
        );
      }
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // stop submission if errors exist
    }
    const formData = {
      appartmentDetailsId: safData?.appartmentDetailsId || '',
      holdingId: safData?.id,
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
    };

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
      navigation.navigate('RessesmentSummry', {
        data: formData,
        safData: safData,
      });
    } else if (isMutation) {
      navigation.navigate('MutationScreen', {
        data: formData,
        safData: safData,
      });
    } else {
      navigation.navigate('AssessmentSummary', { data: formData });
    }
    console.log('Frprm saata', fromData);
  };

  const clearFieldError = field => {
    setError(prev => ({ ...prev, [field]: undefined }));
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
    data?.wardList?.map(ward => ({ label: ward?.wardNo, value: ward?.id })) ||
    [];
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
      // Find the correct ward ID from master data
      const oldWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.wardNo,
      );
      setOldWard(oldWardOption?.id || '');

      const newWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.newWardNo,
      );
      setNewWard(newWardOption?.id || '');

      // Find ownership type ID
      const ownershipOption = data?.ownershipType?.find(
        item => item.ownershipType === safData.ownershipType,
      );
      setOwnershipType(ownershipOption?.id || '');

      // Find property type ID
      const propertyTypeOption = data?.propertyType?.find(
        item => item.propertyType === safData.propertyType,
      );
      setPropertyType(propertyTypeOption?.id || '');
      setPropertyTypeLabel(safData.propertyType || '');
      setApartmentDetail({
        apartmentName: safData.apartmentName || 'BALAJEE ENCLAVE( APT-2917)',
        appartmentDetailsId: safData.appartmentDetailsId || 2254,
      });
      // Set zone
      const zoneValue = safData.zone || '';
      // Map zone values to dropdown format
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
        mappedZone = zoneValue; // Keep original if no match
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

        // Set gender dropdown value
        const genderValue = owner.gender?.toLowerCase() || '';
        setGender(genderValue);

        setDob(owner.dob || '');
        setGuardianName(owner.guardianName || '');

        // Find relation type ID
        const relationOption = selectRelation.find(
          item => item.label === owner.relationType,
        );
        setRelation(relationOption?.value || '');

        setMobile(owner.mobileNo?.toString() || '');

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

      // Find electricity category ID
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

      // Extra Charges - Mobile Tower
      setMobileTower(safData.isMobileTower ? 'yes' : 'no');
      setTowerArea(safData.towerArea || '');
      setInstallationDate(safData.towerInstallationDate || '');

      // Extra Charges - Hoarding
      setHoarding(safData.isHoardingBoard ? 'yes' : 'no');
      setHoardingArea(safData.hoardingArea || '');
      setHoardingInstallationDate(safData.hoardingInstallationDate || '');

      // Extra Charges - Petrol Pump
      setPetrolPump(safData.isPetrolPump ? 'yes' : 'no');
      setPumpArea(safData.underGroundArea || '');
      setPumpInstallationDate(safData.petrolPumpCompletionDate || '');

      // Extra Charges - Rainwater Harvesting
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
          // Find the correct IDs from master data options
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

      // Note: floorDetails remains editable and not populated from existing data
      console.log('Reassessment/Mutation data populated successfully');
    }
  }, [isRessessment, isMutation, safData, ownerList, data]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          {isRessessment
            ? 'Reassessment Type'
            : isMutation
            ? 'Mutation Type'
            : 'Assessment Type'}
        </Text>
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
            disable={isRessessment || isMutation}
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
            disable={isRessessment || isMutation}
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
            disable={isRessessment || isMutation}
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
              setPropertyTypeLabel(item.label);
            }}
            disable={isRessessment || isMutation}
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
            disable={isRessessment || isMutation}
          />
          <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
            Zone 1: Over bridge to Saheed chowk.
          </Text>
          <Text style={{ color: 'red', fontSize: 12 }}>
            Zone 2: Rest area other than Zone 1.
          </Text>

          {safData.propTypeMstrId == 3 && (
            <View>
              {/* Date Picker */}
              <Text
                style={[styles.label, error.ownershipType && styles.errorLabel]}
              >
                Select Flat Registry Date *
              </Text>
              <TouchableOpacity
                disabled={true}
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
                style={[styles.label, error.ownershipType && styles.errorLabel]}
              >
                Apartment Details *
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: '#f0f0f0', // optional, to indicate read-only
                }}
              >
                <Text>{safData?.apartmentName || 'N/A'}</Text>
              </View>
            </View>
          )}

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
                onChange={item => {
                  setTransferMode(item.value);
                  if (error.transferMode) clearFieldError('transferMode');
                }}
              />
              {error.transferMode && (
                <Text style={styles.errorText}>{error.transferMode}</Text>
              )}

              <Text style={styles.label}>Property Transfer (0-100%) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter percentage (0-100)"
                keyboardType="numeric"
                value={propertyTransferPercentage}
                onChangeText={text => {
                  setPropertyTransferPercentage(text);
                  if (error.propertyTransferPercentage)
                    clearFieldError('propertyTransferPercentage');
                }}
                maxLength={3}
              />
              {error.propertyTransferPercentage && (
                <Text style={styles.errorText}>
                  {error.propertyTransferPercentage}
                </Text>
              )}
            </>
          )}
        </View>
        <Text style={styles.header}>Owner Details</Text>
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
        />
        <Text style={styles.header}>Electricity Details</Text>
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
        />
        <Text style={styles.header}>Water Connection Details</Text>
        <WaterConnectionDetailsSection
          waterConnectionNo={waterConnectionNo}
          setWaterConnectionNo={setWaterConnectionNo}
          waterConnectionDate={waterConnectionDate}
          setWaterConnectionDate={setWaterConnectionDate}
          showWaterConnectionDatePicker={showWaterConnectionDatePicker}
          setShowWaterConnectionDatePicker={setShowWaterConnectionDatePicker}
          isRessessment={isRessessment}
          isMutation={isMutation}
        />
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
          isRessessment={isRessessment} // true/false
          isMutation={isMutation}
        />
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleCheckboxToggle}
          disabled={isRessessment || isMutation}
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
              isRessessment={isRessessment}
              isMutation={isMutation}
            />
          </View>
        )}
        <Text style={styles.header}>Extra Charges</Text>
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
          setShowPumpInstallationDatePicker={setShowPumpInstallationDatePicker}
          rainHarvesting={rainHarvesting}
          setRainHarvesting={setRainHarvesting}
          completionDate={completionDate}
          setCompletionDate={setCompletionDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          yesNoOptions={yesNoOptions}
          isRessessment={isRessessment}
          isMutation={isMutation}
        />
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
          showFieldAlert={msg => {}}
          styles={styles}
          isEditable={!isRessessment && !isMutation}
        />
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
        />
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
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
});

export default ApplyAssessmentComponentized;
