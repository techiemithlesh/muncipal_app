import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const VerificationCard = ({
  label,
  value, // value to show when 'Correct' is selected
  dropdownOptions, // options for dropdown when 'Incorrect' is selected
  selectedVerification,
  setSelectedVerification,
  dropdownValue,
  setDropdownValue = () => {},
  showInputOnIncorrect = false,
  inputValue = '',
  setInputValue = () => {},
  inputLabel = 'Enter New Ward No.:',
  inputPlaceholder = 'Enter new ward number',
  showCalendarOnIncorrect = false,
  calendarValue = new Date(),
  setCalendarValue = () => {},
  onCalendarPress,
}) => {
  const isSelectionRequired = selectedVerification === null;
  const navigation = useNavigation();

  const handleVerificationChange = status => {
    setSelectedVerification(status);
    if (status === 'Correct') {
      setDropdownValue('');
      setInputValue && setInputValue('');
      setCalendarValue && setCalendarValue(new Date());
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowlabel}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>Self Assessed</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
      </View>

      {isSelectionRequired && (
        <View style={styles.promptContainer}>
          {/* <Text style={styles.promptText}>
            Please select verification status:
          </Text> */}
        </View>
      )}

      <View
        style={[
          styles.radioGroup,
          isSelectionRequired && styles.radioGroupRequired,
        ]}
      >
        {['Correct', 'Incorrect'].map(option => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => handleVerificationChange(option)}
          >
            <View
              style={[
                styles.circle,
                selectedVerification === option && styles.filledCircle,
              ]}
            />
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* If Correct, show value as plain text. If Incorrect, show dropdown/input/calendar. */}
      {selectedVerification === 'Correct' && (
        <View style={styles.staticValueContainer}>
          {/* <Text style={styles.staticValueLabel}>Selected Value: </Text> */}
          <Text style={styles.staticValue}>{value}</Text>
        </View>
      )}

      {selectedVerification === 'Incorrect' && showCalendarOnIncorrect && (
        <View style={styles.inputContainer}>
          <Text style={styles.staticValueLabel}>Select Date:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={typeof onCalendarPress === 'function' ? onCalendarPress : undefined}
          >
            <Text style={{ color: calendarValue ? '#333' : '#aaa' }}>
              {calendarValue && !isNaN(new Date(calendarValue))
                ? (typeof calendarValue === 'string' || typeof calendarValue === 'number')
                  ? moment(calendarValue).format('MMMM YYYY')
                  : moment(calendarValue).isValid()
                    ? moment(calendarValue).format('MMMM YYYY')
                    : 'Select Date'
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedVerification === 'Incorrect' &&
        showInputOnIncorrect &&
        !showCalendarOnIncorrect && (
          <View style={styles.inputContainer}>
            <Text style={styles.staticValueLabel}>{inputLabel}</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={inputPlaceholder}
              keyboardType="default"
            />
          </View>
        )}

      {selectedVerification === 'Incorrect' &&
        !showInputOnIncorrect &&
        !showCalendarOnIncorrect && (
          <>
            <Dropdown
              style={styles.dropdown}
              data={dropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select reason for incorrect verification"
              value={dropdownValue}
              onChange={item => setDropdownValue(item.value)}
              disable={false}
            />
            {dropdownValue && (
              <View style={styles.staticValueContainer}>
                {/* <Text style={styles.staticValueLabel}>Selected: </Text>
                <Text style={styles.staticValueError}>
                  {
                    dropdownOptions.find(item => item.value === dropdownValue)
                      ?.label
                  }
                </Text> */}
              </View>
            )}
          </>
        )}
    </View>
  );
};

export default VerificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2), // reduced from 4
    marginVertical: responsiveHeight(0.5), // adjusted
    marginHorizontal: responsiveWidth(3),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: 'white',
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
  },
  promptContainer: {},
  promptText: {
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  radioGroupRequired: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8f9ff',
    marginHorizontal: responsiveWidth(2),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircle: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    // marginTop: 2,
    // marginBottom: 2,
    // marginTop: 10,
    // marginBottom: 10,
    marginHorizontal: responsiveWidth(2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    // marginVertical: 10,
    // marginHorizontal: responsiveWidth(4),
  },
  staticValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    // marginBottom: 10,
  },
  staticValueLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    fontWeight: '500',
  },
  staticValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#007BFF',
    fontWeight: 'bold',
  },
  staticValueError: {
    fontSize: responsiveFontSize(1.8),
    color: '#dc3545',
    fontWeight: 'bold',
  },
  inputContainer: {
    paddingHorizontal: responsiveWidth(4),
    // marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    backgroundColor: '#fff',
  },
});
