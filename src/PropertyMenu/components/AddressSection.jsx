import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// ✅ Separate styles section
const css = {
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
};

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
  isMutation = false,
}) => {
  const isDisabled = isRessessment || isMutation;

  return (
    <View style={styles.section}>
      {title && <Text style={styles.header}>{title}</Text>}

      <Text style={styles.label}>Property Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Property Address *"
        placeholderTextColor="grey"
        value={address}
        onChangeText={setAddress}
        editable={!isDisabled}
      />

      <Text style={styles.label}>City *</Text>
      <TextInput
        style={styles.input}
        placeholder="City *"
        placeholderTextColor="grey"
        value={city}
        onChangeText={setCity}
        editable={!isDisabled}
      />

      <Text style={styles.label}>District *</Text>
      <TextInput
        style={styles.input}
        placeholder="District *"
        placeholderTextColor="grey"
        value={district}
        onChangeText={setDistrict}
        editable={!isDisabled}
      />

      <Text style={styles.label}>State *</Text>
      <TextInput
        style={styles.input}
        placeholder="State *"
        placeholderTextColor="grey"
        value={stateValue}
        onChangeText={setStateValue}
        editable={!isDisabled}
      />

      <Text style={styles.label}>Pincode *</Text>
      <TextInput
        style={styles.input}
        placeholder="Pincode *"
        placeholderTextColor="grey"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        editable={!isDisabled}
      />
    </View>
  );
};

// ✅ Use StyleSheet.create with css object
const styles = StyleSheet.create(css);

export default AddressSection;
