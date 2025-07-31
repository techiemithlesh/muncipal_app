import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const OwnerDetailsSection = ({
  ownerName, setOwnerName,
  gender, setGender, genderOptions,
  dob, setDob, showDobPicker, setShowDobPicker,
  guardianName, setGuardianName,
  relation, setRelation, selectRelation,
  mobile, setMobile,
  aadhaar, setAadhaar,
  pan, setPan,
  email, setEmail,
  armedForces, setArmedForces,
  speciallyAbled, setSpeciallyAbled,
  yesNoOptions,
  isRessessment = false,
  isMutation = false
}) => {
  // For mutation, owner fields should be editable (not disabled)
  // For reassessment, owner fields should be disabled
  const isOwnerDisabled = isRessessment && !isMutation;
  
  return (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Owner Name *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="Owner Name"
      placeholderTextColor="black"
      value={ownerName}
      onChangeText={setOwnerName}
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Gender *</Text>
    <Dropdown
      style={{ height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      data={genderOptions}
      labelField="label"
      valueField="value"
      placeholder="Select Gender"
      value={gender}
      onChange={item => setGender(item.value)}
      disable={isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Date of Birth *</Text>
    <TouchableOpacity
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      onPress={() => !isOwnerDisabled && setShowDobPicker(true)}
    >
      <Text style={{ color: dob ? '#000' : '#999' }}>
        {dob ? new Date(dob).toLocaleDateString('en-GB') : 'DOB *'}
      </Text>
    </TouchableOpacity>
    {showDobPicker && !isOwnerDisabled && (
      <DateTimePicker
        value={dob ? new Date(dob) : new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDobPicker(false);
          if (event.type === 'set' && selectedDate) {
            setDob(selectedDate.toISOString());
          }
        }}
      />
    )}
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Guardian Name</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="Guardian Name"
      placeholderTextColor="black"
      value={guardianName}
      onChangeText={setGuardianName}
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Relation *</Text>
    <Dropdown
      style={{ height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      data={selectRelation}
      labelField="label"
      valueField="value"
      placeholder="Select Relation"
      value={relation}
      onChange={item => setRelation(item.value)}
      disable={isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Mobile Number *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      keyboardType="numeric"
      maxLength={10}
      placeholder="Enter Mobile Number"
      value={mobile}
      onChangeText={setMobile}
      placeholderTextColor="black"
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Aadhaar Number *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      keyboardType="numeric"
      maxLength={12}
      placeholder="Enter Aadhaar Number"
      value={aadhaar}
      onChangeText={setAadhaar}
      placeholderTextColor="black"
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>PAN Number *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      autoCapitalize="characters"
      maxLength={10}
      placeholder="Enter PAN Number"
      value={pan}
      onChangeText={setPan}
      placeholderTextColor="black"
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Email Address *</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      keyboardType="email-address"
      placeholder="Enter Email"
      value={email}
      onChangeText={setEmail}
      placeholderTextColor="black"
      editable={!isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Member of Armed Forces?</Text>
    <Dropdown
      style={{ height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      data={yesNoOptions}
      labelField="label"
      valueField="value"
      placeholder="Member of Armed Forces?"
      value={armedForces}
      onChange={item => setArmedForces(item.value)}
      disable={isOwnerDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Specially Abled?</Text>
    <Dropdown
      style={{ height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      data={yesNoOptions}
      labelField="label"
      valueField="value"
      placeholder="Specially Abled?"
      value={speciallyAbled}
      onChange={item => setSpeciallyAbled(item.value)}
      disable={isOwnerDisabled}
    />
  </View>
  );
};

export default OwnerDetailsSection; 