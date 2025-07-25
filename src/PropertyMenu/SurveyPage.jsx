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
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderLogin from '../Screen/HeaderLogin';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// const PreviewModal = ({
//   isVisible,
//   onClose,
//   previewData,
//   extraFloors,
//   remarks,
// }) => {
//   return (
//     <Modal
//       visible={isVisible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Preview Details</Text>
//           <ScrollView style={styles.modalContent}>
//             {Object.entries(previewData).map(([key, value]) => (
//               <View key={key} style={styles.previewRow}>
//                 <Text style={styles.previewLabel}>{key}:</Text>
//                 <Text style={styles.previewValue}>
//                   {typeof value === 'object' && value !== null
//                     ? JSON.stringify(value)
//                     : String(value)}
//                 </Text>
//               </View>
//             ))}

//             {extraFloors?.length > 0 && (
//               <>
//                 <Text style={styles.modalSubtitle}>Extra Floor Details:</Text>
//                 {extraFloors.map((floor, index) => (
//                   <View key={index} style={styles.extraFloorBlock}>
//                     <Text style={styles.previewLabel}>Floor {index + 1}</Text>
//                     <Text>Name: {floor.name || 'N/A'}</Text>
//                     <Text>
//                       Construction Type: {floor.constructionTypeLabel || 'N/A'}
//                     </Text>
//                     <Text>
//                       Occupancy Type: {floor.occupancyTypeLabel || 'N/A'}
//                     </Text>
//                     <Text>Usage Type: {floor.usageTypeLabel || 'N/A'}</Text>
//                     <Text>From Date: {floor.fromDate || 'N/A'}</Text>
//                     <Text>To Date: {floor.toDate || 'N/A'}</Text>
//                   </View>
//                 ))}
//               </>
//             )}

//             {remarks ? (
//               <View style={styles.previewRow}>
//                 <Text style={styles.previewLabel}>Remarks:</Text>
//                 <Text style={styles.previewValue}>{remarks}</Text>
//               </View>
//             ) : null}
//           </ScrollView>
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

