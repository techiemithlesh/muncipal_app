import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const ElectricityDetailsSection = ({
  kno,
  setKno,
  accNo,
  setAccNo,
  bindBookNo,
  setBindBookNo,
  electricityCategory,
  setElectricityCategory,
  selectelectcate,
  isRessessment = false,
  isMutation = false,
}) => {
  const isDisabled = isRessessment || isMutation;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Electricity K. No *</Text>
      <TextInput
        style={styles.input}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        keyboardType="numeric"
        maxLength={14}
        value={kno}
        onChangeText={setKno}
        editable={!isDisabled}
      />

      <Text style={styles.label}>ACC No *</Text>
      <TextInput
        style={styles.input}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        keyboardType="numeric"
        value={accNo}
        onChangeText={setAccNo}
        editable={!isDisabled}
      />

      <Text style={styles.label}>BIND/BOOK No</Text>
      <TextInput
        style={styles.input}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        value={bindBookNo}
        onChangeText={setBindBookNo}
        editable={!isDisabled}
      />

      <Text style={styles.label}>Electricity Category *</Text>
      <Dropdown
        style={styles.dropdown}
        data={selectelectcate}
        labelField="label"
        valueField="value"
        value={electricityCategory}
        onChange={item => setElectricityCategory(item.value)}
        disabled={isDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
});

export default ElectricityDetailsSection;
