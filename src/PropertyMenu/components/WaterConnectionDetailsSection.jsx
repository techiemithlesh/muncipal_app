import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WaterConnectionDetailsSection = ({
  waterConnectionNo, setWaterConnectionNo,
  waterConnectionDate, setWaterConnectionDate,
  showWaterConnectionDatePicker, setShowWaterConnectionDatePicker,
  isRessessment = false,
  isMutation = false
}) => {
  const isDisabled = isRessessment || isMutation;
  
  return (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Water Connection No</Text>
    <TextInput
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, fontSize: 16, color: '#333' }}
      placeholder="Water Connection No"
      placeholderTextColor="#000"
      value={waterConnectionNo}
      onChangeText={setWaterConnectionNo}
      editable={!isDisabled}
    />
    <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>Water Connection Date</Text>
    <TouchableOpacity
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 12, justifyContent: 'center' }}
      onPress={() => !isDisabled && setShowWaterConnectionDatePicker(true)}
    >
      <Text style={{ color: waterConnectionDate ? '#000' : '#999' }}>
        {waterConnectionDate
          ? new Date(waterConnectionDate).toLocaleDateString('en-GB')
          : 'Water Connection Date (DD/MM/YYYY)'}
      </Text>
    </TouchableOpacity>
    {showWaterConnectionDatePicker && !isDisabled && (
      <DateTimePicker
        value={waterConnectionDate ? new Date(waterConnectionDate) : new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowWaterConnectionDatePicker(false);
          if (event.type === 'set' && selectedDate) {
            setWaterConnectionDate(selectedDate.toISOString());
          }
        }}
      />
    )}
  </View>
  );
};

export default WaterConnectionDetailsSection; 