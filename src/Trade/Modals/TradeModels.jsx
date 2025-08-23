// TradeModels.jsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';

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

// 2. View Demand Modal
export const ViewDemandModal = ({
  visible,
  onClose,
  tradeDetails,
  tradeDetails1,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>Demand Details</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Current Demand</Text>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Application No:</Text>
              <Text style={styles.value}>
                {tradeDetails1?.applicationNo || 'N/A'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>License Fee:</Text>
              <Text style={styles.value}>
                ₹ {tradeDetails?.licenseCharge || '0'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Processing Fee:</Text>
              <Text style={styles.value}>
                ₹ {tradeDetails?.processingFee || '0'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Late Fee:</Text>
              <Text style={styles.value}>
                ₹ {tradeDetails?.latePenalty || '0'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowContainer}>
              <Text style={[styles.label, styles.totalText]}>
                Total Amount:
              </Text>
              <Text style={[styles.value, styles.totalText]}>
                ₹ {tradeDetails?.totalCharge || '0'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {tradeDetails?.dueDate || '24-08-2025'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Payment Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      tradeDetails?.paymentStatus === 'Paid' ? 'green' : 'red',
                  },
                ]}
              >
                {tradeDetails?.paymentStatus || 'Pending'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);
export const PaymentModal = ({ visible, onClose, tradeDetails }) => {
  const [year, setYear] = useState(null); // 👈 add this state
  const [paymentMode, setPaymentMode] = useState(null);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.mainTitle}>Licence Required for the Year</Text>

            {/* Form Fields */}
            <View style={styles.row}>
              <Text style={styles.label}>License For*</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Year 1', value: 1 },
                  { label: 'Year 2', value: 2 },
                  { label: 'Year 3', value: 3 },
                  { label: 'Year 4', value: 4 },
                  { label: 'Year 5', value: 5 },
                  { label: 'Year 6', value: 6 },
                  { label: 'Year 7', value: 7 },
                  { label: 'Year 8', value: 8 },
                  { label: 'Year 9', value: 9 },
                  { label: 'Year 10', value: 10 },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Choose Year"
                value={year}
                onChange={item => setYear(item.value)}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Charge Applied*</Text>
              <TextInput
                style={styles.input}
                value={tradeDetails?.totalCharge?.toString() || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Penalty*</Text>
              <TextInput style={styles.input} value="0" editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Denial Amount*</Text>
              <TextInput style={styles.input} value="0" editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Charge*</Text>
              <TextInput style={styles.input} value="1500" editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Mode*</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'CASH', value: 'CASH' },
                  { label: 'CHEQUE', value: 'CHEQUE' },
                  { label: 'ONLINE', value: 'ONLINE' },
                  { label: 'DD', value: 'DD' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Choose Payment Mode"
                value={paymentMode}
                onChange={item => setPaymentMode(item.value)}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitText}>SUBMIT</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// 4. Document Modal
export const DocumentModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>Uploaded Documents</Text>

          <View style={styles.sectionContainer}>
            {[
              { name: 'Trade License', status: 'Verified', date: '2019-01-24' },
              {
                name: 'Application Form',
                status: 'Verified',
                date: '2019-01-24',
              },
              {
                name: 'Identity Proof',
                status: 'Verified',
                date: '2019-01-24',
              },
              { name: 'Address Proof', status: 'Pending', date: '2019-01-24' },
              {
                name: 'NOC Certificate',
                status: 'Verified',
                date: '2019-01-25',
              },
            ].map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentDate}>Uploaded: {doc.date}</Text>
                </View>
                <Text
                  style={[
                    styles.documentStatus,
                    { color: doc.status === 'Verified' ? 'green' : 'orange' },
                  ]}
                >
                  {doc.status}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// 5. Payment Receipt Modal
export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>Payment Receipt</Text>
          <Text style={styles.subTitle}>
            {receiptData?.ulbDtl?.ulbName || 'Municipal Corporation'}
          </Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Receipt Info</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Receipt No:</Text>
              <Text style={styles.value}>{receiptData?.tranNo || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{receiptData?.tranDate || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Application No:</Text>
              <Text style={styles.value}>
                {receiptData?.applicationNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Account:</Text>
              <Text style={styles.value}>
                {receiptData?.accountDescription || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Owner Details</Text>
            {receiptData?.ownerDtl?.map((o, i) => (
              <View style={styles.rowContainer} key={i}>
                <Text style={styles.label}>Owner {i + 1}:</Text>
                <Text style={styles.value}>
                  {o.ownerName} ({o.mobileNo})
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Mode:</Text>
              <Text style={styles.value}>
                {receiptData?.paymentMode || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      receiptData?.paymentStatus === 'Clear' ? 'green' : 'red',
                  },
                ]}
              >
                {receiptData?.paymentStatus || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.amount || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>In Words:</Text>
              <Text style={styles.value}>
                {receiptData?.amountInWords || ''}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Transaction</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Payable Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.payableAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Demand Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.demandAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Penalty:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.penaltyAmt || '0.00'}
              </Text>
            </View>
          </View>

          {receiptData?.fineRebate?.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Fine / Rebate</Text>
              {receiptData.fineRebate.map((f, i) => (
                <View style={styles.rowContainer} key={i}>
                  <Text style={styles.label}>{f.headName}:</Text>
                  <Text style={styles.value}>₹ {f.amount}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.note}>
            Note: This is a computer-generated receipt. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Download / Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },
  submitBtn: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
    maxHeight: '90%',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 18,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  tinyText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
    flex: 1,
    color: '#555',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  declaration: {
    marginTop: 15,
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  term: {
    fontSize: 12,
    marginVertical: 3,
    color: '#444',
  },
  note: {
    marginTop: 15,
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  printBtn: {
    marginTop: 20,
    backgroundColor: '#0c3c78',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
