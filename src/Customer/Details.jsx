import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import Colors from '../Constants/Colors';
import { CUSTOMER_API } from '../api/apiRoutes';
import axios from 'axios';
import HeaderNavigation from '../Components/HeaderNavigation';
import {
  ViewDemandModal,
  ViewTradeLicenseModal,
  PaymentModal,
  DocumentModal,
  PaymentReceiptModal,
} from './Model/CustomerModel';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/auth';
import { WORK_FLOW_PERMISSION, API_ROUTES } from '../api/apiRoutes';
import GenerateDemandModal from './Model/GenerateDemandModal';

const Details = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showTradeLicenseModal, setShowTradeLicenseModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [receiptData, setTradPaymentRecipt] = useState(null);
  const [customerDue, setCustomerDue] = useState(null);

  const [tradeDetails, setTradeDetails] = useState(null);
  const [paymentDtl, setPaymentDtl] = useState([]);

  const [workflowData, setWorkflowData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [levelRemarks, setLevelRemarks] = useState([]);
  const [connectionDtl, setConnectionDtl] = useState('');

  const [loading, setLoading] = useState(false);
  const [customerDeuDetails, setCustomerDueDetails] = useState('');
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [receiptDatas, setReceiptData] = useState(null);
  const [connectionDetails, setConnectionDetails] = useState({});

  const id = route?.params?.id;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const token = await getToken();

        const tradeRes = await axios.post(
          CUSTOMER_API.CUSTOMER_DETAILS_API,
          { id: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setConnectionDetails(tradeRes.data.data.connectionDtl || {});
        const paymentIds = paymentDtl.map(item => item.id);

        if (tradeRes?.data?.status && tradeRes.data.data) {
          setTradeDetails(tradeRes.data.data);
          setPaymentDtl(tradeRes.data.data.tranDtls || []);

          setLevelRemarks(tradeRes.data.data.levelRemarks || []);
          setConnectionDtl(tradeRes.data.data.connectionDtl);
        }

        const workflowId = tradeRes?.data?.data?.workflowId || 0;

        const [customerDue, workflowRes, paymentRes, receiptRes, documentRes] =
          await Promise.all([
            axios.post(
              CUSTOMER_API.CUSTOMER_DUE_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WORK_FLOW_PERMISSION,
              { wfId: workflowId },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            // axios.post(
            //   API_ROUTES.TRADE_PAYMENT,
            //   {
            //     id,
            //     paymentType: 'FULL',
            //     paymentMode: 'CASH',
            //     chequeNo: '',
            //     chequeDate: '',
            //     bankName: '',
            //     branchName: '',
            //   },
            //   { headers: { Authorization: `Bearer ${token}` } },
            // ),
            axios.post(
              CUSTOMER_API.CUSTOMER_PAYMENT_RECIPT_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              CUSTOMER_API.CUSTOMER_DETAILS_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ]);
        console.log('Customer Deatails', customerDue.data.data);

        if (customerDue?.data?.status)
          setCustomerDueDetails(customerDue.data.data);
        if (customerDue?.data?.status)
          setCustomerDue(customerDue.data.data.demandList);
        if (workflowRes?.data?.status) setWorkflowData(workflowRes.data.data);
        if (receiptRes?.data?.status)
          setTradPaymentRecipt(receiptRes.data.data);
        if (documentRes?.data?.status) setDocuments(documentRes.data.data);
      } catch (err) {
        console.log(
          '❌ Error fetching data:',
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleViewReceipt = async id => {
    setSelectedReceiptId(id);
    setShowReceipt(true);

    try {
      const response = await axios.post(
        CUSTOMER_API.CUSTOMER_PAYMENT_RECIPT_API,
        { id },
      );
      setReceiptData(response.data); // Save API response
      console.log('Receipt Data:', response.data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your applied application no.{' '}
            <Text style={styles.appId}>{tradeDetails?.consumerNo}</Text>. You
            can use this for future reference.
          </Text>

          <Text style={styles.statusText}>
            Current Status:{' '}
            <Text
              style={
                tradeDetails?.appStatus?.toLowerCase().includes('expired')
                  ? styles.expired
                  : styles.active
              }
            >
              {tradeDetails?.appStatus || 'N/A'}
            </Text>
          </Text>
        </View>
        {/* Basic Details */}
        <Section title="Basic Details">
          <View style={styles.customerCard}>
            <DetailRow
              label="Consumer No"
              value={tradeDetails?.consumerNo || 'N/A'}
            />
            <DetailRow
              label="Consumer Date"
              value={
                tradeDetails?.createdAt
                  ? tradeDetails.createdAt.slice(0, 10)
                  : 'N/A'
              }
            />
            <DetailRow label="Ward No" value={tradeDetails?.wardNo || 'N/A'} />
            <DetailRow
              label="New Ward No"
              value={tradeDetails?.newWardNo || 'N/A'}
            />
            <DetailRow
              label="Property Type"
              value={tradeDetails?.propertyType || 'N/A'}
            />
            <DetailRow
              label="Ownership Type"
              value={tradeDetails?.ownershipType || 'N/A'}
            />
            <DetailRow
              label="Connection Through"
              value={tradeDetails?.connectionThrough || 'N/A'}
            />
            <DetailRow
              label="Pipeline Type"
              value={tradeDetails?.pipelineType || 'N/A'}
            />
            <DetailRow
              label="Area in Sqft"
              value={tradeDetails?.areaSqft || 'N/A'}
            />
            <DetailRow label="Address" value={tradeDetails?.address || 'N/A'} />
            <DetailRow
              label="Landmark"
              value={tradeDetails?.landmark || 'N/A'}
            />
            <DetailRow
              label="Pin Code"
              value={tradeDetails?.pinCode || 'N/A'}
            />
          </View>
        </Section>

        {/* Owner Details */}
        <Section title="Owner Details">
          <View style={styles.ownerHeader}>
            <Text style={styles.ownerCol}>Owner Name</Text>
            <Text style={styles.ownerCol}>Guardian Name</Text>
            <Text style={styles.ownerCol}>Mobile No</Text>
            <Text style={styles.ownerCol}>Email Id</Text>
          </View>
          {tradeDetails?.owners?.map((owner, index) => (
            <View
              key={owner.id || index}
              style={[
                styles.ownerRow,
                { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
              ]}
            >
              <Text style={styles.ownerCol}>{owner.ownerName}</Text>
              <Text style={styles.ownerCol}>{owner.guardianName}</Text>
              <Text style={styles.ownerCol}>{String(owner.mobileNo)}</Text>
              <Text style={styles.ownerCol}>{owner.email || 'N/A'}</Text>
            </View>
          ))}
        </Section>

        {/* Document Details */}
        <Section title="Document Details">
          <View style={styles.docHeader}>
            <Text style={styles.docCol}>Document Name</Text>
            <Text style={styles.docCol}>Image</Text>
            <Text style={styles.docCol}>Status</Text>
          </View>

          {Array.isArray(documents) &&
            documents.map(doc => (
              <DocRow
                key={doc.id}
                name={doc.docName}
                status={
                  doc.verifiedStatus === 1
                    ? 'Verified'
                    : doc.verifiedStatus === 0
                    ? 'Pending'
                    : 'Failed'
                }
              />
            ))}
        </Section>
        <Section title="Payment Detail">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.docHeader}>
                <Text style={styles.docCol}>Tran No</Text>
                <Text style={styles.docCol}>Tran Date</Text>
                <Text style={styles.docCol}>Payment Mode</Text>
                <Text style={styles.docCol}>Tran Type</Text>
                <Text style={styles.docCol}>Demand From</Text>
                <Text style={styles.docCol}>Demand Upto</Text>
                <Text style={styles.docCol}>Demand Amt (Excl. Penalty)</Text>
                <Text style={styles.docCol}>Paid Demand</Text>
                <Text style={styles.docCol}>Paid Penalty</Text>
                <Text style={styles.docCol}>Total Paid Amt</Text>
                <Text style={styles.docCol}>Balance Amt</Text>
                <Text style={styles.docCol}>View</Text>
              </View>

              {/* Table Rows */}
              {paymentDtl && paymentDtl.length > 0 ? (
                paymentDtl.map((item, index) => (
                  <View key={item.id || index} style={styles.paymentRow}>
                    <Text style={styles.paymentCol}>{item.tranNo}</Text>
                    <Text style={styles.paymentCol}>{item.tranDate}</Text>
                    <Text style={styles.paymentCol}>{item.paymentMode}</Text>
                    <Text style={styles.paymentCol}>{item.tranType}</Text>
                    <Text style={styles.paymentCol}>{item.fromDate}</Text>
                    <Text style={styles.paymentCol}>{item.uptoDate}</Text>
                    <Text style={styles.paymentCol}>{item.demandAmt}</Text>
                    <Text style={styles.paymentCol}>{item.payableAmt}</Text>
                    <Text style={styles.paymentCol}>{item.penaltyAmt}</Text>
                    <Text style={styles.paymentCol}>
                      {parseFloat(item.payableAmt) +
                        parseFloat(item.penaltyAmt)}
                    </Text>
                    <Text style={styles.paymentCol}>{item.balance}</Text>

                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => handleViewReceipt(item.id)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No payment details found.</Text>
              )}
            </View>
          </ScrollView>
        </Section>
        <Section title="Customer Connection Details">
          <View style={styles.customerCard}>
            <DetailRow
              label="Connection Type"
              value={connectionDtl.connectionType || 'N/A'}
            />

            <DetailRow
              label="Connection Date"
              value={
                connectionDtl.connectionDate
                  ? new Date(connectionDtl.connectionDate).toLocaleDateString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="Created At"
              value={
                connectionDtl.createdAt
                  ? new Date(connectionDtl.createdAt).toLocaleString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="Meter No"
              value={connectionDtl.meterNo || 'N/A'}
            />

            <DetailRow
              label="Current Reading"
              value={connectionDtl.currentReading || 'N/A'}
            />

            <DetailRow
              label="Current Reading Date"
              value={
                Array.isArray(connectionDtl.currentReadingDate) &&
                connectionDtl.currentReadingDate.length > 0
                  ? new Date(
                      connectionDtl.currentReadingDate[0],
                    ).toLocaleString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="Is Meter Working"
              value={connectionDtl.isMeterWorking || 'N/A'}
            />

            <DetailRow
              label="Lock Status"
              value={connectionDtl.lockStatus ? 'Locked' : 'Unlocked'}
            />

            <DetailRow
              label="Meter Type ID"
              value={connectionDtl.meterTypeId || 'N/A'}
            />

            <DetailRow
              label="Reference Unique No"
              value={connectionDtl.refUniqueNo || 'N/A'}
            />

            <DetailRow
              label="Updated At"
              value={
                connectionDtl.updatedAt
                  ? new Date(connectionDtl.updatedAt).toLocaleString()
                  : 'N/A'
              }
            />

            <DetailRow label="User ID" value={connectionDtl.userId || 'N/A'} />
            <DetailRow
              label="User Name"
              value={connectionDtl.userName || 'N/A'}
            />

            {/* Show Image */}
            <View style={styles.imageContainer}>
              <Text style={styles.text}>Last Reading Img</Text>
              {connectionDtl.docPath ? (
                <Image
                  source={{ uri: connectionDtl.docPath }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text>No document available</Text>
              )}
            </View>
          </View>
        </Section>

        {/* Field Verification */}
        <Section title="Field Verification">
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No Field Verification Available!
            </Text>
          </View>
        </Section>

        {/* Memo Details */}
        <Section title="Memo Details">
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Memo Details Available!</Text>
          </View>
        </Section>

        {/* Level Remarks */}
        <Section title="Level Remarks">
          {Array.isArray(levelRemarks) && levelRemarks.length > 0 ? (
            <View style={styles.container}>
              <View
                style={[
                  styles.row,
                  { borderBottomWidth: 1, borderBottomColor: '#000' },
                ]}
              >
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Role</Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Remark
                </Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Time</Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Action
                </Text>
              </View>
              {levelRemarks.map((remark, index) => (
                <View key={remark.id || index} style={styles.row}>
                  <Text style={styles.value}>{remark.senderRole || 'N/A'}</Text>
                  <Text style={styles.value}>
                    {remark.senderRemarks || '-'}
                  </Text>
                  <Text style={styles.value}>
                    {new Date(remark.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(remark.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.value}>{remark.actions || '-'}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noRemarksContainer}>
              <Text style={styles.noRemarksText}>
                No level remarks available
              </Text>
            </View>
          )}
        </Section>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.tradeLicenseText}>Genetrate Demand</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowDemandModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Demand</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowDocumentModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Modals */}
      <ViewDemandModal
        visible={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        customerDue={customerDue}
        tradeDetails1={tradeDetails}
        customerDeuDetails={customerDeuDetails}
      />
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        customerDue={customerDue}
        tradeDetails={tradeDetails}
        customerDeuDetails={customerDeuDetails}
        id={id}
      />
      <DocumentModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={documents}
      />
      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        receiptData={receiptDatas}
      />
      <GenerateDemandModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        connectionDetails={connectionDetails}
        id={id}
      />
    </View>
  );
};

// Section and Row components
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const DocRow = ({ name, status }) => {
  const color =
    status === 'Verified'
      ? 'green'
      : status === 'Pending'
      ? 'orange'
      : status === 'Failed'
      ? 'red'
      : 'black';
  return (
    <View style={styles.docRow}>
      <Text style={styles.docCol}>{name}</Text>
      <Text style={styles.docCol}>📄</Text>
      <Text style={[styles.docCol, { color, fontWeight: 'bold' }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f4faff' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  banner: {
    backgroundColor: '#e6f0ff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  bannerText: { fontSize: 14 },
  appId: { color: '#ff6600', fontWeight: 'bold' },
  statusText: { marginTop: 5 },
  expired: { color: 'red', fontWeight: 'bold' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.background,
    backgroundColor: Colors.primary,
    padding: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 0.4,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  label: { fontWeight: '600', color: '#333', flex: 1 },
  value: { flex: 1, textAlign: 'right', color: '#000' },

  ownerHeader: { flexDirection: 'row', backgroundColor: '#f2f2f2', padding: 8 },
  ownerRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ownerCol: { flex: 1, fontWeight: 'bold' },

  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  docCol: { flex: 1, textAlign: 'center', fontSize: 10 },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCol: { flex: 1, textAlign: 'center', fontSize: 10 },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 10,
  },
  viewBtnText: { color: '#fff', fontWeight: '600' },

  noRemarksContainer: { padding: 10, alignItems: 'center' },
  noRemarksText: { color: '#999' },

  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },

  tradeLicenseBtn: {
    backgroundColor: '#0f3969ff',
    marginBottom: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center', // centers content horizontally
    flexDirection: 'row', // ensures content is in a row
    // paddingHorizontal: 10, // optional, adds spacing inside the button
    // paddingVertical: 5, // optional, adjusts height
    borderWidth: 1, // sets border thickness
    borderColor: 'red',
    padding: 2,
  },
  tradeLicenseText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 5, // optional, if you have an icon next to text
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  customerCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  customerCardLabel: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  customerCardValue: {
    flex: 1,
    textAlign: 'right',
    color: '#555',
  },

  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
    marginRight: 8, // space between text and image
    backgroundColor: Colors.primary,
    color: Colors.background,
    padding: 5,
  },
  //   image: {
  //     width: 24,
  //     height: 24,
  //   },
});

export default Details;
