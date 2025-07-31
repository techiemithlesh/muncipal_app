import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const ApplyLicenseSummary = ({ route, navigation }) => {
  const { submittedData } = route.params || {};

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const renderSection = (title, data) => (
    <View style={styles.sectionCard}>
      <View style={styles.headingBox}>
        <Text style={styles.headingText}>{title}</Text>
      </View>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{key}:</Text>
          <Text style={styles.fieldValue}>
            {value || 'Not specified'}
          </Text>
        </View>
      ))}
    </View>
  );

  const getLicenseData = () => {
    if (!submittedData) return {};
    
    return {
      'Application Type': submittedData.applicationType,
      'Firm Type': submittedData.firmType,
      'Type of Ownership': submittedData.ownershipType,
      'Category': submittedData.category,
    };
  };

  const getFirmData = () => {
    if (!submittedData) return {};
    
    return {
      'Ward No': submittedData.wardNo,
      'Holding No': submittedData.holdingNo,
      'Firm Name': submittedData.firmName,
      'Total Area (Sq. Ft)': submittedData.totalArea,
      'Establishment Date': formatDate(submittedData.establishmentDate),
      'Business Address': submittedData.businessAddress,
      'Landmark': submittedData.landmark,
      'Pin Code': submittedData.pinCode,
      'New Ward No': submittedData.newWardNo,
      'Owner of Premises': submittedData.ownerOfPremises,
      'Business Description': submittedData.businessDescription,
    };
  };

  const getOwnerData = () => {
    if (!submittedData) return {};
    
    return {
      'Owner Name': submittedData.ownerName,
      'Guardian Name': submittedData.guardianName,
      'Mobile No': submittedData.mobileNo,
      'Email ID': submittedData.email,
    };
  };

  const getBusinessData = () => {
    if (!submittedData) return {};
    
    return {
      'Nature of Business': submittedData.natureOfBusiness,
    };
  };

  const getLicenseDetails = () => {
    if (!submittedData) return {};
    
    return {
      'License For': submittedData.licenseFor,
      'Charge Applied': submittedData.chargeApplied,
      'Penalty': submittedData.penalty,
      'Denial Amount / Arrears': submittedData.denialAmount,
      'Total Charge': submittedData.totalCharge,
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>License Application Summary</Text>
      
      {submittedData ? (
        <>
          {renderSection('LICENSE DETAILS', getLicenseData())}
          {renderSection('FIRM DETAILS', getFirmData())}
          {renderSection('OWNER DETAILS', getOwnerData())}
          {renderSection('NATURE OF BUSINESS', getBusinessData())}
          {renderSection('LICENSE REQUIRED FOR THE YEAR', getLicenseDetails())}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Form</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={() => {
            // Handle final submission to API
            console.log('Final submission:', submittedData);
            alert('Application submitted successfully!');
          }}
        >
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ApplyLicenseSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: responsiveWidth(4),
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: Colors.primaryText || '#000',
    textAlign: 'center',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headingBox: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(1),
    marginBottom: responsiveHeight(1.5),
  },
  headingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(0.8),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
  fieldValue: {
    flex: 2,
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  noDataText: {
    fontSize: responsiveFontSize(2.2),
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(3),
    gap: responsiveWidth(2),
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
}); 