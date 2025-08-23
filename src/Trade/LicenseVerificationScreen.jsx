import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import VerificationCard from '../PropertyMenu/VerificationCard';
import HeaderNavigation from '../Components/HeaderNavigation';

const LicenseVerificationScreen = () => {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [dropdownValue, setDropdownValue] = useState('');
  const [dropdownValue1, setDropdownValue1] = useState('');
  const [selectedVerification1, setSelectedVerification1] = useState(null);
  const [selectedVerification2, setSelectedVerification2] = useState(null);

  const dropdownOptions = [
    { label: 'Wrong Ward Number', value: 'wrong_ward' },
    { label: 'Owner Name Mismatch', value: 'owner_mismatch' },
    { label: 'Invalid License Number', value: 'invalid_license' },
  ];
  const dropdownOptions1 = [
    { label: 'Wrong Ward Number', value: 'wrong_ward' },
    { label: 'Owner Name Mismatch', value: 'owner_mismatch' },
    { label: 'Invalid License Number', value: 'invalid_license' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <VerificationCard
          label="Ward No. Verification"
          value="Ward No: 14"
          dropdownOptions={dropdownOptions}
          selectedVerification={selectedVerification1}
          setSelectedVerification={setSelectedVerification1}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
        <VerificationCard
          label="Ward No. Verification"
          value="Ward No: 14"
          dropdownOptions={dropdownOptions1}
          selectedVerification={selectedVerification2}
          setSelectedVerification={setSelectedVerification2}
          dropdownValue={dropdownValue1}
          setDropdownValue={setDropdownValue1}
        />
        <VerificationCard
          label="Ward No. Verification"
          value="Ward No: 14"
          dropdownOptions={dropdownOptions}
          selectedVerification={selectedVerification}
          setSelectedVerification={setSelectedVerification}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
        <VerificationCard
          label="Ward No. Verification"
          value="Ward No: 14"
          dropdownOptions={dropdownOptions}
          selectedVerification={selectedVerification}
          setSelectedVerification={setSelectedVerification}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
        <VerificationCard
          label="Ward No. Verification"
          value="Ward No: 14"
          dropdownOptions={dropdownOptions}
          selectedVerification={selectedVerification}
          setSelectedVerification={setSelectedVerification}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
});

export default LicenseVerificationScreen;
