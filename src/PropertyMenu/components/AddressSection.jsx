import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const AddressSection = ({
  address,
  setAddress,
  city,
  setCity,
  district,
  setDistrict,
  stateValue,
  setStateValue,
  pincode,
  setPincode,
  title,
  isRessessment = false,
  isMutation = false
}) => {
  const isDisabled = isRessessment || isMutation;
  
  return (
  <View style={styles.section}>
    {title && <Text style={styles.header}>{title}</Text>}
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Property Address *</Text>
    <TextInput
      style={styles.input}
      placeholder="Property Address *"
      placeholderTextColor="#000"
      value={address}
      onChangeText={setAddress}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>City *</Text>
    <TextInput
      style={styles.input}
      placeholder="City *"
      placeholderTextColor="#000"
      value={city}
      onChangeText={setCity}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>District *</Text>
    <TextInput
      style={styles.input}
      placeholder="District *"
      placeholderTextColor="#000"
      value={district}
      onChangeText={setDistrict}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>State *</Text>
    <TextInput
      style={styles.input}
      placeholder="State *"
      placeholderTextColor="#000"
      value={stateValue}
      onChangeText={setStateValue}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Pincode *</Text>
    <TextInput
      style={styles.input}
      placeholder="Pincode *"
      placeholderTextColor="#000"
      value={pincode}
      onChangeText={setPincode}
      keyboardType="numeric"
      editable={!isDisabled}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
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
});

export default AddressSection; 