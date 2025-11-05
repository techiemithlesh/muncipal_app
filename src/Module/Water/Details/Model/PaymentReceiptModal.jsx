import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';

export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => {
  console.log('reciept data', receiptData);
  return (
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
                {/* Table Header */}
                <View style={styles.receiptTableHeader}>
                  <Text style={styles.receiptTableHeaderText}>Description</Text>

                  <Text style={styles.receiptTableHeaderText}>Amount</Text>
                </View>

                {/* Collection Details */}
                {(receiptData?.collection || []).map((item, index) => (
                  <View style={styles.receiptTableRow} key={`col-${index}`}>
                    <Text style={styles.receiptTableCell}>
                      {item?.demand?.chargeFor || 'N/A'}
                    </Text>

                    <Text style={styles.receiptTableCell}>
                      ₹ {item?.amount}
                    </Text>
                  </View>
                ))}

                {/* Fine / Rebate Section */}
                {(receiptData?.fineRebate || []).map((fine, index) => (
                  <View
                    style={[
                      styles.receiptTableRow,
                      fine?.isRebate && { backgroundColor: '#e8f5e9' },
                    ]}
                    key={`fine-${index}`}
                  >
                    <Text style={styles.receiptTableCell}>
                      {fine?.headName}
                    </Text>

                    <Text
                      style={[
                        styles.receiptTableCell,
                        { color: fine?.isRebate ? 'green' : 'red' },
                      ]}
                    >
                      {fine?.isRebate ? '- ₹' : '+ ₹'} {fine?.amount}
                    </Text>
                  </View>
                ))}
                <Text style={styles.receiptTotal}>
                  Total Paid Amount: ₹ {receiptData?.amount || '0.00'}
                </Text>
              </View>

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
};

const styles = StyleSheet.create({
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
  mainTitle: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
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
    width: 350,
    alignSelf: 'center',
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
    marginRight: 52,
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
  printBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
