import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const defaultStyles = StyleSheet.create({
  section: {
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
});

const PropertyDetails = ({
  khataNo,
  setKhataNo,
  plotNo,
  setPlotNo,
  villageName,
  setVillageName,
  plotArea,
  setPlotArea,
  roadWidth,
  setRoadWidth,
  noRoad,
  setNoRoad,
  showFieldAlert = () => {},
  styles,
}) => {
  const s = styles || defaultStyles;
  return (
    <View style={s.section}>
      <Text style={s.label}>Property Details</Text>
      <Text style={s.label}>Khata No. *</Text>
      <TextInput
        style={s.input}
        placeholder="sfdsfsa"
        placeholderTextColor="#000"
        value={khataNo}
        onChangeText={setKhataNo}
        onFocus={() => showFieldAlert('Khata No.')}
        editable={false}
      />
      <Text style={s.label}>Plot No. *</Text>
      <TextInput
        style={s.input}
        placeholder="hbnm,"
        placeholderTextColor="#000"
        value={plotNo}
        onChangeText={setPlotNo}
        onFocus={() => showFieldAlert('Plot No.')}
        editable={false}
      />
      <Text style={s.label}>Village/Mauja Name *</Text>
      <TextInput
        style={s.input}
        placeholder="dsafsa"
        placeholderTextColor="#000"
        value={villageName}
        onChangeText={setVillageName}
        onFocus={() => showFieldAlert('Village/Mauja Name')}
        editable={false}
      />
      <Text style={s.label}>Area of Plot (in Decimal) *</Text>
      <TextInput
        style={s.input}
        placeholder="100.00"
        placeholderTextColor="#000"
        value={plotArea}
        onChangeText={setPlotArea}
        keyboardType="numeric"
        onFocus={() => showFieldAlert('Area of Plot')}
        editable={false}
      />
      <Text style={s.label}>Road Width (in ft) *</Text>
      <TextInput
        style={s.input}
        placeholder="12.00"
        placeholderTextColor="#000"
        value={roadWidth}
        onChangeText={setRoadWidth}
        keyboardType="numeric"
        onFocus={() => showFieldAlert('Road Width')}
        editable={false}
      />
      <Text style={s.label}>
        In Case of No Road Enter "0" (For Vacant Land Only)
      </Text>
      <TextInput
        style={s.input}
        placeholder="0"
        placeholderTextColor="#000"
        value={noRoad}
        onChangeText={setNoRoad}
        keyboardType="numeric"
        onFocus={() => showFieldAlert('In Case of No Road')}
        editable={false}
      />
    </View>
  );
};

export default PropertyDetails;