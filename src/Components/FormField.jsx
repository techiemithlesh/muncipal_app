import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import Header from '../Screen/Header';

const FormField = ({
  type = 'input', // 'input', 'dropdown', 'date'
  label,
  placeholder,
  value,
  onChange,
  options = [],
}) => {
  const [open, setOpen] = useState(false);

  const renderInput = () => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
    />
  );

  const renderDropdown = () => (
    <Dropdown
      style={styles.input}
      data={options}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={item => onChange(item.value)}
    />
  );

  const renderDate = () => (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.input}>
        <Text>{value ? new Date(value).toDateString() : placeholder}</Text>
      </Pressable>
      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {type === 'input' && renderInput()}
      {type === 'dropdown' && renderDropdown()}
      {type === 'date' && renderDate()}
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
  },
});
