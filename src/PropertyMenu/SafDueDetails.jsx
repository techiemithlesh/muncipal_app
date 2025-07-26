import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import React from 'react';
import Header from '../Screen/Header';
import Colors from '../Constants/Colors';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import axios from 'axios';
const SafDueDetails = ({ route }) => {
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

  const [docModalVisible, setDocModalVisible] = useState(false);

  const documentview = async id => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-uploaded-doc-list`,
        { id }, // Send the document/property ID in body
        { headers },
      );

      const uploadedDocs = response.data?.data;

      console.log('Uploaded Document List:', uploadedDocs);

      // Do something with the data
      // For example: open a modal, navigate to another screen, or set state
      setUploadedDocs(uploadedDocs); // <-- if using useState
      setDocModalVisible(true);
    } catch (error) {
      console.error(
        'Error fetching uploaded documents:',
        error?.response || error,
      );
      Alert.alert('Error', 'Failed to fetch document list.');
    }
  };

  const handleViewReceipt = async tranDtlId => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (!token) {
        console.warn('Token not found');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/payment-receipt`,
        { id: tranDtlId },
        { headers },
      );

      setPaynemtDtls(response.data?.data);
      setPaynemtDtls(response.data?.data);
      setModalVisible(true);

      // ✅ Print the data
      console.log('Payment Receipt Response:', response.data?.data);

      // Optional: set in state if you want to display it in modal/screen
      // setReceiptData(response.data?.data);
    } catch (error) {
      console.error(
        'Error fetching payment receipt:',
        error?.response || error,
      );
    }
  };

  useEffect(() => {
    const fetchSafDetails = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        if (!token) {
          console.warn('Token not found. Aborting request.');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Step 1: Fetch SAF Detail
        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-dtl`,
          { id },
          { headers },
        );

        const safData = response.data?.data;
        const tranDtlId = safData?.tranDtls?.[0]?.id; // ✅ Extract tranDtlId safely

        // Step 2: Fetch Payment Receipt using tranDtlId
        if (tranDtlId) {
          const res = await axios.post(
            `${BASE_URL}/api/property/payment-receipt`,
            { id: tranDtlId }, // ✅ Pass tranDtls id here
            { headers },
          );

          console.log('Payment Detail:', res.data?.data);
        } else {
          console.warn('tranDtls ID not found. Skipping payment receipt call.');
        }

        // ✅ Logging
        console.log('SAF Detail:', safData);
        console.log('Owner Detail:', safData?.owners?.[0]);
        console.log('Floor Detail:', safData?.floors?.[0]);
        console.log('Tax Detail:', safData?.tranDtls?.[0]);
        console.log('Tax tax:', safData?.taxDtl?.[0]);
        console.log('Tax memoDtls:', safData?.memoDtls?.[0]);

        console.log('Tax tcVerifications:', safData?.tcVerifications?.[0]);

        // ✅ Set state
        setOwnerList(safData?.owners || []);
        setFloorData(safData?.floors || []);
        setTaxDetails(safData?.tranDtls || []);
        setTranDtls(safData?.tranDtls || []);
        setMemoDtls(safData?.memoDtls || []);
        setTcVerfivication(safData?.tcVerifications || []);

        setSafData(safData);
      } catch (error) {
        console.error('Error fetching SAF details:', error?.response || error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSafDetails(); // ✅ Safe check
  }, [id]);

  return (
    <ScrollView style={styles.scroll}>
      <Header />
      <View style={styles.container}>
        {/* Basic Details Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Basic Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>appStatus:</Text>
            <Text style={styles.value}>{safData?.appStatus ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>safNo :</Text>
            <Text style={styles.value}>{safData?.safNo ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Apply Date:</Text>
            <Text style={styles.value}>{safData?.applyDate ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ward No:</Text>
            <Text style={styles.value}>{safData?.wardNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>New Ward No:</Text>
            <Text style={styles.value}>{safData?.newWardNo ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Assessment Type:</Text>
            <Text style={styles.value}>{safData?.assessmentType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Property Type:</Text>
            <Text style={styles.value}>{safData?.propertyType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ownership Type:</Text>
            <Text style={styles.value}>{safData?.ownershipType ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Road Width (ft):</Text>
            <Text style={styles.value}>{safData?.roadWidth ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Area of Plot (sq. ft):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Rainwater Harvesting:</Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Zone:</Text>
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
            <Text style={styles.label}>Electricity K. No:</Text>
            <Text style={styles.value}>
              {safData?.electConsumerNo ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>ACC No.:</Text>
            <Text style={styles.value}>{safData?.electAccNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>BIND/BOOK No.:</Text>
            <Text style={styles.value}>
              {safData?.electBindBookNo ? safData.electBindBookNo : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Electricity Consumer Category:</Text>
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
            <Text style={styles.label}>Building Plan Approval No:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalNo
                ? safData.buildingPlanApprovalNo
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Building Plan Approval Date:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalDate
                ? safData.buildingPlanApprovalDate
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Water Consumer No:</Text>
            <Text style={styles.value}>
              {safData?.waterConnNo ? safData.waterConnNo : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Water Connection Date:</Text>
            <Text style={styles.value}>
              {safData?.waterConnDate ? safData.waterConnDate : 'NA'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Khata No:</Text>
            <Text style={styles.value}>{safData?.khataNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Village/Mauja Name:</Text>
            <Text style={styles.value}>
              {safData?.villageMaujaName ?? 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Area of Plot (in Decimal):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot ?? 'NA'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Address</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{safData?.propCity ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pin:</Text>
            <Text style={styles.value}>{safData?.propPinCode ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{safData?.propState ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>{safData?.propDist ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
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
            <Text style={styles.label}>
              Does Property Have Mobile Tower(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isMobileTower ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Date of Installation of Mobile Tower:
            </Text>
            <Text style={styles.value}>
              {safData?.towerInstallationDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Total Area Covered by Mobile Tower & its Equipments (Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.towerArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Does Property Have Hoarding Board(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isHoardingBoard ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Date of Installation of Hoarding Board(s):
            </Text>
            <Text style={styles.value}>
              {safData?.hoardingInstallationDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Total Area of Wall / Roof / Land (in Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.hoardingArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Is Property a Petrol Pump?</Text>
            <Text style={styles.value}>
              {safData?.isPetrolPump ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Completion Date of Petrol Pump:</Text>
            <Text style={styles.value}>
              {safData?.petrolPumpCompletionDate || 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Underground Storage Area (in Sq. Ft.):
            </Text>
            <Text style={styles.value}>{safData?.underGroundArea || 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Rainwater Harvesting Provision?</Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {taxDetails.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Tax Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>SL</Text>
                  <Text style={styles.tableCell}>ARV</Text>
                  <Text style={styles.tableCell}>Effect From</Text>
                  <Text style={styles.tableCell}>Holding Tax</Text>
                  <Text style={styles.tableCell}>Water Tax</Text>
                  <Text style={styles.tableCell}>Conservancy</Text>
                  <Text style={styles.tableCell}>Edu. Cess</Text>
                  <Text style={styles.tableCell}>RWH Penalty</Text>
                  <Text style={styles.tableCell}>Quarterly Tax</Text>
                </View>

                {/* Table Body */}
                {taxDetails.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item?.arv ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item?.fromQtr ?? 'NA'} / {item?.fromFyear ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.holdingTax ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.waterTax ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.conservancyTax ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.educationCess ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.rwhPenalty ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.quarterlyTax ?? 'NA'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {transDtls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Payment Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>SL</Text>
                  <Text style={styles.tableCell}>Transaction No</Text>
                  <Text style={styles.tableCell}>Payment Mode</Text>
                  <Text style={styles.tableCell}>Date</Text>
                  <Text style={styles.tableCell}>From Qtr / Year</Text>
                  <Text style={styles.tableCell}>Upto Qtr / Year</Text>
                  <Text style={styles.tableCell}>Amount</Text>
                  <Text style={styles.tableCell}>View</Text>
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
                    {/* View Button (can be TouchableOpacity if needed) */}

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

        {memoDtls && (
          <View style={styles.card}>
            <Text style={styles.heading}>Memo Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>SL</Text>
                  <Text style={styles.tableCell}>Memo No</Text>
                  <Text style={styles.tableCell}>Memo Type</Text>
                  <Text style={styles.tableCell}>Holding No</Text>
                  <Text style={styles.tableCell}>Quarter</Text>
                  <Text style={styles.tableCell}>Financial Year</Text>
                  <Text style={styles.tableCell}>Quarterly Tax</Text>
                  <Text style={styles.tableCell}>Created At</Text>
                  <Text style={styles.tableCell}>User Name</Text>
                </View>

                {/* Table Row */}
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>1</Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.memoNo ?? 'NA'}
                  </Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.memoType ?? 'NA'}
                  </Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.holdingNo ?? 'NA'}
                  </Text>
                  <Text style={styles.tableCell}>{memoDtls.qtr ?? 'NA'}</Text>
                  <Text style={styles.tableCell}>{memoDtls.fyear ?? 'NA'}</Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.quarterlyTax ?? 'NA'}
                  </Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.createdAt
                      ? new Date(memoDtls.createdAt).toLocaleDateString('en-GB')
                      : 'NA'}
                  </Text>
                  <Text style={styles.tableCell}>
                    {memoDtls.userName ?? 'NA'}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => documentview(id)}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>👁️ View</Text>
      </TouchableOpacity>

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
              <Text style={styles.label}>
                Receipt No.:{' '}
                <Text style={styles.bold}>{paymentDtls?.tranNo}</Text>
              </Text>
              <Text style={styles.label}>
                Department:{' '}
                <Text style={styles.bold}>{paymentDtls?.department}</Text>
              </Text>
              <Text style={styles.label}>
                Account:{' '}
                <Text style={styles.bold}>
                  {paymentDtls?.accountDescription}
                </Text>
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Date: <Text style={styles.bold}>{paymentDtls?.tranDate}</Text>
              </Text>
              <Text style={styles.label}>
                Ward No: <Text style={styles.bold}>{paymentDtls?.wardNo}</Text>
              </Text>
              <Text style={styles.label}>
                New Ward No:{' '}
                <Text style={styles.bold}>{paymentDtls?.newWardNo}</Text>
              </Text>
              <Text style={styles.label}>
                SAF No: <Text style={styles.bold}>{paymentDtls?.safNo}</Text>
              </Text>
            </View>
          </View>

          {/* Owner Info */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Received From:{' '}
              <Text style={styles.bold}>{paymentDtls?.ownerName}</Text>
            </Text>
            <Text style={styles.label}>
              Address: <Text style={styles.bold}>{paymentDtls?.address}</Text>
            </Text>
            <Text style={styles.label}>
              A Sum of Rs.:{' '}
              <Text style={styles.bold}>{paymentDtls?.amount}</Text>
            </Text>
            <Text style={styles.label}>
              (In words):{' '}
              <Text style={styles.bold}>{paymentDtls?.amountInWords}</Text>
            </Text>
            <Text style={styles.label}>
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
            <View style={styles.tableRow}>
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
            <View style={styles.tableRow}>
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
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.col, { flex: 2 }]}>{item.headName}</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={styles.col}>-</Text>
                  <Text style={[styles.col, { flex: 1 }]}>{item.amount}</Text>
                </View>
              ))}

            {/* Totals */}
            <View style={styles.tableRow}>
              <Text style={[styles.col, { flex: 5, fontWeight: 'bold' }]}>
                Total Amount
              </Text>
              <Text style={[styles.col, { flex: 1 }]}>
                {paymentDtls?.amount}
              </Text>
            </View>
            <View style={styles.tableRow}>
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
      <Modal
        visible={docModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDocModalVisible(false)}
      >
        <View style={styles.docModalContainer}>
          <View style={styles.docModalContent}>
            <Text style={styles.docModalTitle}>📄 Document View</Text>

            <View style={styles.docTableHeader}>
              <Text style={styles.docCellHeader}>#</Text>
              <Text style={styles.docCellHeader}>Document Name</Text>
              <Text style={styles.docCellHeader}>File</Text>
              <Text style={styles.docCellHeader}>Status</Text>
            </View>

            <ScrollView>
              {uploadedDocs?.map((doc, index) => (
                <View key={doc.id} style={styles.docTableRow}>
                  <Text style={styles.docCell}>{index + 1}</Text>
                  <Text style={styles.docCell}>{doc.docName}</Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(doc.docPath)}
                  >
                    <Text style={[styles.docCell, styles.docFileLink]}>
                      View File
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.docCell}>
                    {doc.verifiedStatus === 1 ? 'Pending' : 'Verified'}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.docCloseButton}
              onPress={() => setDocModalVisible(false)}
            >
              <Text style={styles.docCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  label: {
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
  },

  tableCell: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 12,
  },

  headerText: {
    fontWeight: 'bold',
  },

  tableCell: {
    minWidth: 100, // or 120
    padding: 6,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
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
  tableRow: {
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
  viewButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: Colors.background,
    backgroundColor: Colors.borderColor,
    fontSize: 13,
    textDecorationLine: 'underline',
    padding: 20,
  },
});
