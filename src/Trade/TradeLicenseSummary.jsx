import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../Constants/Colors';
import { API_ROUTES } from '../api/apiRoutes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderNavigation from '../Components/HeaderNavigation';
import {
  ViewDemandModal,
  ViewTradeLicenseModal,
  PaymentModal,
  DocumentModal,
  PaymentReceiptModal,
} from './Modals/TradeModels';

const TradeLicenseSummary = ({ route }) => {
  // Modal State Variables
  const [showTradeLicenseModal, setShowTradeLicenseModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setTradPaymentRecipt] = useState(false);

  const [activeTab, setActiveTab] = useState('Dealing Officer');
  const id = route?.params?.id;

  const [tradeDue, setTradeDue] = useState(null);
  const [tradeDetails, setTradeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentDtl, setPaymentDtl] = useState('');

  // const receiptData = {
  //   tranNo: 'CNT141202508085959',
  //   tranDate: '2025-08-14',
  //   applicationNo: 'TL/01/001/00005',
  //   accountDescription: 'Municipal License Fee',
  //   ownerDtl: [
  //     { ownerName: 'Sandeep', mobileNo: '1234567890' },
  //     { ownerName: 'Mith', mobileNo: '9876543210' },
  //   ],
  //   paymentMode: 'CASH',
  //   paymentStatus: 'Clear',
  //   amount: '1900.00',
  //   amountInWords: 'Rupee One Thousand Nine Hundred',
  //   tranDtl: {
  //     payableAmt: '1900.00',
  //     demandAmt: '1800.00',
  //     penaltyAmt: '100.00',
  //   },
  //   fineRebate: [{ headName: 'Late Penalty', amount: '100.00' }],
  //   ulbDtl: {
  //     ulbName: 'Ranchi Municipal Corporation',
  //   },
  // };

  useEffect(() => {
    const fetchTradeDetails = async () => {
      if (!id) return;
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const res = await axios.post(
          API_ROUTES.TRADE_DETAILS,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data.status && res.data.data) {
          setPaymentDtl(res.data.data.tranDtls[0]);
          setTradeDetails(res.data.data);
          console.log(res.data.data, 'my data trade details');
        } else {
          setTradeDetails(null);
        }
      } catch (err) {
        console.log('Error fetching trade details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTradeDue = async () => {
      if (!id) return;
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const trade_res = await axios.post(
          API_ROUTES.TRADE_DUE_DETAILS,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (trade_res.data.status && trade_res.data.data) {
          setTradeDue(trade_res.data.data);
        } else {
          setTradeDue(null);
        }
      } catch (err) {
        console.log('Error fetching trade due:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeDetails();
    fetchTradeDue();
  }, [id]);

  useEffect(() => {
    console.log('🔵 Second useEffect triggered, id:', id);

    const fetchTradePayment = async () => {
      console.log('🟡 fetchTradePayment called with id:', id);
      if (!id) {
        console.log('⚠️ No ID provided, skipping fetchTradePayment');
        return;
      }

      const body = {
        id: id,
        paymentType: 'FULL',
        paymentMode: 'CASH',
        chequeNo: '',
        chequeDate: '',
        bankName: '',
        branchName: '',
      };

      console.log('📤 Calling TRADE_PAYMENT API with body:', body);

      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log('🔑 Token retrieved:', token ? 'Yes' : 'No');

        const res = await axios.post(API_ROUTES.TRADE_PAYMENT, body, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📥 TRADE_PAYMENT Full Response:', res.data);

        if (res.data?.status && res.data?.data) {
          console.log('✅ Trade Payment Response Data:', res.data.data);
          setTradeDue(res.data.data);
        } else {
          console.log('⚠️ No data in response or status false');
          setTradeDetails(null);
        }
      } catch (err) {
        console.log('❌ TRADE_PAYMENT Request failed:', err);
        console.log('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTradePaymentRecipt = async () => {
      console.log('🟡 fetchTradePaymentRecipt called with id:', id);
      if (!id) {
        console.log('⚠️ No ID provided, skipping fetchTradePaymentRecipt');
        return;
      }

      const body = {
        id: 1,
      };

      console.log('📤 Calling TRADE_PAYMENT_RECEIPT API with body:', body);

      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log('🔑 Token retrieved for receipt:', token ? 'Yes' : 'No');

        const res = await axios.post(API_ROUTES.TRADE_PAYMENT_RECEIPT, body, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📥 TRADE_PAYMENT_RECEIPT Full Response:', res.data);

        if (res.data?.status && res.data?.data) {
          console.log('✅ Trade Payment Receipt Response Data:', res.data.data);
          setTradPaymentRecipt(res.data.data);
        } else {
          console.log('⚠️ No data in receipt response or status false');
          setTradPaymentRecipt(null);
        }
      } catch (err) {
        console.log('❌ TRADE_PAYMENT_RECEIPT Request failed:', err);
        console.log('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    console.log('🚀 Starting both API calls...');
    fetchTradePayment();
    fetchTradePaymentRecipt();
  }, [id]);

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
          {/* Removed invalid comments that caused error */}
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
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f2f2f2',
              padding: 8,
            }}
          >
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Owner Name</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Guardian Name</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Mobile No</Text>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Email Id</Text>
          </View>

          {tradeDetails?.owners?.map((owner, index) => (
            <View
              key={owner.id || index}
              style={{
                flexDirection: 'row',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
            >
              <Text style={{ flex: 1 }}>{owner.ownerName}</Text>
              <Text style={{ flex: 1 }}>{owner.guardianName}</Text>
              <Text style={{ flex: 1 }}>{String(owner.mobileNo)}</Text>
              <Text style={{ flex: 1 }}>{owner.email || 'N/A'}</Text>
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
          <DocRow name="Tradelicense" status="Verified" />
          <DocRow name="Application Form" status="Pending" />
          <DocRow name="Identity Proof" status="Failed" />
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

        {/* Remarks From Level */}
        <Section title="Remarks From Level">
          <View style={styles.tabContainer}>
            {[
              'Dealing Officer',
              'Tax Daroga',
              'Section Head',
              'Executive Officer',
            ].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Dealing Officer' && (
            <>
              <DetailRow label="Received Date" value="25-01-2019 00:00:00" />
              <DetailRow label="Forwarded Date" value="2019-01-28" />
              <DetailRow label="Remarks" value="OK" />
            </>
          )}
          {activeTab === 'Executive Officer' && (
            <>
              <DetailRow label="Received Date" value="25-01-2019 00:00:00" />
              <DetailRow label="Forwarded Date" value="2019-01-28" />
              <DetailRow label="Remarks" value="OK" />
            </>
          )}
          {activeTab === 'Section Head' && (
            <>
              <DetailRow label="Received Date" value="25-01-2019 00:00:00" />
              <DetailRow label="Forwarded Date" value="2019-01-28" />
              <DetailRow label="Remarks" value="OK" />
            </>
          )}
          {activeTab === 'Tax Daroga' && (
            <>
              <DetailRow label="Received Date" value="25-01-2019 00:00:00" />
              <DetailRow label="Forwarded Date" value="2019-01-28" />
              <DetailRow label="Remarks" value="OK" />
            </>
          )}
        </Section>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowTradeLicenseModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Trade License</Text>
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

      {/* All Modals */}
      <ViewTradeLicenseModal
        visible={showTradeLicenseModal}
        onClose={() => setShowTradeLicenseModal(false)}
        tradeDetails={tradeDetails}
      />

      <ViewDemandModal
        visible={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        tradeDetails={tradeDue}
        tradeDetails1={tradeDetails}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tradeDetails={tradeDetails}
      />

      <DocumentModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        tradeDetails={tradeDetails}
      />

      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        receiptData={receiptData}
      />
    </View>
  );
};

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
  label: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },

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
  docCol: {
    flex: 1,
    textAlign: 'center',
  },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCol: {
    flex: 1,
    textAlign: 'center',
  },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0c3c78',
    borderRadius: 4,
    marginHorizontal: 2,
    paddingVertical: 6,
  },
  activeTab: {
    backgroundColor: '#0c3c78',
  },
  tabText: {
    textAlign: 'center',
    color: '#0c3c78',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },

  tradeLicenseBtn: {
    backgroundColor: '#0f3969ff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  tradeLicenseText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
export default TradeLicenseSummary;
