import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Error Display Component
const ErrorText = ({ error, styles }) => {
  if (!error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
};

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
  // noRoad,
  // setNoRoad,
  showFieldAlert = () => {},
  styles,
  isEditable,
  errors = {},
  setErrors = () => {},
  khataNoRef,
  plotNoRef,
  villageNameRef,
  plotAreaRef,
  roadWidthRef,
}) => {
  const s = styles || defaultStyles;
  return (
    <View style={s.section}>
      <Text style={s.label}>Property Details</Text>
      <Text style={s.label}>Khata No. *</Text>
      <TextInput
        ref={khataNoRef}
        style={[s.input, errors.khataNo && s.inputError]}
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
      <ErrorText error={errors.khataNo} styles={s} />
      <Text style={s.label}>Plot No. *</Text>
      <TextInput
        ref={plotNoRef}
        style={[s.input, errors.plotNo && s.inputError]}
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
      <ErrorText error={errors.plotNo} styles={s} />
      <Text style={s.label}>Village/Mauja Name *</Text>
      <TextInput
        ref={villageNameRef}
        style={[s.input, errors.villageName && s.inputError]}
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
      <ErrorText error={errors.villageName} styles={s} />
      <Text style={s.label}>Area of Plot (in Decimal) *</Text>
      <TextInput
        ref={plotAreaRef}
        style={[s.input, errors.plotArea && s.inputError]}
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
      <ErrorText error={errors.plotArea} styles={s} />
      <Text style={s.label}>Road Width (in ft) *</Text>
      <TextInput
        ref={roadWidthRef}
        style={[s.input, errors.roadWidth && s.inputError]}
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
      <ErrorText error={errors.roadWidth} styles={s} />
      <Text style={s.label}>
        In Case of No Road Enter "0" (For Vacant Land Only)
      </Text>

      <ErrorText error={errors.noRoad} styles={s} />
    </View>
  );
};

export default PropertyDetails;
