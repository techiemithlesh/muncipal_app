import React from 'react';
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
import moment from 'moment';

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
  inputLabel = 'Enter New Value:',
  inputPlaceholder = 'Enter new value',
  showCalendarOnIncorrect = false,
  calendarValue = new Date(),
  setCalendarValue = () => {},
  onCalendarPress,
  hideCorrectOption = false, // 👈 NEW PROP
}) => {
  const isSelectionRequired = selectedVerification === null;

  const handleVerificationChange = status => {
    setSelectedVerification(status);
    if (status === 'Correct') {
      setDropdownValue('');
      setInputValue && setInputValue('');
      setCalendarValue && setCalendarValue(new Date());
    }
  };

  // Build radio options dynamically
  const options = hideCorrectOption ? ['Incorrect'] : ['Correct', 'Incorrect'];

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

      {/* Correct / Incorrect radio buttons */}
      <View
        style={[
          styles.radioGroup,
          isSelectionRequired && styles.radioGroupRequired,
        ]}
      >
        {options.map(option => (
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

      {/* If Correct, show value as plain text */}
      {selectedVerification === 'Correct' && (
        <View style={styles.staticValueContainer}>
          <Text style={styles.staticValue}>{value}</Text>
        </View>
      )}

      {/* If Incorrect + calendar */}
      {selectedVerification === 'Incorrect' && showCalendarOnIncorrect && (
        <View style={styles.inputContainer}>
          <Text style={styles.staticValueLabel}>Select Date:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={
              typeof onCalendarPress === 'function'
                ? onCalendarPress
                : undefined
            }
          >
            <Text style={{ color: calendarValue ? '#333' : '#aaa' }}>
              {calendarValue && !isNaN(new Date(calendarValue))
                ? moment(calendarValue).format('MMMM YYYY')
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* If Incorrect + text input */}
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

      {/* If Incorrect + dropdown */}
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
          </>
        )}
    </View>
  );
};

export default VerificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(0.5),
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
    marginHorizontal: responsiveWidth(2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  staticValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
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
  inputContainer: {
    paddingHorizontal: responsiveWidth(4),
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
