// All necessary imports
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import FormField from '../Components/FormField';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../Components/CustomAlert';
import { BASE_URL } from '../config';
import HeaderNavigation from '../Components/HeaderNavigation';
import { API_ROUTES } from '../api/apiRoutes';

// Dropdown options will be loaded from API

const ApplyLicense = ({ navigation }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [applicationType, setApplicationType] = useState('NEW APPLICATION');
  const [firmType, setFirmType] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [category, setCategory] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [holdingNo, setHoldingNo] = useState('');
  const [firmName, setFirmName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [newWardNo, setNewWardNo] = useState('');
  const [ownerOfPremises, setOwnerOfPremises] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [natureOfBusiness, setNatureOfBusiness] = useState([]);
  const [licenseFor, setLicenseFor] = useState('');
  const [chargeApplied, setChargeApplied] = useState('');
  const [penalty, setPenalty] = useState('');
  const [denialAmount, setDenialAmount] = useState('');
  const [totalCharge, setTotalCharge] = useState('');
  const [ownershipTypeOptions, setOwnershipTypeOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [owners, setOwners] = useState([
    {
      ownerName: '',
      guardianName: '',
      mobileNo: '',
      email: '',
    },
  ]);

  const [paymentMode, setPaymentMode] = useState('');

  const [wardList, setWardList] = useState([]);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [firmTypeOptions, setFirmTypeOptions] = useState([]);
  const paymentModeOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Demand Draft', value: 'demand_draft' },
    { label: 'Cheque', value: 'cheque' },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const licenseForOptions = [
    { label: '1year', value: '1' },
    { label: '2year', value: '2' },
    { label: '3year', value: '3' },
    { label: '4year', value: '4' },
    { label: '5year', value: '5' },
    { label: '6year', value: '6' },
    { label: '7year', value: '7' },
    { label: '8year', value: '8' },
  ];
  const [chequeDate, setChequeDate] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [taxData, setTaxData] = useState(null);
  const payload = {
    paymentMode,
    ...(paymentMode === 'cheque' && {
      chequeDate,
      chequeNumber,
      bankName,
      branchName,
    }),
  };

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };
  const handleSubmit = async () => {
    // Format establishment date to YYYY-MM-DD
    const formatDate = date => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Build the API payload according to the required format
    const payload = {
      applicationType: 'NEW LICENSE',
      firmTypeId: firmType || 1,
      ownershipTypeId: ownershipType || 1,
      wardMstrId: wardNo || 1,
      newWardMstrId: newWardNo || 1,
      firmName: firmName || '',
      firmDescription: businessDescription || '',
      firmEstablishmentDate: formatDate(establishmentDate) || '2020-02-20',
      premisesOwnerName: ownerOfPremises || '',
      areaInSqft: totalArea || '100',
      address: businessAddress || '',
      pinCode: pinCode || '',
      licenseForYears: licenseFor || '1',
      isTobaccoLicense: 0,
      holdingNo: holdingNo || '',
      natureOfBusiness: natureOfBusiness.map(id => ({
        tradeItemTypeId: String(id),
      })),
      ownerDtl: owners.map(owner => ({
        ownerName: owner.ownerName || '',
        guardianName: owner.guardianName || '',
        mobileNo: owner.mobileNo || '',
      })),
    };

    console.log('✅ API Payload:', JSON.stringify(payload, null, 2));

    // Pass both the API payload and display data to summary
    const summaryData = {
      apiPayload: payload,
      displayData: {
        applicationType,
        firmType:
          firmTypeOptions.find(opt => opt.value === firmType)?.label || '',
        ownershipType:
          ownershipTypeOptions.find(opt => opt.value === ownershipType)
            ?.label || '',
        wardNo:
          wardDropdownOptions.find(opt => opt.value === wardNo)?.label || '',
        newWardNo:
          newWardOptions.find(opt => opt.value === newWardNo)?.label || '',
        firmName,
        businessDescription,
        establishmentDate,
        businessAddress,
        pinCode,
        totalArea,
        licenseFor:
          licenseForOptions.find(opt => opt.value === licenseFor)?.label || '',
        holdingNo,
        ownerOfPremises,
        natureOfBusiness: natureOfBusiness
          .map(id => {
            const found = categoryOptions.find(opt => opt.value === id);
            return found ? found.label : '';
          })
          .filter(label => label !== ''),
        owners,
        chargeApplied: taxData?.licenseCharge?.toString() || '',
        penalty: taxData?.latePenalty?.toString() || '',
        denialAmount: taxData?.arrearCharge?.toString() || '',
        totalCharge: taxData?.totalCharge?.toString() || '',
      },
    };

    navigation.navigate('ApplyLicenseSummary', { submittedData: summaryData });
  };

  useEffect(() => {
    fetchMasterData();
    fetchTradeMaster();
  }, []);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        // get token if required
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        // request body
        const body = {
          applicationType: 'NEW LICENSE',
          firmEstablishmentDate: '2020-02-20',
          areaInSqft: '100',
          licenseForYears: '2',
          isTobaccoLicense: 0,
        };

        // API call
        const response = await axios.post(API_ROUTES.TRADE_REVIEW_TAX, body, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Tax Review Response:', response.data?.data);

        setTaxData(response.data.data);
      } catch (error) {
        console.error(
          '❌ Error fetching Tax Review:',
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTaxData();
  }, []); //
  const fetchTradeMaster = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const res = await axios.post(
        `${BASE_URL}/api/trade/get-trade-master-data`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res?.data?.status) {
        const data = res.data.data;
        setFirmTypeOptions(
          data.firmType.map(f => ({ label: f.firmType, value: f.id })),
        );
        setOwnershipTypeOptions(
          data.ownershipType.map(o => ({
            label: o.ownershipType,
            value: o.id,
          })),
        );
        setWardOptions(
          data.wardList.map(w => ({ label: w.wardNo, value: w.id })),
        );
        // 👇 This is for Nature of Business
        setCategoryOptions(
          data.itemType.map(c => ({
            label: `(${c.tradeCode}) ${c.tradeItem}`, // show code + name
            value: c.id,
          })),
        );
        const mappedOptions = data.itemType.map(c => ({
          label: c.tradeItem,
          value: c.id,
        }));

        console.log('Mapped Category Options:', mappedOptions);

        setCategoryOptions(mappedOptions);
      } else {
        showAlert('Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching trade master:', err);
      showAlert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-saf-master-data`,
        {},
        { headers },
      );

      if (response?.data?.status) {
        const wards = response.data.data.wardList || [];
        console.log('Wards:', wards);
        setWardList(wards);

        const wardOptions = wards.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setWardDropdownOptions(wardOptions);

        fetchNewWardList(wards, headers);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const fetchNewWardList = async (wardList, headers) => {
    for (const item of wardList) {
      try {
        const responseWard = await axios.post(
          `${BASE_URL}/api/property/get-new-ward-by-old`,
          { oldWardId: item.id },
          { headers },
        );

        if (responseWard?.data?.status) {
          const options = responseWard.data.data.map(ward => ({
            label: ward.wardNo,
            value: ward.id,
          }));
          setNewWardOptions(prev => [...prev, ...options]);
        }
      } catch (error) {
        console.error(`Error for ward ID ${item.id}:`, error.message);
      }
    }
  };

  const handleWardChange = async selectedWardId => {
    setWardNo(selectedWardId);
    setNewWardNo('');

    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-new-ward-by-old`,
        { oldWardId: selectedWardId },
        { headers },
      );

      if (response?.data?.status) {
        const options = response.data.data.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setNewWardOptions(options);
      }
    } catch (error) {
      console.error('Error fetching new wards for selected ward:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {/* Page Title */}

        <Text style={styles.pageTitle}>Apply License</Text>

        {/* License Info */}
        <View style={styles.sectionCard}>
          <FormField
            label="Application Type"
            value={applicationType}
            editable={false}
          />
          <FormField
            label="Firm Type"
            type="dropdown"
            value={firmType}
            onChange={setFirmType}
            options={firmTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Firm Type'}
          />
          <FormField
            label="Ownership Type"
            type="dropdown"
            value={ownershipType}
            onChange={setOwnershipType}
            options={ownershipTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Ownership Type'}
          />
        </View>

        {/* Firm Details */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>FIRM DETAILS</Text>
          </View>
          <FormField
            label="Ward No"
            type="dropdown"
            value={wardNo}
            onChange={handleWardChange}
            options={wardDropdownOptions}
          />
          <FormField
            label="Holding No"
            value={holdingNo}
            onChange={setHoldingNo}
          />
          <FormField
            label="Firm Name"
            value={firmName}
            onChange={setFirmName}
          />
          <FormField
            label="Business Description"
            value={businessDescription}
            onChange={setBusinessDescription}
          />
          <FormField
            label="Total Area (in Sq. Ft)"
            value={totalArea}
            onChange={setTotalArea}
          />
          <FormField
            label="Firm Establishment Date"
            type="date"
            value={establishmentDate}
            onChange={setEstablishmentDate}
          />
          <FormField
            label="Business Address"
            value={businessAddress}
            onChange={setBusinessAddress}
          />
          <FormField label="Landmark" value={landmark} onChange={setLandmark} />
          <FormField label="Pin Code" value={pinCode} onChange={setPinCode} />
          <FormField
            label="New Ward No"
            type="dropdown"
            value={newWardNo}
            onChange={setNewWardNo}
            options={newWardOptions}
          />
          <FormField
            label="Owner of Business Premises"
            value={ownerOfPremises}
            onChange={setOwnerOfPremises}
            placeholder="Enter premises owner name"
          />
        </View>

        {/* Owner Details (Dynamic) */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>OWNER DETAILS</Text>
          </View>

          {owners.map((owner, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <FormField
                label={`Owner Name ${owners.length > 1 ? index + 1 : ''}`}
                value={owner.ownerName}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].ownerName = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Guardian Name"
                value={owner.guardianName}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].guardianName = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Mobile No"
                value={owner.mobileNo}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].mobileNo = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Email ID"
                value={owner.email}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].email = value;
                  setOwners(updated);
                }}
              />

              {owners.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const updated = owners.filter((_, i) => i !== index);
                    setOwners(updated);
                  }}
                >
                  <Text style={styles.removeButtonText}>Remove Owner</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setOwners([
                ...owners,
                { ownerName: '', guardianName: '', mobileNo: '', email: '' },
              ]);
            }}
          >
            <Text style={styles.addButtonText}>+ Add Owner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>BUSINESS DETAILS</Text>
          </View>
          <FormField
            label="Nature of Business"
            type="multiselect"
            value={natureOfBusiness} // selected IDs array
            onChange={setNatureOfBusiness} // update selected IDs
            options={categoryOptions} // dropdown options from API
            placeholder={isLoading ? 'Loading...' : 'Select Nature of Business'}
          />
        </View>
        {/* Charges */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>CHARGES</Text>
          </View>
          <FormField
            label="License For"
            type="dropdown"
            value={licenseFor}
            onChange={setLicenseFor}
            options={licenseForOptions}
            placeholder={isLoading ? 'Loading...' : 'Select License Type'}
          />

          <FormField
            label="Charge Applied"
            value={taxData?.licenseCharge?.toString() || ''}
            onChange={setChargeApplied}
            editable={false}
          />

          <FormField
            label="Penalty"
            value={taxData?.latePenalty?.toString() || ''}
            onChange={setPenalty}
            editable={false}
          />

          <FormField
            label="Denial Amount"
            value={taxData?.arrearCharge?.toString() || ''} // was licenseCharge earlier
            onChange={setDenialAmount}
            editable={false}
          />

          <FormField
            label="Total Charge"
            value={taxData?.totalCharge?.toString() || ''}
            onChange={setTotalCharge}
            editable={false}
          />
          {/* <FormField
            label="Payment Mode"
            type="dropdown"
            value={paymentMode}
            onChange={setPaymentMode}
            options={paymentModeOptions}
            placeholder="Select Payment Mode"
          />
          {paymentMode === 'cheque' && (
            <>
              <FormField
                label="Cheque Date"
                type="date"
                value={chequeDate}
                onChange={setChequeDate}
              />
              <FormField
                label="Cheque No"
                value={chequeNumber}
                onChange={setChequeNumber}
              />
              <FormField
                label="Bank Name"
                value={bankName}
                onChange={setBankName}
              />
              <FormField
                label="Branch Name"
                value={branchName}
                onChange={setBranchName}
              />
            </>
          )} */}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default ApplyLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(5),
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: Colors.primary,
  },
  sectionCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },
  headingBox: {
    marginBottom: responsiveHeight(1.5),
  },
  headingText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
  },
});
