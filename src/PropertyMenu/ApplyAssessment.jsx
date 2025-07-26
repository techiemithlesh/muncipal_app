import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../Screen/Header';

const ApplyAssessment = () => {
  const [oldWard, setOldWard] = useState('');
  const [newWard, setNewWard] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [armedForces, setArmedForces] = useState('');
  const [speciallyAbled, setSpeciallyAbled] = useState('');
  const [electricityCategory, setElectricityCategory] = useState('');
  const [village, setVillage] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [mobileTower, setMobileTower] = useState('');
  const [hoarding, setHoarding] = useState('');
  const [petrolPump, setPetrolPump] = useState('');
  const [rainHarvesting, setRainHarvesting] = useState('');

  const wardDropdownOptions = [
    { label: 'Ward 1', value: '1' },
    { label: 'Ward 2', value: '2' },
    { label: 'Ward 3', value: '3' },
  ];

  return (
    <View>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Assessment Type</Text>
        <View style={styles.section}>
          <Dropdown
            style={styles.dropdown}
            data={wardDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Old Ward"
            value={oldWard}
            onChange={item => setOldWard(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Ward A', value: 'A' },
              { label: 'Ward B', value: 'B' },
              { label: 'Ward C', value: 'C' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select New Ward"
            value={newWard}
            onChange={item => setNewWard(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Owner', value: 'owner' },
              { label: 'Tenant', value: 'tenant' },
              { label: 'Leased', value: 'leased' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Ownership Type"
            value={ownershipType}
            onChange={item => setOwnershipType(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Industrial', value: 'industrial' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Property Type"
            value={propertyType}
            onChange={item => setPropertyType(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Zone', value: '1' },
              { label: 'Zone', value: '2' },
              { label: 'Zone', value: '3' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Zone"
            value={propertyType}
            onChange={item => setPropertyType(item.value)}
          />
        </View>

        <Text style={styles.header}>Owner Details</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Owner Name"
            placeholderTextColor="#888" // light grey text
            style={styles.input}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={gender}
            onChange={item => setGender(item.value)}
          />

          <TextInput
            placeholder="DOB"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Guardian Name"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Father', value: 'father' },
              { label: 'Husband', value: 'husband' },
              { label: 'Mother', value: 'mother' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Relation"
            value={relation}
            onChange={item => setRelation(item.value)}
          />

          <TextInput
            placeholder="Mobile No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Email Id"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Aadhar No"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Is Armed Forces?"
            value={armedForces}
            onChange={item => setArmedForces(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Is Specially Abled?"
            value={speciallyAbled}
            onChange={item => setSpeciallyAbled(item.value)}
          />
        </View>

        <Text style={styles.header}>Electricity Details</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Electricity K. No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="ACCC No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="BINDHOOK No"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Domestic', value: 'domestic' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Industrial', value: 'industrial' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Consumer Category"
            value={electricityCategory}
            onChange={item => setElectricityCategory(item.value)}
          />
        </View>

        <Text style={styles.header}>Property Details</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Khata No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Plot No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Area of Plot (in Decimal)"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Road Width (in ft)"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Mohalla 1', value: 'mohalla1' },
              { label: 'Mohalla 2', value: 'mohalla2' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Village/Mohalla"
            value={village}
            onChange={item => setVillage(item.value)}
          />
        </View>

        <Text style={styles.header}>Water Connection Details</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Water Connection No"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Water Connection Date"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <Text style={styles.header}>Property Address</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Property Address"
            style={[styles.input, styles.textArea]}
            multiline
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Ranchi', value: 'ranchi' },
              { label: 'Patna', value: 'patna' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            value={city}
            onChange={item => setCity(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Ranchi', value: 'ranchi' },
              { label: 'Gaya', value: 'gaya' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select District"
            value={district}
            onChange={item => setDistrict(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Jharkhand', value: 'jharkhand' },
              { label: 'Bihar', value: 'bihar' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            value={state}
            onChange={item => setState(item.value)}
          />

          <TextInput placeholder="Pincode" style={styles.input} />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Has Mobile Tower?"
            value={mobileTower}
            onChange={item => setMobileTower(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Has Hoarding Board?"
            value={hoarding}
            onChange={item => setHoarding(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Is Petrol Pump?"
            value={petrolPump}
            onChange={item => setPetrolPump(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Rainwater Harvesting?"
            value={rainHarvesting}
            onChange={item => setRainHarvesting(item.value)}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e86de',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ApplyAssessment;
