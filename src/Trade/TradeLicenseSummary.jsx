import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Colors from '../Constants/Colors';

const TradeLicenseSummary = () => {
  const [activeTab, setActiveTab] = useState('Dealing Officer');
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your applied application no.{' '}
            <Text style={styles.appId}>SAF/01002/00003</Text>. You can use this
            for future reference.
          </Text>
          <Text style={styles.statusText}>
            Current Status: <Text style={styles.expired}>License Expired</Text>
          </Text>
        </View>

        {/* Basic Details */}
        <Section title="Basic Details">
          <DetailRow label="Ward No" value="55" />
          <DetailRow label="Licence For" value="1 Years" />
          <DetailRow
            label="Nature Of Business"
            value="GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PACKING (8A)"
          />
          <DetailRow label="Ownership Type" value="ON RENT" />
          <DetailRow label="Account No" value="N/A" />
          <DetailRow label="Holding No" value="N/A" />
          <DetailRow label="Landmark" value="N/A" />
          <DetailRow
            label="Address"
            value="NEW NAGAR BANDHGARH DIPATOLI RANCHI"
          />
          <DetailRow label="Application No" value="1623234011910140" />
          <DetailRow label="Valid Upto" value="23 Jan 2020" />
          <DetailRow label="Updated Date" value="23 Jan 2020" />
          <DetailRow label="Application Type" value="NEW LICENSE" />
          <DetailRow label="Firm Name" value="GOPAL GENERAL STORE" />
          <DetailRow label="Firm Type" value="PROPRIETORSHIP" />
          <DetailRow label="Category Type" value="Others" />
          <DetailRow label="Firm Establishment Date" value="24/01/2019" />
          <DetailRow label="Applied Date" value="25 Jan 2019" />
          <DetailRow label="Area" value="80.00" />
          <DetailRow label="Pin Code" value="834001" />
        </Section>

        {/* Owner Details */}
        <Section title="Owner Details">
          <DetailRow label="Owner Name" value="ARVIND KUMAR" />
          <DetailRow label="Guardian Name" value="LATE BANARAS PRASAD" />
          <DetailRow label="Mobile No" value="9709262782" />
          <DetailRow label="Email Id" value="N/A" />
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
          <View style={styles.paymentRow}>
            <Text style={styles.paymentCol}>300.00</Text>
            <Text style={styles.paymentCol}>2019-01-24</Text>
            <Text style={styles.paymentCol}>CASH</Text>
            <Text style={styles.paymentCol}>NEW LICENSE</Text>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
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

        {/* Button to open modal */}
        <TouchableOpacity
          style={styles.tradeLicenseBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.tradeLicenseText}>View Trade License</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Trade License Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContent}>
            <ScrollView nestedScrollEnabled>
              <TouchableOpacity
                style={modalStyles.closeBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={modalStyles.closeText}>Close</Text>
              </TouchableOpacity>

              <Text style={modalStyles.mainTitle}>
                Municipal Trade Licence Approval Certificate
              </Text>

              <Text style={modalStyles.mainTitle}>Municipal License</Text>

              <Text style={modalStyles.subTitle}>
                RANCHI MUNICIPAL CORPORATION
              </Text>
              <Text style={modalStyles.tinyText}>
                (This certificate relates to Section 455(J) Jharkhand Municipal
                Act 2011)
              </Text>

              {[
                ['Municipal Trade Licence No:', 'RAN55020319162233'],
                ['Issue Date:', '03-02-2019'],
                ['Validity:', '23-01-2020'],
                ['Owner/Entity Name:', 'GOPAL GENERAL STORE'],
                ['Owner Name:', 'ARVIND KUMAR'],
                ['Nature of Entity:', 'GENERAL STORE'],
                [
                  'Nature of Business:',
                  'GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PARCHING',
                ],
                ['Business Code:', '(83)'],
                ['Date of Application:', '24-01-2019'],
                ['Ward No.:', '55'],
                ['Holding No.:', 'N/A'],
                [
                  'Street Address:',
                  'NEW NAGAR BANDHGARI DIPATOLI RANCHI834001',
                ],
                ['Application No.:', '162233240119104140'],
                ['Mobile No.:', '9709226782'],
              ].map(([label, value], index) => (
                <View style={modalStyles.rowContainer} key={index}>
                  <Text style={modalStyles.label}>{label}</Text>
                  <Text style={modalStyles.value}>{value}</Text>
                </View>
              ))}

              <Text style={modalStyles.declaration}>
                This is to declare that{' '}
                <Text style={{ fontWeight: 'bold' }}>GOPAL GENERAL STORE</Text>{' '}
                having application number{' '}
                <Text style={{ fontWeight: 'bold' }}>162233240119104140</Text>{' '}
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
                  <Text style={modalStyles.term} key={i}>
                    {term}
                  </Text>
                ))}
              </View>

              <Text style={modalStyles.note}>
                Note: This is a computer-generated license. No physical
                signature is required.
              </Text>

              <TouchableOpacity style={modalStyles.printBtn}>
                <Text style={modalStyles.printText}>Print</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#0c3c78',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tradeLicenseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    maxHeight: '95%',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    color: 'red',
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 16,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tinyText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    flex: 1,
  },
  declaration: {
    marginTop: 10,
    fontSize: 13,
  },
  term: {
    fontSize: 12,
    marginVertical: 2,
  },
  note: {
    marginTop: 10,
    fontStyle: 'italic',
    fontSize: 10,
    color: '#555',
  },
  printBtn: {
    marginTop: 15,
    backgroundColor: '#0c3c78',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TradeLicenseSummary;
