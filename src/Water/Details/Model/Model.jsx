// TradeModels.jsx
import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import PrintButton from '../../../Components/PrintButton';
import Toast from 'react-native-toast-message';
import { showToast } from '../../../utils/toast';
import { toastConfig } from '../../../utils/toastConfig';
import { getToken } from '../../../utils/auth';
import { WATER_API_ROUTES } from '../../../api/apiRoutes';
import axios from 'axios';
// import Form from 'react-bootstrap/Form';
// 1. View Trade License Modal
export const ViewTradeLicenseModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>
            Municipal Trade Licence Approval Certificate
          </Text>

          <Text style={styles.mainTitle}>Municipal License</Text>

          <Text style={styles.subTitle}>RANCHI MUNICIPAL CORPORATION</Text>
          <Text style={styles.tinyText}>
            (This certificate relates to Section 455(J) Jharkhand Municipal Act
            2011)
          </Text>

          {[
            [
              'Municipal Trade Licence No:',
              tradeDetails?.licenseNo || 'RAN55020319162233',
            ],
            ['Issue Date:', tradeDetails?.issueDate || '03-02-2019'],
            ['Validity:', tradeDetails?.validUpto || '23-01-2020'],
            [
              'Owner/Entity Name:',
              tradeDetails?.firmName || 'GOPAL GENERAL STORE',
            ],
            [
              'Owner Name:',
              tradeDetails?.owners?.[0]?.ownerName || 'ARVIND KUMAR',
            ],
            ['Nature of Entity:', tradeDetails?.firmType || 'GENERAL STORE'],
            [
              'Nature of Business:',
              tradeDetails?.natureOfBusiness ||
                'GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PARCHING',
            ],
            ['Business Code:', tradeDetails?.businessCode || '(83)'],
            ['Date of Application:', tradeDetails?.applyDate || '24-01-2019'],
            ['Ward No.:', tradeDetails?.wardNo || '55'],
            ['Holding No.:', tradeDetails?.holdingNo || 'N/A'],
            [
              'Street Address:',
              tradeDetails?.address ||
                'NEW NAGAR BANDHGARI DIPATOLI RANCHI834001',
            ],
            [
              'Application No.:',
              tradeDetails?.applicationNo || '162233240119104140',
            ],
            [
              'Mobile No.:',
              tradeDetails?.owners?.[0]?.mobileNo || '9709226782',
            ],
          ].map(([label, value], index) => (
            <View style={styles.rowContainer} key={index}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}

          <Text style={styles.declaration}>
            This is to declare that{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.firmName || 'GOPAL GENERAL STORE'}
            </Text>{' '}
            having application number{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.applicationNo || '162233240119104140'}
            </Text>{' '}
            has been successfully registered with satisfactory compliance of
            registration criteria.
          </Text>

          <View style={{ marginTop: 10 }}>
            {[
              '1. The business will run according to the license issued.',
              '2. Prior permission from the local body is necessary if the business is changed.',
              '3. Information to the local body is necessary for extension of the area.',
              '4. Prior intimation to local body regarding winding off business is necessary.',
              '5. Renewal is necessary one month before expiry.',
              '6. Penalty may be levied under Section 459.',
              '7. Illegal parking in front of the firm is non-permissible.',
              '8. Dustbins must be available at premises and adhere to waste disposal rules.',
              '9. SWM & Plastic Waste Management Rules 2016 shall be adhered to.',
            ].map((term, i) => (
              <Text style={styles.term} key={i}>
                {term}
              </Text>
            ))}
          </View>

          <Text style={styles.note}>
            Note: This is a computer-generated license. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export const ViewDemandModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.mainTitle}>View Demand</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>#</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>
              Charge Type
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>
              Connection Fee
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Penalty</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Total</Text>
          </View>

          {/* Table Row (from demandList[0]) */}
          {tradeDetails?.demandList?.map((item, index) => (
            <View style={styles.tableRow} key={item.id || index}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {item.chargeFor}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item.connFee}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item.penalty}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.amount}</Text>
            </View>
          ))}

          {/* Main Demand */}
          <Text style={styles.sectionTitle}>Main Demand</Text>
          <View style={styles.demandBox}>
            <Text style={styles.demandText}>
              Demand: {tradeDetails?.demandAmount || '0.00'}
            </Text>
            <Text style={styles.penaltyText}>
              Penalty: {tradeDetails?.realizationPenalty || '0.00'} [
              {tradeDetails?.description}]
            </Text>
          </View>

          {/* Total */}
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>
              Total Payable Amount: {tradeDetails?.payableAmount || '0.00'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const { width, height } = Dimensions.get('window');
const downloadPDF = async url => {
  try {
    const { fs } = RNBlobUtil;
    const dir = fs.dirs.DownloadDir; // Downloads folder
    const path = `${dir}/document_${Date.now()}.pdf`;

    const res = await RNBlobUtil.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading PDF...',
      },
    }).fetch('GET', url);

    showToast('success', '📄 Success', 'PDF Downloaded Successfully!');
    console.log('PDF saved to:', res.path());
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', 'Download failed!');
  }
};

