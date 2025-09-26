import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const FloorDetailsSection = ({
  propertyTypeLabel,
  floorDetails,
  updateFloorDetail,
  addFloor,
  datePicker,
  setDatePicker,
  floorNameOptions,
  usageTypeOptions,
  occupancyTypeOptions,
  constructionTypeOptions,
  isRessessment = false,
  isMutation = false,
}) => {
  // Floor details are only disabled for mutation
  const isDisabled = isMutation;

  return (
    <>
      {propertyTypeLabel !== 'VACANT LAND' &&
        floorDetails.map((floor, index) => (
          <View key={index} style={styles.floorContainer}>
            <Text style={styles.floorTitle}>Floor {index + 1}</Text>
            <Text style={styles.labelText}>Floor Name *</Text>
            <Dropdown
              style={styles.dropdownStyle}
              data={floorNameOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Floor Name"
              value={floor.floorName}
              onChange={item =>
                !isDisabled && updateFloorDetail(index, 'floorName', item.value)
              }
              disable={isDisabled}
            />
            <Text style={styles.labelText}>Usage Type *</Text>
            <Dropdown
              style={styles.dropdownStyle}
              data={usageTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Usage Type"
              value={floor.usageType}
              onChange={item =>
                !isDisabled && updateFloorDetail(index, 'usageType', item.value)
              }
              disable={isDisabled}
            />
            <Text style={styles.labelText}>Occupancy Type *</Text>
            <Dropdown
              style={styles.dropdownStyle}
              data={occupancyTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Occupancy Type"
              value={floor.occupancyType}
              onChange={item =>
                !isDisabled &&
                updateFloorDetail(index, 'occupancyType', item.value)
              }
              disable={isDisabled}
            />
            <Text style={styles.labelText}>Construction Type *</Text>
            <Dropdown
              style={styles.dropdownStyle}
              data={constructionTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Construction Type"
              value={floor.constructionType}
              onChange={item =>
                !isDisabled &&
                updateFloorDetail(index, 'constructionType', item.value)
              }
              disable={isDisabled}
            />
            <Text style={styles.labelText}>Built Up Area (in Sq. Ft) *</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Built Up Area (in Sq. Ft)"
              keyboardType="numeric"
              placeholderTextColor="black"
              value={floor.builtUpArea}
              onChangeText={text =>
                !isDisabled && updateFloorDetail(index, 'builtUpArea', text)
              }
              editable={!isDisabled}
            />
            <Text style={styles.labelText}>From Date (MM/YYYY) *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                !isDisabled &&
                setDatePicker({ index, field: 'fromDate', show: true })
              }
              disabled={isDisabled}
            >
              <Text style={styles.dateButtonText}>
                {floor.fromDate || 'Select From Date (MM-YYYY)'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.labelText}>Upto Date (MM/YYYY) *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                !isDisabled &&
                setDatePicker({ index, field: 'uptoDate', show: true })
              }
              disabled={isDisabled}
            >
              <Text style={styles.dateButtonText}>
                {floor.uptoDate || 'Select Upto Date (MM-YYYY)'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      {propertyTypeLabel !== 'VACANT LAND' && !isDisabled && (
        <TouchableOpacity onPress={addFloor} style={styles.addFloorButton}>
          <Text style={styles.addFloorButtonText}>+ Add Floor</Text>
        </TouchableOpacity>
      )}
      {/* Render Date Picker only when needed */}
      {datePicker.show && !isDisabled && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date()}
          onChange={() => {}}
        />
      )}
    </>
  );
};

export default FloorDetailsSection;

const styles = StyleSheet.create({
  floorContainer: {
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
  labelText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dropdownStyle: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateButton: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  dateButtonText: {
    color: '#333',
  },
  addFloorButton: {
    backgroundColor: '#2e86de',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addFloorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
