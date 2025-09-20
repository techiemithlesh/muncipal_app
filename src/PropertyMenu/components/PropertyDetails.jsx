import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Error Display Component
const ErrorText = ({ error }) => {
  if (!error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
};

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
  showFieldAlert = () => {},
  isEditable,
  errors = {},
  setErrors = () => {},
  khataNoRef,
  plotNoRef,
  villageNameRef,
  plotAreaRef,
  roadWidthRef,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Property Details</Text>

      {/* Khata No */}
      <Text style={styles.label}>Khata No. *</Text>
      <TextInput
        ref={khataNoRef}
        style={[styles.input, errors.khataNo && styles.inputError]}
        placeholder="khata no"
        placeholderTextColor="#000"
        value={khataNo}
        onChangeText={text => {
          setKhataNo(text);
          const error = text.trim() ? '' : 'Khata No is required';
          setErrors(prev => ({ ...prev, khataNo: error }));
        }}
        onFocus={() => showFieldAlert('Khata No.')}
        editable={isEditable}
      />
      <ErrorText error={errors.khataNo} />

      {/* Plot No */}
      <Text style={styles.label}>Plot No. *</Text>
      <TextInput
        ref={plotNoRef}
        style={[styles.input, errors.plotNo && styles.inputError]}
        placeholder="Plot no"
        placeholderTextColor="#000"
        value={plotNo}
        onChangeText={text => {
          setPlotNo(text);
          const error = text.trim() ? '' : 'Plot No is required';
          setErrors(prev => ({ ...prev, plotNo: error }));
        }}
        onFocus={() => showFieldAlert('Plot No.')}
        editable={isEditable}
      />
      <ErrorText error={errors.plotNo} />

      {/* Village Name */}
      <Text style={styles.label}>Village/Mauja Name *</Text>
      <TextInput
        ref={villageNameRef}
        style={[styles.input, errors.villageName && styles.inputError]}
        placeholder="Village Name"
        placeholderTextColor="#000"
        value={villageName}
        onChangeText={text => {
          setVillageName(text);
          const error = text.trim() ? '' : 'Village Name is required';
          setErrors(prev => ({ ...prev, villageName: error }));
        }}
        onFocus={() => showFieldAlert('Village/Mauja Name')}
        editable={isEditable}
      />
      <ErrorText error={errors.villageName} />

      {/* Plot Area */}
      <Text style={styles.label}>Area of Plot (in Decimal) *</Text>
      <TextInput
        ref={plotAreaRef}
        style={[styles.input, errors.plotArea && styles.inputError]}
        placeholder="100.00"
        placeholderTextColor="#000"
        value={plotArea}
        onChangeText={text => {
          setPlotArea(text);
          const error = !text
            ? 'Plot Area is required'
            : isNaN(text) || parseFloat(text) <= 0
            ? 'Plot Area must be a positive number'
            : '';
          setErrors(prev => ({ ...prev, plotArea: error }));
        }}
        keyboardType="numeric"
        onFocus={() => showFieldAlert('Area of Plot')}
        editable={isEditable}
      />
      <ErrorText error={errors.plotArea} />

      {/* Road Width */}
      <Text style={styles.label}>Road Width (in ft) *</Text>
      <TextInput
        ref={roadWidthRef}
        style={[styles.input, errors.roadWidth && styles.inputError]}
        placeholder="Road Width"
        placeholderTextColor="#000"
        value={roadWidth}
        onChangeText={text => {
          setRoadWidth(text);
          const error = !text
            ? 'Road Width is required'
            : isNaN(text) || parseFloat(text) < 0
            ? 'Road Width must be a positive number or 0'
            : '';
          setErrors(prev => ({ ...prev, roadWidth: error }));
        }}
        keyboardType="numeric"
        onFocus={() => showFieldAlert('Road Width')}
        editable={isEditable}
      />
      <ErrorText error={errors.roadWidth} />

      <Text style={styles.label}>
        In Case of No Road Enter "0" (For Vacant Land Only)
      </Text>
      <ErrorText error={errors.noRoad} />
    </View>
  );
};

export default PropertyDetails;

// ---------------- Styles ----------------
const styles = StyleSheet.create({
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
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '400',
  },
});
