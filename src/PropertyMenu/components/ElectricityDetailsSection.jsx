import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const ElectricityDetailsSection = ({
  kno, setKno,
  accNo, setAccNo,
  bindBookNo, setBindBookNo,
  electricityCategory, setElectricityCategory,
  selectelectcate,
  isRessessment = false,
  isMutation = false
}) => {
  const isDisabled = isRessessment || isMutation;
  
  return (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Electricity K. No *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="Electricity K. No (e.g. xxxx xxxx xxxx)"
      keyboardType="numeric"
      placeholderTextColor="black"
      maxLength={14}
      value={kno}
      onChangeText={setKno}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>ACC No *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="ACC No"
      keyboardType="numeric"
      placeholderTextColor="black"
      value={accNo}
      onChangeText={setAccNo}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>BIND/BOOK No</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="BIND/BOOK No"
      placeholderTextColor="black"
      value={bindBookNo}
      onChangeText={setBindBookNo}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Electricity Category *</Text>
    <Dropdown
      style={{ height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      data={selectelectcate}
      labelField="label"
      valueField="value"
      placeholder="Electricity Category"
      value={electricityCategory}
      onChange={item => setElectricityCategory(item.value)}
      disable={isDisabled}
    />
  </View>
  );
};

export default ElectricityDetailsSection; 