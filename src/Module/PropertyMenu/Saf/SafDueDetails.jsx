import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import { WORK_FLOW_PERMISSION } from '../../../api/apiRoutes';
import { TCVerificationModal } from './Models/TCVerificationModal';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropertyTaxNoticeModal from './Models/PropertyTaxNoticeModal';
import PaymentReceiptModal from './PaymentReceiptModal';
import { ViewDemandModal } from './Models/ViewDemandModal';
import { PayNowModal } from './Models/PayNowModal';
import { DocumentViewModal } from './Models/DocumentViewModal';
import { ImageViewModal } from './Models/ImageViewModal';
import React from 'react';
import Header from '../../../Screen/Header';
import Colors from '../../Constants/Colors';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { getToken } from '../../../utils/auth';
const SafDueDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [safData, setSafData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerList, setOwnerList] = useState([]); // 👈 owners arrayconst
  const [floordata, setFloorData] = useState([]);
  const [taxDetails, setTaxDetails] = useState([]);
  const [transDtls, setTranDtls] = useState([]);
  const [memoDtls, setMemoDtls] = useState([]);
  const [tcVerfivication, setTcVerfivication] = useState([]);
  const [paymentDtls, setPaynemtDtls] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // View Demand Modal
  const [viewDemandVisible, setViewDemandVisible] = useState(false);
  const [demandlist, setDemandList] = useState(null);
  const [currentdemand, setCurrentDemand] = useState(null);
  const [maindata, setMaindata] = useState(null);
  const [showPayNow, setShowPayNow] = useState(false);

  const [docModalVisible, setDocModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [payNowModalVisible, setPayNowModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [amount, setAmount] = useState('0.00');
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [paymentReceiptVisible, setPaymentReceiptVisible] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const paymentTypeData = [{ label: 'Full', value: 'Full' }];

  const paymentModeData = [
    { label: 'DD', value: 'DD' },
    { label: 'Cash', value: 'Cash' },
    { label: 'NEFT', value: 'NEFT' },
    { label: 'Cheque', value: 'ChEQUE' },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [permissionData, setPermissionData] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const fetchedToken = await getToken();
        if (fetchedToken) {
          setToken(fetchedToken);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const handleView = id => {
    setIsVisible(true); // if you are opening a modal
    setSelectedData(id); // store it in state to use in modal
  };

  const viewdemand = async id => {
    try {
      if (!token) {
        return Alert.alert('Error', 'Token not found');
      }
      const response = await axios.post(
        `${BASE_URL}/api/property/get-saf-demand`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const demandList = response.data?.data?.demandList || [];
      const currentDeman = response.data?.data?.currentDemand;
      setMaindata(response.data?.data);
      setCurrentDemand(currentDeman);
      setDemandList(demandList);
      setViewDemandVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch demand');
    }
  };

  const documentview = async id => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/property/get-uploaded-doc-list`,
        { id }, // Send the document/property ID in body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const uploadedDocs = response.data?.data;
      setUploadedDocs(uploadedDocs); // <-- if using useState
      setDocModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch document list.');
    }
  };

  const handleViewReceipt = async tranDtlId => {
    try {
      if (!token) {
        console.warn('Token not found');
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/api/property/payment-receipt`,
        { id: tranDtlId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setPaynemtDtls(response.data?.data);
      setPaynemtDtls(response.data?.data);
      setModalVisible(true);
      // setReceiptData(response.data?.data);
    } catch (error) {
      console.error(
        'Error fetching payment receipt:',
        error?.response || error,
      );
    }
  };

  const fetchSafDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/property/get-saf-dtl`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const safData = response.data?.data;
      setWorkflowId(safData?.workflowId);
      setOwnerList(safData?.owners || []);
      setFloorData(safData?.floors || []);
      setTaxDetails(safData?.tranDtls || []);
      setTranDtls(safData?.tranDtls || []);
      setMemoDtls(safData?.memoDtls || []);

      setTcVerfivication(safData?.tcVerifications || []);
      setSafData(safData);
      console.log(safData, 'asbdsjaj');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load property details. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPermission = async () => {
    try {
      const response = await axios.post(
        WORK_FLOW_PERMISSION,
        { wfId: workflowId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const permission = response.data?.data;
      if (permission) {
        setPermissionData(permission);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentTypeChange = item => {
    console.log('Payment Type selected:', item.value);
    setPaymentType(item.value);
  };

  const handlePaymentModeChange = item => {
    console.log('Payment Mode selected:', item.value);
    setPaymentMode(item.value);
  };

  // Update amount when maindata changes - MUST be before any conditional returns

  useEffect(() => {
    if (id && token) {
      fetchSafDetails();
    } else {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (maindata?.payableAmount) {
      setAmount(maindata.payableAmount.toString());
    }
  }, [maindata]);

  useEffect(() => {
    if (workflowId && token) fetchPermission();
  }, [workflowId, token]);

  const processPayment = async () => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('token'));
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return false;
      }

      const paymentData = {
        id: id,
        paymentType: paymentType?.toUpperCase() || 'FULL',
        paymentMode: paymentMode?.toUpperCase() || 'CASH',
        chequeNo: paymentMode === 'Cash' ? '' : refNo || '',
        chequeDate:
          paymentMode === 'Cash'
            ? ''
            : chequeDate
            ? chequeDate.toISOString().split('T')[0]
            : '',
        bankName: paymentMode === 'Cash' ? '' : bankName || '',
        branchName: paymentMode === 'Cash' ? '' : branchName || '',
      };

      console.log('Processing payment:', paymentData);

      // Make payment API call
      const response = await axios.post(
        `${BASE_URL}/api/property/pay-saf-demand`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log('Payment API response:', response.data);

      if (response.data.status === true) {
        console.log(
          'Payment processed successfully, Transaction ID:',
          response.data.data?.tranId,
        );
        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );
        fetchSafDetails(); // Refresh details after payment
        viewdemand(id); // Refresh document list

        setModalVisible(true);
        handleViewReceipt(response.data.data?.tranId);

        return { success: true, tranId: response.data.data?.tranId };
      } else {
        Alert.alert('Payment Error', response.data.message || 'Payment failed');
        return { success: false };
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        error.response?.data?.message ||
          'Failed to process payment. Please try again.',
      );
      return { success: false };
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.headignColor} />
        <Text
          style={{ marginTop: 10, fontSize: 16, color: Colors.headignColor }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <HeaderNavigation />
      <View style={styles.container}>
        {/* Basic Details Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Basic Details</Text>
          <View style={styles.row}>
            <Text style={styles.labelFixed}>Status:</Text>
            <Text style={styles.value}>{safData?.appStatus ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelFixed}>Saf No :</Text>
            <Text style={styles.value}>{safData?.safNo ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelFixed}>Apply Date:</Text>
            <Text style={styles.value}>{safData?.applyDate ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Ward No:</Text>
            <Text style={styles.value}>{safData?.wardNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>New Ward No:</Text>
            <Text style={styles.value}>{safData?.newWardNo ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelFixed}>Assessment Type:</Text>
            <Text style={styles.value}>{safData?.assessmentType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Property Type:</Text>
            <Text style={styles.value}>{safData?.propertyType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Ownership Type:</Text>
            <Text style={styles.value}>{safData?.ownershipType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Road Width (ft):</Text>
            <Text style={styles.value}>{safData?.roadWidth ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Area of Plot (sq. ft):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Rainwater Harvesting:</Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Zone:</Text>
            <Text style={styles.value}>{safData?.zone ?? 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Owner Details</Text>

          {ownerList.length > 0 ? (
            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Sl No.
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Owner
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Guardian
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Relation
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Mobile
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Gender
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>DOB</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Email
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Aadhar
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>PAN</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Specially Abled
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Armed Force
                  </Text>
                </View>

                {/* Table Rows */}
                {ownerList.map((owner, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {owner.ownerName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.guardianName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.relationType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.mobileNo ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.gender ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>{owner.dob ?? 'N/A'}</Text>
                    <Text style={styles.tableCell}>{owner.email ?? 'N/A'}</Text>
                    <Text style={styles.tableCell}>
                      {owner.aadharNo || 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>{owner.panNo || 'N/A'}</Text>
                    <Text style={styles.tableCell}>
                      {owner.isSpeciallyAbled ? 'Yes' : 'No'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.isArmedForce ? 'Yes' : 'No'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.row}>
              <Text style={styles.value}>No owner details available.</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Electricity Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Electricity K. No:</Text>
            <Text style={styles.value}>
              {safData?.electConsumerNo ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>ACC No.:</Text>
            <Text style={styles.value}>{safData?.electAccNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>BIND/BOOK No.:</Text>
            <Text style={styles.value}>
              {safData?.electBindBookNo ? safData.electBindBookNo : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Electricity Consumer Category:
            </Text>
            <Text style={styles.value}>
              {safData?.electConsCategory ?? 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>
            Building Plan / Water Connection Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Building Plan Approval No:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalNo
                ? safData.buildingPlanApprovalNo
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Building Plan Approval Date:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalDate
                ? safData.buildingPlanApprovalDate
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Water Consumer No:</Text>
            <Text style={styles.value}>
              {safData?.waterConnNo ? safData.waterConnNo : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Water Connection Date:</Text>
            <Text style={styles.value}>
              {safData?.waterConnDate ? safData.waterConnDate : 'NA'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Khata No:</Text>
            <Text style={styles.value}>{safData?.khataNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Village/Mauja Name:</Text>
            <Text style={styles.value}>
              {safData?.villageMaujaName ?? 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Area of Plot (in Decimal):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot ?? 'NA'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Address</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>City:</Text>
            <Text style={styles.value}>{safData?.propCity ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Pin:</Text>
            <Text style={styles.value}>{safData?.propPinCode ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>State:</Text>
            <Text style={styles.value}>{safData?.propState ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>District:</Text>
            <Text style={styles.value}>{safData?.propDist ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              If Corresponding Address Different:
            </Text>
            <Text style={styles.value}>
              {safData?.isCorrAddDiffer ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Floor Details</Text>

          {floordata?.length > 0 ? (
            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Sl No.
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Floor
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Usage Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Occupancy Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Construction Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Carpet Area
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Built-up Area
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    From Date
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Upto Date
                  </Text>
                </View>

                {/* Table Rows */}
                {floordata.map((floor, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {floor.floorName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.usageType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.occupancyName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.constructionType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.carpetArea ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.builtupArea ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.dateFrom ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.dateUpto ? floor.dateUpto : 'N/A'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.row}>
              <Text style={styles.value}>No floor details available.</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Additional Property Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Does Property Have Mobile Tower(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isMobileTower ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Date of Installation of Mobile Tower:
            </Text>
            <Text style={styles.value}>
              {safData?.towerInstallationDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Total Area Covered by Mobile Tower & its Equipments (Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.towerArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Does Property Have Hoarding Board(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isHoardingBoard ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Date of Installation of Hoarding Board(s):
            </Text>
            <Text style={styles.value}>
              {safData?.hoardingInstallationDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Total Area of Wall / Roof / Land (in Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.hoardingArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Is Property a Petrol Pump?</Text>
            <Text style={styles.value}>
              {safData?.isPetrolPump ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Completion Date of Petrol Pump:
            </Text>
            <Text style={styles.value}>
              {safData?.petrolPumpCompletionDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Underground Storage Area (in Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.underGroundArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Rainwater Harvesting Provision?
            </Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {transDtls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Payment Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Transaction No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Payment Mode
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Date
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    From Qtr / Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Upto Qtr / Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Amount
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    View
                  </Text>
                </View>

                {/* Table Body */}
                {transDtls.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item?.tranNo ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item?.paymentMode ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.tranDate
                        ? new Date(item.tranDate).toLocaleDateString('en-GB')
                        : 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.fromQtr ?? 'NA'} / {item?.fromFyear ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.uptoQtr ?? 'NA'} / {item?.uptoFyear ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.payableAmt ?? 'NA'}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleViewReceipt(item.id)}
                    >
                      <Text style={[styles.tableCell, { color: 'blue' }]}>
                        View
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {Array.isArray(memoDtls) && memoDtls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Memo Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Memo No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Memo Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Holding No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Quarter
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Financial Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Quarterly Tax
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Created At
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    User Name
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    User Name
                  </Text>
                </View>

                {/* Table Rows */}
                {memoDtls.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item.memoNo ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item.memoType ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.holdingNo ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>{item.qtr ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>{item.fyear ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item.quarterlyTax ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-GB')
                        : 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.userName ?? 'NA'}
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setVisible(true)}
                    >
                      <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>

                    <PropertyTaxNoticeModal
                      visible={visible}
                      onClose={() => setVisible(false)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {tcVerfivication.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Tc Varification</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Transaction No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Payment Mode
                  </Text>

                  <Text style={[styles.tableCell, styles.headerText]}>
                    View
                  </Text>
                </View>

                {/* Table Body */}
                {tcVerfivication.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {item?.verifiedBy ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.towerInstallationDate ?? 'NA'}
                    </Text>

                    <TouchableOpacity onPress={() => handleView(item.id)}>
                      <Text style={{ color: 'blue' }}>View</Text>
                    </TouchableOpacity>

                    {/* TC Verification Modal */}
                    <TCVerificationModal
                      visible={isVisible}
                      onClose={() => setIsVisible(false)}
                      id={selectedData}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => documentview(id)}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}> View Document</Text>
        </TouchableOpacity>

        {safData?.paymentStatus == 0 && (
          <TouchableOpacity
            onPress={() => {
              setShowPayNow(false);
              setViewDemandVisible(true);
              viewdemand(id);
            }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionBtnText}> View Demand</Text>
          </TouchableOpacity>
        )}
        {safData?.paymentStatus == 0 && (
          <TouchableOpacity
            onPress={() => {
              setShowPayNow(true); // ✅ Show Pay Now
              setViewDemandVisible(true);
              viewdemand(id);
            }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionBtnText}>🔄 Proceed Payment</Text>
          </TouchableOpacity>
        )}
      </View>
      <PayNowModal
        visible={payNowModalVisible}
        onClose={() => setPayNowModalVisible(false)}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        amount={amount}
        setAmount={setAmount}
        refNo={refNo}
        setRefNo={setRefNo}
        chequeDate={chequeDate}
        setChequeDate={setChequeDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        bankName={bankName}
        setBankName={setBankName}
        branchName={branchName}
        setBranchName={setBranchName}
        onProceed={async () => {
          console.log('Submitting:', {
            paymentType,
            paymentMode,
            amount,
          });

          // Close payment modal first
          setPayNowModalVisible(false);

          // Process the payment
          const paymentResult = await processPayment();

          if (paymentResult.success) {
            // Store transaction ID for receipt
            setTransactionId(paymentResult.tranId);

            // Refresh demand data after payment
            await viewdemand(id);

            // Check if all demand values are now 0 (payment completed)
            setTimeout(() => {
              const allValuesZero = demandlist?.every(item => {
                const totalDue =
                  parseFloat(item.dueHoldingTax || 0) +
                  parseFloat(item.dueLatrineTax || 0) +
                  parseFloat(item.dueWaterTax || 0) +
                  parseFloat(item.dueHealthCessTax || 0) +
                  parseFloat(item.dueEducationCessTax || 0) +
                  parseFloat(item.dueRwhTax || 0) +
                  parseFloat(item.monthlyPenalty || 0);
                return totalDue === 0;
              });

              // Always show receipt after successful payment, regardless of demand data
              setPaymentCompleted(true);
              setViewDemandVisible(false); // Close demand modal
              setPaymentReceiptVisible(true); // Show receipt

              if (
                allValuesZero ||
                parseFloat(maindata?.payableAmount || 0) === 0
              ) {
                console.log(
                  'Payment completed - all demand values are now zero',
                );
              }
            }, 500); // Small delay to ensure data is updated
          }
        }}
      />

      {/* View Demand Modal */}
      <ViewDemandModal
        visible={viewDemandVisible}
        onClose={() => setViewDemandVisible(false)}
        demandlist={demandlist}
        maindata={maindata}
        showPayNow={showPayNow}
        onPayNowPress={() => {
          console.log('Pay Now Clicked');
          setPayNowModalVisible(true);
        }}
      />

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          {/* Header */}
          <Text style={styles.header}>View Receipt</Text>

          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Text style={styles.logoCircle}>🏛️</Text>
          </View>

          {/* Corporation Name */}
          <Text style={styles.corpName}>
            {paymentDtls?.ulbDtl?.ulbName || 'Ranchi Municipal Corporation'}
          </Text>

          {/* Subheading */}
          <Text style={styles.receiptType}>
            {paymentDtls?.description || 'HOLDING TAX RECEIPT'}
          </Text>

          {/* Horizontal line */}
          <View style={styles.divider} />

          {/* Meta Info Section */}
          <View style={styles.metaRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelFixed}>
                Receipt No.:{' '}
                <Text style={styles.bold}>{paymentDtls?.tranNo}</Text>
              </Text>
              <Text style={styles.labelFixed}>
                Department:{' '}
                <Text style={styles.bold}>{paymentDtls?.department}</Text>
              </Text>
              <Text style={styles.labelFixed}>
                Account:{' '}
                <Text style={styles.bold}>
                  {paymentDtls?.accountDescription}
                </Text>
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelFixed}>
                Date: <Text style={styles.bold}>{paymentDtls?.tranDate}</Text>
              </Text>
              <Text style={styles.labelFixed}>
                Ward No: <Text style={styles.bold}>{paymentDtls?.wardNo}</Text>
              </Text>
              <Text style={styles.labelFixed}>
                New Ward No:{' '}
                <Text style={styles.bold}>{paymentDtls?.newWardNo}</Text>
              </Text>
              <Text style={styles.labelFixed}>
                SAF No: <Text style={styles.bold}>{paymentDtls?.safNo}</Text>
              </Text>
            </View>
          </View>

          {/* Owner Info */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.labelFixed}>
              Received From:{' '}
              <Text style={styles.bold}>{paymentDtls?.ownerName}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              Address: <Text style={styles.bold}>{paymentDtls?.address}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              A Sum of Rs.:{' '}
              <Text style={styles.bold}>{paymentDtls?.amount}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              (In words):{' '}
              <Text style={styles.bold}>{paymentDtls?.amountInWords}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              Towards:{' '}
              <Text style={styles.bold}>{paymentDtls?.accountDescription}</Text>{' '}
              Vide: <Text style={styles.bold}>{paymentDtls?.paymentMode}</Text>
            </Text>
          </View>

          {/* Tax Table */}
          <View style={styles.tableWrapper}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.col, { flex: 2 }]}>Description</Text>
              <Text style={styles.col}>From QTR</Text>
              <Text style={styles.col}>From FY</Text>
              <Text style={styles.col}>To QTR</Text>
              <Text style={styles.col}>To FY</Text>
              <Text style={[styles.col, { flex: 1 }]}>Amount</Text>
            </View>

            {/* Holding Tax */}
            <View style={styles.tableRowModal}>
              <Text style={[styles.col, { flex: 2 }]}>Holding Tax</Text>
              <Text style={styles.col}>{paymentDtls?.fromQtr}</Text>
              <Text style={styles.col}>{paymentDtls?.fromFyear}</Text>
              <Text style={styles.col}>{paymentDtls?.uptoQtr}</Text>
              <Text style={styles.col}>{paymentDtls?.uptoFyear}</Text>
              <Text style={[styles.col, { flex: 1 }]}>
                {paymentDtls?.holdingTax}
              </Text>
            </View>

            {/* RWH */}
            <View style={styles.tableRowModal}>
              <Text style={[styles.col, { flex: 2 }]}>RWH</Text>
              <Text style={styles.col}>{paymentDtls?.fromQtr}</Text>
              <Text style={styles.col}>{paymentDtls?.fromFyear}</Text>
              <Text style={styles.col}>{paymentDtls?.uptoQtr}</Text>
              <Text style={styles.col}>{paymentDtls?.uptoFyear}</Text>
              <Text style={[styles.col, { flex: 1 }]}>
                {paymentDtls?.rwhTax}
              </Text>
            </View>

            {/* JSK Rebate (if exists) */}
            {paymentDtls?.fineRebate?.length > 0 &&
              paymentDtls.fineRebate.map((item, index) => (
                <View key={index} style={styles.tableRowModal}>
                  <Text style={[styles.col, { flex: 2 }]}>{item.headName}</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={[styles.col, { flex: 1 }]}>{item.amount}</Text>
                </View>
              ))}

            {/* Totals */}
            <View style={styles.tableRowModal}>
              <Text style={[styles.col, { flex: 5, fontWeight: 'bold' }]}>
                Total Amount
              </Text>
              <Text style={[styles.col, { flex: 1 }]}>
                {paymentDtls?.amount}
              </Text>
            </View>
            <View style={styles.tableRowModal}>
              <Text style={[styles.col, { flex: 5, fontWeight: 'bold' }]}>
                Total Paid Amount
              </Text>
              <Text style={[styles.col, { flex: 1 }]}>
                {paymentDtls?.amount}
              </Text>
            </View>
          </View>

          {/* Footer with QR & Contact */}
          <View style={styles.footerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.qrBox} />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.footerText}>Visit:</Text>
              <Text style={styles.footerText}>Call: 8002158818</Text>
              <Text style={styles.footerText}>In collaboration with</Text>
              <Text style={styles.footerText}>Uinfo Technology PVT LTD.</Text>
            </View>
          </View>

          <Text style={styles.generatedNote}>
            ** This is a computer-generated receipt and does not require
            signature. **
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
      <DocumentViewModal
        visible={docModalVisible}
        onClose={() => setDocModalVisible(false)}
        uploadedDocs={uploadedDocs}
        onDocumentPress={doc => {
          setSelectedDoc(doc);
          setSelectedImageUri(doc.docPath);
          setImageLoading(true);
          setImageModalVisible(true);
        }}
      />

      {/* Full-screen Image/PDF Modal */}
      <ImageViewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        imageUri={selectedImageUri}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />
    </ScrollView>
  );
};

export default SafDueDetails;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.background,
    backgroundColor: Colors.headignColor,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
  },
  rowTable: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  labelFixed: {
    fontSize: 13,
    marginVertical: 2,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  value: {
    flex: 1,
    color: '#222',
  },
  headerRow: {
    backgroundColor: Colors.textSecondary,
  },
  cell: {
    minWidth: 70,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: 'center',
    fontSize: 10,
    color: '#333',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  containerdue: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    margin: 12,
    elevation: 4,
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexWrap: 'nowrap',
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
  },

  tableCell: {
    width: 120,
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
    fontSize: 10,
    color: '#000',
    flex: 1,
  },

  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d2a7e',
    marginBottom: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    fontSize: 30,
  },
  corpName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptType: {
    alignSelf: 'center',
    marginVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 6,
  },
  tableRowModal: {
    flexDirection: 'row',
    padding: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  col: {
    flex: 1,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  qrBox: {
    width: 90,
    height: 90,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 13,
    marginBottom: 2,
  },
  generatedNote: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  docModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docModalContent: {
    backgroundColor: '#fff',
    width: '95%',
    maxHeight: '85%',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  docModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  docTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  docTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  docCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  docCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  docFileLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  docCloseButton: {
    backgroundColor: '#007bff',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  docCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  actionBtn: {
    width: 85,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 15,
    maxHeight: '95%',
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#ffffffff',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    width: '60%',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
    width: '50%',
    display: 'flex',
    textAlign: 'right',
  },
  penaltyBox: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    marginBottom: 10,
  },
  rebateBox: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    marginBottom: 10,
  },
  totalPayableBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff3cd',
    padding: 10,
    marginTop: 10,
  },
  totalPayableLabel: {
    fontWeight: 'bold',
  },
  totalPayableAmount: {
    fontWeight: 'bold',
    color: '#d9534f',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    minWidth: 1200,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#003366',
  },
  tableSubHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableFooter: {
    backgroundColor: 'white',
  },
  payNowButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  payNowButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeFullScreenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  fullScreenScrollView: {
    flex: 1,
    width: '100%',
  },
  fullScreenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 100,
  },
});
