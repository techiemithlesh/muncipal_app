import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import VerificationCard from '../PropertyMenu/VerificationCard';

const LicenseVerificationScreen = () => {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [dropdownValue, setDropdownValue] = useState('');

  const dropdownOptions = [
    { label: 'Wrong Ward Number', value: 'wrong_ward' },
    { label: 'Owner Name Mismatch', value: 'owner_mismatch' },
    { label: 'Invalid License Number', value: 'invalid_license' },
  ];

  return (
    <ScrollView style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
});

export default LicenseVerificationScreen;
