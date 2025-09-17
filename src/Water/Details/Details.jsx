import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Modal,
} from 'react-native';
import Colors from '../../Constants/Colors';
import { API_ROUTES, WORK_FLOW_PERMISSION } from '../../api/apiRoutes';
import axios from 'axios';
import HeaderNavigation from '../../Components/HeaderNavigation';
import {
  ViewDemandModal,
  ViewTradeLicenseModal,
  PaymentModal,
  DocumentModal,
  PaymentReceiptModal,
  RemarksModal,
} from './Model/Model';

import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../utils/auth';
import { WATER_API_ROUTES } from '../../api/apiRoutes';

const Details = ({ route }) => {
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showTradeLicenseModal, setShowTradeLicenseModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [receiptData, setTradPaymentRecipt] = useState(null);
  const [waterDue, setWaterDue] = useState(null);
  const [tradeDetails, setTradeDetails] = useState(null);
  const [paymentDtl, setPaymentDtl] = useState(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [levelRemarks, setLevelRemarks] = useState([]);
  const [tradeDue, setTradeDue] = useState(null);

  const [loading, setLoading] = useState(false);

  const id = route?.params?.id;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const token = await getToken();

        // Fetch trade details first to get workflowId
        const tradeRes = await axios.post(
          WATER_API_ROUTES.WATER_DETAILS_API,
          { id: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        console.log('Trade Details Response:', tradeRes?.data);
        console.log('Payment Status:', tradeRes?.data?.paymentStatus);
        console.log('Payment Status:', tradeRes?.data?.data?.paymentStatus); // ✅

        if (tradeRes?.data?.status && tradeRes.data.data) {
          setTradeDetails(tradeRes.data.data);
          setPaymentDtl(tradeRes.data.data.tranDtls?.[0] || null);
          setLevelRemarks(tradeRes.data.data.levelRemarks || []);
        }

        const workflowId = tradeRes?.data?.data?.workflowId || 0;
        console.log('Trade detaild ID:', tradeRes?.data?.data);
        // Run other APIs in parallel
        const [waterDue, workflowRes, paymentRes, receiptRes, documentRes] =
          await Promise.all([
            axios.post(
              WATER_API_ROUTES.WATER_DUE_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WORK_FLOW_PERMISSION,
              { wfId: workflowId },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WATER_API_ROUTES.PAYMENT_RECEIPT_API,
              {
                id,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WATER_API_ROUTES.PAY_DEMAND_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WATER_API_ROUTES.WATER_DOC_LIST,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ]);
        console.log('Payment Receipt:', paymentRes?.data);

        if (waterDue?.data?.status) setWaterDue(waterDue.data.data);
        if (workflowRes?.data?.status) setWorkflowData(workflowRes.data.data);
        if (paymentRes?.data?.status) setTradeDue(paymentRes.data.data);
        if (paymentRes?.data?.status)
          setTradPaymentRecipt(paymentRes.data.data);
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
            <Text style={styles.appId}>{tradeDetails?.applicationNo}</Text>. You
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
          <DetailRow label="Ward No" value={tradeDetails?.wardNo} />
          <DetailRow
            label="Licence For"
            value={`${tradeDetails?.licenseForYears} Years`}
          />
          <DetailRow
            label="Nature Of Business"
            value={tradeDetails?.natureOfBusiness}
          />
          <DetailRow
            label="Ownership Type"
            value={tradeDetails?.ownershipType}
          />
          <DetailRow label="Landmark" value={tradeDetails?.landmark || 'N/A'} />
          <DetailRow label="Address" value={tradeDetails?.address} />
          <DetailRow
            label="Application No"
            value={tradeDetails?.applicationNo}
          />
          <DetailRow
            label="Valid Upto"
            value={tradeDetails?.validUpto || 'N/A'}
          />
          <DetailRow
            label="Updated Date"
            value={tradeDetails?.updatedAt?.slice(0, 10)}
          />
          <DetailRow
            label="Application Type"
            value={tradeDetails?.applicationType}
          />
          <DetailRow label="Firm Name" value={tradeDetails?.firmName} />
          <DetailRow label="Firm Type" value={tradeDetails?.firmType} />
          <DetailRow label="Category Type" value="Others" />
          <DetailRow
            label="Firm Establishment Date"
            value={tradeDetails?.firmEstablishmentDate}
          />
          <DetailRow label="Applied Date" value={tradeDetails?.applyDate} />
          <DetailRow label="Area" value={tradeDetails?.areaInSqft} />
          <DetailRow label="Pin Code" value={tradeDetails?.pinCode} />
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

        {/* Payment Details */}
        <Section title="Payment Detail">
          <View style={styles.docHeader}>
            <Text style={styles.docCol}>Processing Fee</Text>
            <Text style={styles.docCol}>Transaction Date</Text>
            <Text style={styles.docCol}>Payment Through</Text>
            <Text style={styles.docCol}>Payment For</Text>
            <Text style={styles.docCol}>View</Text>
          </View>
          {paymentDtl && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentCol}>{paymentDtl.penaltyAmt}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.tranDate}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.paymentMode}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.tranType}</Text>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => setShowReceipt(true)}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
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
            onPress={() => setShowTradeLicenseModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Water</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowDemandModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Demand</Text>
          </TouchableOpacity>
          {tradeDetails?.paymentStatus === 0 && (
            <TouchableOpacity
              style={[styles.tradeLicenseBtn, { flex: 1 }]}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.tradeLicenseText}>View Payment</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowDocumentModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Documents</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => navigation.navigate('EditTrade', { id })}
          >
            <Text style={styles.tradeLicenseText}>Edit</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.tradeLicenseText}>Open Remarks Modal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Modals */}
      <ViewTradeLicenseModal
        visible={showTradeLicenseModal}
        onClose={() => setShowTradeLicenseModal(false)}
        tradeDetails={tradeDetails}
        id={id}
      />
      <ViewDemandModal
        visible={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        tradeDetails={waterDue}
        tradeDetails1={tradeDetails}
        id={id}
      />
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tradeDetails={waterDue}
        id={id}
      />

      <DocumentModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={documents}
        id={id}
      />
      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        receiptData={receiptData}
        id={id}
      />

      <RemarksModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        remarks={remarks}
        setRemarks={setRemarks}
        // onSubmit={handleSend} // pass the function
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
  docCol: { flex: 1, textAlign: 'center' },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCol: { flex: 1, textAlign: 'center' },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
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
    height: 32, // Less height (instead of paddingVertical)
    width: '100%', // Bigger width (adjust as needed)
    marginBottom: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center', // Center text vertically
    paddingHorizontal: 10, // Padding for horizontal space
    paddingVertical: 5, // Padding for vertical space
  },

  tradeLicenseText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    alignItems: 'center',
  },
});

export default Details;