const SurveyPage = ({ route, navigation }) => {
  const { id } = route.params;
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

  const showFromPicker = () => setFromPickerVisible(true);
  const hideFromPicker = () => setFromPickerVisible(false);
  const handleFromConfirm = date => {
    setFromDate(date);
    hideFromPicker();
  };

  const handleSubmitPreview = () => {
    const submissionData = {
      ...previewData,
      extraFloors: addExtraFloor
        ? floors?.map(floor => ({
            // Save the ID for API
            floorNameId: floor.floorName,
            // Save the label for display
            floorName: getLabelByValue(
              floorNameDropdownOptions,
              floor.floorName,
            ),
            constructionTypeId: floor.constructionType,
            constructionType: getLabelByValue(
              constructionTypeDropdownOptions,
              floor.constructionType,
            ),
            occupancyTypeId: floor.occupancyType,
            occupancyType: getLabelByValue(
              occupancyTypeDropdownOptions,
              floor.occupancyType,
            ),
            usageTypeId: floor.usageType,
            usageType: getLabelByValue(
              usageTypeDropdownOptions,
              floor.usageType,
            ),
            fromDate: floor.fromDate ? formatDate(floor.fromDate) : '',
            toDate: floor.toDate ? formatDate(floor.toDate) : '',
          }))
        : [],
    };

    console.log('Submitted Data:', submissionData);

    // Navigate and optionally pass data
    navigation.navigate('VerifiedStatus', { submissionData });
  };

  const showToPicker = () => setToPickerVisible(true);
  const hideToPicker = () => setToPickerVisible(false);
  const handleToConfirm = date => {
    setToDate(date);
    hideToPicker();
  };

  const formatDate = date => {
    return date ? date.toLocaleDateString() : 'Select Date';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const response = await axios.post(
          'http://145.223.19.33/api/property/get-saf-field-verification',
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response1 = await axios.post(
          'http://145.223.19.33/api/property/get-saf-master-data',
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMasterData(response1.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
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
  const zoneDropdownOptions = [
    { label: 'Zone 1', value: 'zone1' },
    { label: 'Zone 2', value: 'zone2' },
  ];

  // const floorNameDropdownOptions = floorType.map(item => ({
  //   label: item.floorName,
  //   value: item.floorName, // or value: item.id if you prefer IDs
  // }));
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

  return (
    <ScrollView style={styles.surveyContainer}>
      <HeaderLogin />
      <LinearGradient
        colors={['red', 'blue', 'black']}
        end={{ x: 0, y: 0 }}
        start={{ x: 1, y: 1 }}
      >
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={['#007BFF', '#00BFFF']}
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
        {/* #################### Parking ############# */}
        <LinearGradient
          colors={['red', 'black']}
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
              color: 'white', // white text to contrast background
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            PARKING
          </Text>
          <VerificationCard
            label="Usage-Type"
            value={parkingFloor?.usageType || ''}
            dropdownOptions={usageTypeDropdownOptions || []}
            selectedVerification={usageType}
            setSelectedVerification={setUsageType}
            dropdownValue={usageTypeDropdown}
            setDropdownValue={setUsageTypeDropdown}
          />
          <VerificationCard
            label="occupancy-Type"
            value={parkingFloor?.occupancyName || ''}
            dropdownOptions={occupancyTypeDropdownOptions || []}
            selectedVerification={occupancyType}
            setSelectedVerification={setOccupancyType}
            dropdownValue={occupancyTypeDropdown}
            setDropdownValue={setOccupancyTypeDropdown}
          />
          <VerificationCard
            label="construction-Type"
            value={parkingFloor?.constructionType || ''}
            dropdownOptions={constructionTypeDropdownOptions || []}
            selectedVerification={constructionType}
            setSelectedVerification={setConstructionType}
            dropdownValue={constructionTypeDropdown}
            setDropdownValue={setConstructionTypeDropdown}
          />
          <VerificationCard
            label="buildup-Area"
            value={parkingFloor?.builtupArea || ''}
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
            label="date-From-Parking"
            value={parkingFloor?.dateFrom || ''}
            selectedVerification={dateFromParking}
            setSelectedVerification={setDateFromParking}
            showCalendarOnIncorrect={true}
            calendarValue={dateFromParkingDropdown}
            setCalendarValue={setDateFromParkingDropdown}
          />
          <VerificationCard
            label="date-To-Parking"
            value={parkingFloor?.dateUpto || ''}
            selectedVerification={dateToParking}
            setSelectedVerification={setDateToParking}
            showCalendarOnIncorrect={true}
            calendarValue={dateToParkingDropdown}
            setCalendarValue={setDateToParkingDropdown}
          />
        </LinearGradient>
        // #################### Basement #############
        <LinearGradient
          colors={['red', 'black']}
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
              color: 'white', // white text to contrast background
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
            showInputOnIncorrect={true}
            inputValue={usageTypeInputBasement}
            setInputValue={setUsageTypeInputBasement}
            inputLabel="Enter new usage type (Basement):"
            inputPlaceholder="Enter new usage type (Basement)"
          />

          <VerificationCard
            label="Occupancy-Type (Basement)"
            value={basementFloor?.occupancyName || ''}
            selectedVerification={occupancyTypeBasement}
            setSelectedVerification={setOccupancyTypeBasement}
            showInputOnIncorrect={true}
            inputValue={occupancyTypeInputBasement}
            setInputValue={setOccupancyTypeInputBasement}
            inputLabel="Enter new occupancy type (Basement):"
            inputPlaceholder="Enter new occupancy type (Basement)"
          />

          <VerificationCard
            label="Construction-Type (Basement)"
            value={basementFloor?.constructionType || ''}
            selectedVerification={constructionTypeBasement}
            setSelectedVerification={setConstructionTypeBasement}
            showInputOnIncorrect={true}
            inputValue={constructionTypeInputBasement}
            setInputValue={setConstructionTypeInputBasement}
            inputLabel="Enter new construction type (Basement):"
            inputPlaceholder="Enter new construction type (Basement)"
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
          />

          <VerificationCard
            label="date-To-Basement"
            value={basementFloor?.dateUpto || ''}
            selectedVerification={dateToBasement}
            setSelectedVerification={setDateToBasement}
            showCalendarOnIncorrect={true}
            calendarValue={dateToBasementDropdown}
            setCalendarValue={setDateToBasementDropdown}
          />
        </LinearGradient>
        <View style={styles.extraFloorContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Do You Want To Add Extra Floor?</Text>
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
                style={addExtraFloor ? styles.checkedBox : styles.uncheckedBox}
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
                  </View>

                  <Text style={styles.label}>Date From</Text>
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => updateFloor(index, 'showFromPicker', true)}
                  >
                    <Text style={styles.dateText}>
                      {floor.fromDate
                        ? formatDate(floor.fromDate)
                        : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={!!floor.showFromPicker}
                    mode="date"
                    onConfirm={date => {
                      updateFloor(index, 'fromDate', date);
                      updateFloor(index, 'showFromPicker', false);
                    }}
                    onCancel={() => updateFloor(index, 'showFromPicker', false)}
                  />

                  <Text style={styles.label}>Date Upto</Text>
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => updateFloor(index, 'showToPicker', true)}
                  >
                    <Text style={styles.dateText}>
                      {floor.toDate ? formatDate(floor.toDate) : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={!!floor.showToPicker}
                    mode="date"
                    onConfirm={date => {
                      updateFloor(index, 'toDate', date);
                      updateFloor(index, 'showToPicker', false);
                    }}
                    onCancel={() => updateFloor(index, 'showToPicker', false)}
                  />

                  <Text style={styles.cardText}></Text>
                </LinearGradient>
              ))}

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={addFloor} style={styles.addButton}>
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
        <View
          style={{
            margin: 20,
            marginTop: 10,
            backgroundColor: 'white',
            padding: '12',
            borderRadius: 5,
          }}
        >
          <View style={styles.rowlabel}>
            <Text style={styles.label1}>Remarks</Text>
          </View>

          <TextInput
            style={[
              styles.input,
              { height: 100, textAlignVertical: 'top', marginTop: 10 },
            ]}
            placeholder="Enter your remarks"
            multiline={true}
            numberOfLines={4}
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => {
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
              return getLabelFromOptions(options, dropdownValue);
            };

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

              'Remarks (Preview)': remarks ?? 'NA',

              // Parking
              'Usage Type (Parking Current)': parkingFloor?.usageType,
              Verified_UsageParking: getPreviewValue(
                parkingFloor?.usageType,
                usageTypeDropdown,
                usageType,
                usageTypeDropdownOptions,
              ),

              'Occupancy Type (Parking Current)': parkingFloor?.occupancyName,
              Verified_OccupancyParking: getPreviewValue(
                parkingFloor?.occupancyName,
                occupancyTypeDropdown,
                occupancyType,
                occupancyTypeDropdownOptions,
              ),

              'Construction Type (Parking Current)':
                parkingFloor?.constructionType,
              Verified_ConstructionParking: getPreviewValue(
                parkingFloor?.constructionType,
                constructionTypeDropdown,
                constructionType,
                constructionTypeDropdownOptions,
              ),

              'Built-up Area (Parking Current)': parkingFloor?.builtupArea,
              Verified_BuiltUpParking: getPreviewValue(
                parkingFloor?.builtupArea,
                buildupAreaDropdown,
                buildupArea,
                buildupAreaDropdownOptions,
                builtupAreaIput,
              ),

              'Date From (Parking Current)': parkingFloor?.dateFrom,
              Verified_DateFromParking: getPreviewValue(
                parkingFloor?.dateFrom,
                dateFromParkingDropdown,
                dateFromParking,
              ),

              'Date To (Parking Current)': parkingFloor?.dateUpto,
              Verified_DateToParking: getPreviewValue(
                parkingFloor?.dateUpto,
                dateToParkingDropdown,
                dateToParking,
              ),

              // Basement
              'Usage Type (Basement Current)': basementFloor?.usageType,
              Verified_UsageBasement: getPreviewValue(
                basementFloor?.usageType,
                null,
                usageTypeBasement,
                null,
                usageTypeInputBasement,
              ),

              'Occupancy Type (Basement Current)': basementFloor?.occupancyName,
              Verified_OccupancyBasement: getPreviewValue(
                basementFloor?.occupancyName,
                null,
                occupancyTypeBasement,
                null,
                occupancyTypeInputBasement,
              ),

              'Construction Type (Basement Current)':
                basementFloor?.constructionType,
              Verified_ConstructionBasement: getPreviewValue(
                basementFloor?.constructionType,
                null,
                constructionTypeBasement,
                null,
                constructionTypeInputBasement,
              ),

              'Built-up Area (Basement Current)': basementFloor?.builtupArea,
              Verified_BuiltUpBasement: getPreviewValue(
                basementFloor?.builtupArea,
                buildupAreaDropdownBasement,
                buildupAreaBasement,
                buildupAreaDropdownOptions,
                builtupAreaInputBasement,
              ),

              'Date From (Basement Current)': basementFloor?.dateFrom,
              Verified_DateFromBasement: getPreviewValue(
                basementFloor?.dateFrom,
                dateFromBasementDropdown,
                dateFromBasement,
              ),

              'Date To (Basement Current)': basementFloor?.dateUpto,
              Verified_DateToBasement: getPreviewValue(
                basementFloor?.dateUpto,
                dateToBasementDropdown,
                dateToBasement,
              ),
            };

            setPreviewData(generatedPreview);
            setIsPreviewVisible(true);
          }}
        >
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* Add more VerificationCard components for other fields as needed */}
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
              {/* General Data */}
              {Object.entries(previewData).map(([key, value]) => (
                <View key={key} style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{key}:</Text>
                  <Text style={styles.previewValue}>{value}</Text>
                </View>
              ))}

              {/* Extra Floor Section */}
              {addExtraFloor && floors.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Extra Floor Details</Text>
                  {floors.map((floor, index) => (
                    <View key={index} style={styles.floorCard}>
                      <Text style={styles.previewLabel}>
                        Extra Floor {index + 1}
                      </Text>
                      {/* <Text style={styles.previewRow}>Name: {floor.name}</Text> */}
                      <Text style={styles.previewRow}>
                        Floor Type:{' '}
                        {getLabelByValue(
                          floorNameDropdownOptions,
                          floor.floorName, // ✅ Correct key
                        )}
                      </Text>
                      <Text style={styles.previewRow}>
                        Construction Type:{' '}
                        {getLabelByValue(
                          constructionTypeDropdownOptions,
                          floor.constructionType,
                        )}
                      </Text>
                      <Text style={styles.previewRow}>
                        Occupancy Type:{' '}
                        {getLabelByValue(
                          occupancyTypeDropdownOptions,
                          floor.occupancyType,
                        )}
                      </Text>
                      <Text style={styles.previewRow}>
                        Usage Type:{' '}
                        {getLabelByValue(
                          usageTypeDropdownOptions,
                          floor.usageType,
                        )}
                      </Text>
                      <Text style={styles.previewRow}>
                        From Date:{' '}
                        {floor.fromDate ? formatDate(floor.fromDate) : 'N/A'}
                      </Text>
                      <Text style={styles.previewRow}>
                        To Date:{' '}
                        {floor.toDate ? formatDate(floor.toDate) : 'N/A'}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsPreviewVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitPreview}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SurveyPage;

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: 'yellow', // 👈 your dynamic color
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
    marginVertical: 10,
    backgroundColor: '#F5F5F5', // background color for the whole section
    marginLeft: responsiveWidth(2),
    marginRight: responsiveWidth(2),
    paddingLeft: responsiveWidth(3),
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
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
    marginTop: 10,
    borderRadius: 8,
    padding: 16,
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
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
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
  previewRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  previewLabel: {
    fontWeight: '600',
    width: 120,
  },
  previewValue: {
    flex: 1,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
