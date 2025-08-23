import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Colors from '../Constants/Colors';
import { useMasterData } from '../Context/MasterDataContext';
import FormField from '../Components/FormField';
import HeaderNavigation from '../Components/HeaderNavigation';

const ApplyWaterConnectionForm = () => {
  const [typeOfConnection, setTypeOfConnection] = useState(null);
  const [connectionThrough, setConnectionThrough] = useState(null);
  const [propertyType1, setPropertyType1] = useState(null);
  const [ownerType, setOwnerType] = useState(null);
  const [wardNo, setWardNo] = useState(null);
  const [wardNo2, setWardNo2] = useState(null);
  const [totalArea, setTotalArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');

  // Electricity Details states
  const [kNo, setKNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [electricityType, setElectricityType] = useState('');

  // Store multiple applicants in array
  const [applicants, setApplicants] = useState([
    { ownerName: '', guardianName: '', mobileNo: '', email: '' },
  ]);

  const {
    wardList,
    propertyType,
    ownershipType,
    propertyTypeList,
    ownerTypeList,
    loading,
  } = useMasterData();

  const wardOptions =
    wardList?.map(item => ({
      label: `Ward No - ${item.wardNo}`,
      value: item.id,
    })) || [];

  const dropdownData = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  // Add new applicant
  const addApplicant = () => {
    setApplicants(prev => [
      ...prev,
      { ownerName: '', guardianName: '', mobileNo: '', email: '' },
    ]);
  };

  // Remove applicant by index
  const removeApplicant = index => {
    setApplicants(prev => prev.filter((_, i) => i !== index));
  };

  // Handle change in applicant field
  const updateApplicantField = (index, field, value) => {
    const updated = [...applicants];
    updated[index][field] = value;
    setApplicants(updated);
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Apply Water Connection Form</Text>

        {/* First Row */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="Type of Connection *"
              placeholder="Select"
              options={dropdownData}
              value={typeOfConnection}
              onChange={setTypeOfConnection}
            />
          </View>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="Connection Through *"
              placeholder="Select"
              options={dropdownData}
              value={connectionThrough}
              onChange={setConnectionThrough}
            />
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="Property Type *"
              placeholder="Select"
              options={dropdownData}
              value={propertyType1}
              onChange={setPropertyType1}
            />
          </View>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="Owner Type *"
              placeholder="Select"
              options={dropdownData}
              value={ownerType}
              onChange={setOwnerType}
            />
          </View>
        </View>

        {/* Property Details */}
        <Text style={styles.sectionTitle}>Applicant Property Details</Text>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="Ward No. *"
              placeholder="Select"
              options={wardOptions}
              value={wardNo}
              onChange={setWardNo}
            />
          </View>
          <View style={styles.inputContainer}>
            <FormField
              type="dropdown"
              label="New Ward No *"
              placeholder="Select"
              options={wardOptions}
              value={wardNo2}
              onChange={setWardNo2}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="input"
              label="Total Area (in Sq. Ft) *"
              placeholder="Enter Total Area"
              value={totalArea}
              onChange={setTotalArea}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="input"
              label="Landmark *"
              placeholder="Enter Landmark"
              value={landmark}
              onChange={setLandmark}
            />
          </View>
          <View style={styles.inputContainer}>
            <FormField
              type="input"
              label="Pin *"
              placeholder="Enter Pin"
              value={pin}
              onChange={setPin}
            />
          </View>
        </View>
        <View style={styles.fullWidthInputContainer}>
          <FormField
            type="input"
            label="Address *"
            placeholder="Enter Address"
            value={address}
            onChange={setAddress}
          />
        </View>

        {/* Multiple Applicants Section */}
        <Text style={styles.sectionTitle}>Applicant Details</Text>
        {applicants.map((applicant, index) => (
          <View key={index} style={styles.applicantCard}>
            <Text style={styles.applicantTitle}>Applicant {index + 1}</Text>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <FormField
                  type="input"
                  label="Owner Name *"
                  placeholder="Owner Name"
                  value={applicant.ownerName}
                  onChange={value =>
                    updateApplicantField(index, 'ownerName', value)
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <FormField
                  type="input"
                  label="Guardian Name"
                  placeholder="Guardian Name"
                  value={applicant.guardianName}
                  onChange={value =>
                    updateApplicantField(index, 'guardianName', value)
                  }
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <FormField
                  type="input"
                  label="Mobile No. *"
                  placeholder="Mobile No."
                  value={applicant.mobileNo}
                  onChange={value =>
                    updateApplicantField(index, 'mobileNo', value)
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <FormField
                  type="input"
                  label="Email ID"
                  placeholder="Email ID"
                  value={applicant.email}
                  onChange={value =>
                    updateApplicantField(index, 'email', value)
                  }
                />
              </View>
            </View>

            {/* Remove Button (hide if only one applicant) */}
            {applicants.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeApplicant(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add Applicant Button */}
        <TouchableOpacity style={styles.addButton} onPress={addApplicant}>
          <Text style={styles.addButtonText}>+ Add Applicant</Text>
        </TouchableOpacity>

        {/* Electricity Details Section */}
        <Text style={styles.sectionTitle}>APPLICANT ELECTRICITY DETAILS</Text>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <FormField
              type="input"
              label="K. No. *"
              placeholder="Enter K No."
              value={kNo}
              onChange={setKNo}
            />
          </View>
          <View style={styles.inputContainer}>
            <FormField
              type="input"
              label="Bind Book No. *"
              placeholder="Enter Bind Book No."
              value={bindBookNo}
              onChange={setBindBookNo}
            />
          </View>
        </View>

        <View style={styles.fullWidthInputContainer}>
          <FormField
            type="input"
            label="Account No. *"
            placeholder="Enter Account No."
            value={accountNo}
            onChange={setAccountNo}
          />
        </View>

        {/* Electricity Type Radio Buttons */}
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setElectricityType('Residential - DS I/II')}
          >
            <View style={styles.radioCircle}>
              {electricityType === 'Residential - DS I/II' && (
                <View style={styles.selectedRb} />
              )}
            </View>
            <Text style={styles.radioText}>Residential - DS I/II</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setElectricityType('Commercial - NDS II/III')}
          >
            <View style={styles.radioCircle}>
              {electricityType === 'Commercial - NDS II/III' && (
                <View style={styles.selectedRb} />
              )}
            </View>
            <Text style={styles.radioText}>Commercial - NDS II/III</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setElectricityType('Agriculture - IS I/II')}
          >
            <View style={styles.radioCircle}>
              {electricityType === 'Agriculture - IS I/II' && (
                <View style={styles.selectedRb} />
              )}
            </View>
            <Text style={styles.radioText}>Agriculture - IS I/II</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setElectricityType('Low Tension - LTS')}
          >
            <View style={styles.radioCircle}>
              {electricityType === 'Low Tension - LTS' && (
                <View style={styles.selectedRb} />
              )}
            </View>
            <Text style={styles.radioText}>Low Tension - LTS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setElectricityType('High Tension - HTS')}
          >
            <View style={styles.radioCircle}>
              {electricityType === 'High Tension - HTS' && (
                <View style={styles.selectedRb} />
              )}
            </View>
            <Text style={styles.radioText}>High Tension - HTS</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: rw(4),
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    backgroundColor: Colors.primary,
    color: '#fff',
    padding: rw(2),
    marginTop: rh(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rh(2),
  },
  inputContainer: {
    width: '48%',
  },
  fullWidthInputContainer: {
    width: '100%',
    marginTop: rh(2),
  },
  applicantCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: rw(3),
    marginTop: rh(2),
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  applicantTitle: {
    fontSize: rf(2),
    fontWeight: 'bold',
    marginBottom: rh(1),
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: rh(1.8),
    marginTop: rh(2),
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: rf(2),
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: rh(1),
    marginTop: rh(2),
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: rh(1.8),
    marginTop: rh(3),
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: rf(2),
    fontWeight: 'bold',
  },
  radioContainer: {
    marginTop: rh(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: rh(1),
    width: '48%',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: rw(2),
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontSize: rf(1.8),
    color: '#333',
  },
});

export default ApplyWaterConnectionForm;
