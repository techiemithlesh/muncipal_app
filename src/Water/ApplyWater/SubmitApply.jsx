import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import HeaderNavigation from '../../Components/HeaderNavigation';
import Colors from '../../Constants/Colors';

const SubmitApply = ({ route }) => {
  const { formData, masterData } = route.params;
  console.log('Form Data:', masterData);

  // Mapping field keys to their label property
  const labelKeyMap = {
    constructionType: 'constructionType',
    floorType: 'floorName',
    occupancyType: 'occupancyName',
    ownershipType: 'ownershipType',
    propertyType: 'propertyType',
    roadType: 'roadType',
    transferMode: 'transferMode',
    usageType: 'usageType',
    wardList: 'wardNo',
  };

  // Utility to get label from master data
  const getLabel = (options = [], value, masterKey) => {
    if (!options || !value) return 'N/A';
    const valueKey = 'id';
    const labelKey = labelKeyMap[masterKey] || 'name';
    const item = options.find(opt => opt[valueKey] == value);
    return item ? item[labelKey] : 'N/A';
  };

  // Prepare labels
  const propertyLabel = getLabel(
    masterData?.propertyType,
    formData.propertyType,
    'propertyType',
  );
  const ownershipLabel = getLabel(
    masterData?.ownershipType,
    formData.ownerType,
    'ownershipType',
  );
  const wardLabel = getLabel(masterData?.wardList, formData.wardNo, 'wardList');

  const selectedNewWard = formData.newWardOptions?.find(
    opt => opt.value === formData.newWardNo,
  );
  const newWardLabel = selectedNewWard ? selectedNewWard.label : 'N/A';

  const RowItem = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Submitted Data</Text>

        {/* Connection Details */}
        <View style={styles.card}>
          <Text style={styles.heading}>Connection Details</Text>
          <RowItem
            label="Type of Connection"
            value={formData.typeOfConnection || 'N/A'}
          />
          <RowItem
            label="Connection Through"
            value={formData.connectionThrough || 'N/A'}
          />
          <RowItem label="Property Type" value={propertyLabel} />
          <RowItem label="Owner Type" value={ownershipLabel} />
        </View>

        {/* Property Details */}
        <View style={styles.card}>
          <Text style={styles.heading}>Property Details</Text>
          <RowItem label="Ward No" value={wardLabel} />
          <RowItem label="New Ward No" value={newWardLabel} />
          <RowItem label="Total Area" value={formData.totalArea || 'N/A'} />
          <RowItem label="Landmark" value={formData.landmark || 'N/A'} />
          <RowItem label="Pin" value={formData.pin || 'N/A'} />
          <RowItem label="Address" value={formData.address || 'N/A'} />
        </View>

        {/* Applicants */}
        <View style={styles.card}>
          <Text style={styles.heading}>Applicants</Text>
          {formData.applicants?.map((a, index) => (
            <View key={index} style={styles.subCard}>
              <RowItem label="Owner Name" value={a.ownerName || 'N/A'} />
              <RowItem label="Guardian Name" value={a.guardianName || 'N/A'} />
              <RowItem label="Mobile No" value={a.mobileNo || 'N/A'} />
              <RowItem label="Email" value={a.email || 'N/A'} />
            </View>
          ))}
        </View>

        {/* Electricity Details */}
        <View style={styles.card}>
          <Text style={styles.heading}>Electricity Details</Text>
          <RowItem
            label="K No"
            value={formData.electricityDetails?.kNo || 'N/A'}
          />
          <RowItem
            label="Bind Book No"
            value={formData.electricityDetails?.bindBookNo || 'N/A'}
          />
          <RowItem
            label="Account No"
            value={formData.electricityDetails?.accountNo || 'N/A'}
          />
          <RowItem
            label="Electricity Type"
            value={formData.electricityDetails?.electricityType || 'N/A'}
          />
        </View>

        {/* Final Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>FINAL SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    padding: 8,
    color: '#fff',
    backgroundColor: Colors.primary,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 15, fontWeight: '500', color: '#444' },
  value: { fontSize: 15, color: '#555', maxWidth: '60%', textAlign: 'right' },
  subCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fdfdfd',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default SubmitApply;