export const DocumentModal = ({ visible, onClose, documents }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const openPreview = index => {
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const renderPreviewItem = ({ item }) => {
    const isPDF = item.docPath?.toLowerCase().endsWith('.pdf');

    return (
      <View
        style={{
          width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPDF ? (
          <View style={{ alignItems: 'center' }}>
            {/* PDF Preview via Google Docs viewer */}
            <WebView
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                  item.docPath,
                )}`,
              }}
              style={{
                width: width * 0.95,
                height: height * 0.75,
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            />

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => downloadPDF(item.docPath)}
            >
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
            <View style={{ padding: 20 }}>
              <Text style={{}}>Trade Documents</Text>
              <PrintButton fileUrl={item.docPath} title="Print" />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.docPath }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        {/* Document List Modal */}
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Uploaded Documents</Text>

            <View style={styles.sectionContainer}>
              {documents?.length > 0 ? (
                documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.documentName}>
                        {doc.docName} ({doc.ownerName || 'N/A'})
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded By: {doc.uploadedBy || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Owner: {doc.ownerName || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded At: {doc.createdAt?.split('T')[0] || 'N/A'}
                      </Text>
                      {doc.verifiedAt && (
                        <Text style={styles.documentDate}>
                          Verified At: {doc.verifiedAt}
                        </Text>
                      )}

                      <Text
                        style={[
                          styles.documentStatus,
                          {
                            color:
                              doc.verifiedStatus === 1
                                ? 'green'
                                : doc.verifiedStatus === 2
                                ? 'red'
                                : 'orange',
                          },
                        ]}
                      >
                        {doc.verifiedStatus === 1
                          ? 'Verified'
                          : doc.verifiedStatus === 2
                          ? 'Rejected'
                          : 'Pending'}
                      </Text>

                      {/* View Button */}
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => openPreview(index)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>

                    {/* <View style={{ alignItems: 'flex-end' }}></View> */}
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#666' }}>
                  No Documents Uploaded
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View style={styles.previewOverlay}>
            <TouchableOpacity
              style={styles.previewCloseBtn}
              onPress={() => setPreviewVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={documents}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentIndex}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPreviewItem}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 300);
              }}
            />
            {/* Toast inside modal to ensure it appears above modal content */}
            <Toast config={toastConfig} position="top" topOffset={60} />
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export const RemarksModal = ({
  visible,
  onClose,
  remarks,
  setRemarks,
  onSubmit,
}) => {
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (!remarks.trim()) {
      setError('Please enter remarks');
    }
  };

  const handleFocus = () => {
    setError('');
  };

  const handleSend = async () => {
    if (!remarks.trim()) {
      setError('Please enter remarks');
      return;
    }

    const payload = {
      id: id, // Make sure `id` is passed as a prop
      remarks: remarks,
      status: 'FORWARD',
    };

    try {
      const token = await getToken();
      console.log('Sending payload:', payload);

      const response = await axios.post(
        WATER_API_ROUTES.WATER_REMARKS_API,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Remarks submitted:', response.data);

      setRemarks('');
      onClose(); // Instead of setShowModal(false)
      onSubmit(); // Optional, after success
    } catch (error) {
      console.error(
        '❌ Error submitting remarks:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to submit remarks');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Enter Remarks</Text>

          <TextInput
            style={[styles.textArea, error ? styles.inputError : null]}
            multiline
            numberOfLines={4}
            placeholder="Enter your remarks here..."
            value={remarks}
            onChangeText={text => {
              setRemarks(text);
              if (text.trim()) {
                setError(''); // Clear error as soon as user types something valid
              }
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
// 5. Payment Receipt Modal

export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          {/* Title */}
          <Text style={styles.mainTitle}>Payment Receipt</Text>
          <Text style={styles.modalTitle}>
            {receiptData?.ulbDtl?.ulbName || 'Municipal Corporation'}
          </Text>

          <View style={styles.receiptContainer}>
            <Text style={styles.receiptTitle}>
              Water Connection Charge Payment Receipt
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receipt No:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.tranNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.tranDate || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ward No:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.wardNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>New Ward No:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.newWardNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Received From:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.ownerName || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.address || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Amount:</Text>
              <Text style={styles.infoValue}>
                ₹ {receiptData?.amount || '0.00'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>In Words:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.amountInWords || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Towards:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.accountDescription || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Via:</Text>
              <Text style={styles.infoValue}>
                {receiptData?.paymentMode || 'Cash'}
              </Text>
            </View>

            {/* Table Section */}
            <View style={styles.receiptTable}>
              <View style={styles.receiptTableHeader}>
                <Text style={styles.receiptTableHeaderText}>Description</Text>
                <Text style={styles.receiptTableHeaderText}>Period</Text>
                <Text style={styles.receiptTableHeaderText}>Amount</Text>
              </View>
              {(receiptData?.charges || []).map((item, index) => (
                <View style={styles.receiptTableRow} key={index}>
                  <Text style={styles.receiptTableCell}>
                    {item.description}
                  </Text>
                  <Text style={styles.receiptTableCell}>{item.period}</Text>
                  <Text style={styles.receiptTableCell}>₹ {item.amount}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.receiptTotal}>
              Total Paid Amount: ₹ {receiptData?.amount || '0.00'}
            </Text>

            {/* QR Code */}
            {receiptData?.qrImage && (
              <View style={styles.qrCodeContainer}>
                <Image
                  source={{ uri: receiptData.qrImage }}
                  style={{ width: 80, height: 80 }}
                />
              </View>
            )}

            <Text style={styles.receiptNote}>
              ** This is a computer-generated receipt and does not require
              signature. **
            </Text>
          </View>
          {/* Download / Print Button */}
          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Download / Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export const PaymentModal = ({
  visible,
  onClose,
  tradeDetails,
  id,
  fetchAllData,
  onShowReceipt,
  onPaymentSuccess,
}) => {
  const [payNowModalVisible, setPayNowModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [amount, setAmount] = useState(tradeDetails?.payableAmount || '0.00');

  // Mock dropdown data
  const paymentTypeData = [
    { label: 'Full Payment', value: 'full' },
    { label: 'Part Payment', value: 'part' },
  ];
  const paymentModeData = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'DD', value: 'DD' },
    { label: 'Online', value: 'Online' },
  ];

  const [updatedTradeDetails, setUpdatedTradeDetails] = useState(tradeDetails);

  const processPayment = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return { success: false };
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

      const response = await axios.post(
        WATER_API_ROUTES.PAY_DEMAND,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Payment Success:', response.data.status);
      if (response.data.status === true) {
        console.log('Payment Success:', response.data.data?.tranId);

        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );

        fetchAllData();

        if (response.data.status === true) {
          setUpdatedTradeDetails(prev => ({
            ...prev,
            demandAmount: 0,
            payableAmount: 0,
            realizationPenalty: 0,
            demandList: prev?.demandList?.map(i => ({
              ...i,
              connFee: 0,
              penalty: 0,
              amount: 0,
            })),
          }));
        }
        if (typeof onShowReceipt === 'function') {
          console.log('Triggering receipt modal with:', response.data.data);
          onShowReceipt(response.data.data);
        }

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

  return (
    <>
      {/* Main Demand Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.mainTitle}>View Demand</Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>#</Text>
                <Text style={[styles.tableHeaderText, { flex: 3 }]}>
                  Charge Type
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Connection Fee
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Penalty
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Total</Text>
              </View>

              {/* Table Row (from demandList[0]) */}
              {tradeDetails?.demandList?.map((item, index) => (
                <View style={styles.tableRow} key={item.id || index}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 3 }]}>
                    {item.chargeFor}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.connFee}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.penalty}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.amount}
                  </Text>
                </View>
              ))}

              {/* Main Demand */}
              <Text style={styles.sectionTitle}>Main Demand</Text>
              <View style={styles.demandBox}>
                <Text style={styles.demandText}>
                  Demand: {tradeDetails?.demandAmount || '0.00'}
                </Text>
                <Text style={styles.penaltyText}>
                  Penalty: {tradeDetails?.realizationPenalty || '0.00'} [
                  {tradeDetails?.description}]
                </Text>
              </View>
              {/* Total */}
              <View style={styles.totalBox}>
                <Text style={styles.totalText}>
                  Total Payable Amount: {tradeDetails?.payableAmount || '0.00'}
                </Text>
              </View>
              {/* Pay Now Button */}
              <View style={styles.totalBox}>
                <TouchableOpacity
                  onPress={() => setPayNowModalVisible(true)}
                  style={styles.confirmButton}
                >
                  <Text>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pay Now Modal */}
      <Modal
        visible={payNowModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPayNowModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle}>💳 Make Payment</Text>

            {/* Payment Type Dropdown */}
            <Text>Payment Type *</Text>
            <Dropdown
              style={styles.dropdown}
              data={paymentTypeData}
              labelField="label"
              valueField="value"
              placeholder="Select Payment Type"
              value={paymentType}
              onChange={item => setPaymentType(item.value)}
            />

            {/* Payment Mode Dropdown */}
            <Text>Payment Mode *</Text>
            <Dropdown
              style={styles.dropdown}
              data={paymentModeData}
              labelField="label"
              valueField="value"
              placeholder="Select Payment Mode"
              value={paymentMode}
              onChange={item => setPaymentMode(item.value)}
            />

            {/* Extra fields if not Cash */}
            {paymentMode && paymentMode !== 'Cash' && (
              <>
                <Text>Cheque/DD/Ref No *</Text>
                <TextInput
                  style={styles.input}
                  value={refNo}
                  onChangeText={setRefNo}
                />

                <Text>Cheque/DD Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text>
                    {chequeDate
                      ? chequeDate.toLocaleDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={chequeDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setChequeDate(selectedDate);
                    }}
                  />
                )}

                <Text>Bank Name *</Text>
                <TextInput
                  style={styles.input}
                  value={bankName}
                  onChangeText={setBankName}
                />

                <Text>Branch Name *</Text>
                <TextInput
                  style={styles.input}
                  value={branchName}
                  onChangeText={setBranchName}
                />
              </>
            )}

            {/* Amount */}
            <Text>Amount *</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              editable={false}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setPayNowModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  if (!paymentType || !paymentMode) {
                    Alert.alert(
                      'Validation Error',
                      'Please fill required fields',
                    );
                    return;
                  }

                  if (
                    paymentMode !== 'Cash' &&
                    (!refNo || !bankName || !branchName)
                  ) {
                    Alert.alert(
                      'Validation Error',
                      'Please fill payment details',
                    );
                    return;
                  }

                  setPayNowModalVisible(false);
                  const paymentResult = await processPayment();

                  if (paymentResult.success) {
                    console.log('Payment Done:', paymentResult.tranId);
                    // You can call viewdemand(id) or show receipt here
                  }
                }}
                style={styles.confirmButton}
              >
                <Text>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    height: 100,
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6c757d',
    borderRadius: 6,
  },
  cancelText: {
    color: 'white',
    fontWeight: '600',
  },
  sendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  sendText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },

  // Close
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 6,
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Titles
  mainTitle: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 10,
    color: '#333',
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 13,
    color: '#000',
  },

  // Demand box
  demandBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  demandText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  penaltyText: {
    fontSize: 13,
    color: 'red',
    marginBottom: 4,
  },
  discountText: {
    fontSize: 13,
    color: 'green',
  },

  // Total box
  totalBox: {
    backgroundColor: '#FEF08A',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent1: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receiptContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    flex: 1.2,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
  },
  infoValue: {
    flex: 2,
    fontSize: 13,
    color: '#000',
  },
  receiptTable: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },
  receiptTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  receiptTableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
  },
  receiptTableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
  },
  receiptTableCell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: '#000',
  },
  receiptTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    color: '#000',
  },
  receiptNote: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 16,
  },

  documentItem: {
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    marginTop: 10,

    // iOS shadow
    shadowColor: '#3b2525ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },

  viewBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    width: 80,
    alignItems: 'center',
  },
  viewBtnText: { color: '#fff', fontWeight: 'bold' },
});
