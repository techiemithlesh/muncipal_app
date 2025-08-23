import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import HeaderNavigation from '../Components/HeaderNavigation';
import Colors from '../Constants/Colors';

// ✅ Import all modals
import {
  GenerateDemandModal,
  ProceedToPayModal,
  LastPaymentReceiptModal,
  TotalDemandReceiptModal,
} from './Modal/WaterModels';

const { width } = Dimensions.get('window');

const WaterBillScreen = () => {
  // ✅ States for each modal
  const [showGenerateDemand, setShowGenerateDemand] = useState(false);
  const [showProceedToPay, setShowProceedToPay] = useState(false);
  const [showLastPayment, setShowLastPayment] = useState(false);
  const [showTotalDemand, setShowTotalDemand] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {/* Owner Basic Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Owner Basic Details</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Consumer No :</Text>{' '}
                  001060700793DMT01
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Pipeline Type :</Text> Old Pipeline
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Connection Type :</Text> New
                  Connection
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Category :</Text> APL
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Owner Name :</Text> MRS. GIRJA DEVI
                </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Application No :</Text> 12000004
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Property Type :</Text> Residential
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Connection Through :</Text> N/A
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Area in Sqft :</Text> 1347.98
                </Text>
                <Text style={styles.detail}>
                  <Text style={styles.label}>Mobile No :</Text> 9431594215
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Demand Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Demand Details</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.detail}>
                <Text style={styles.label}>Due From :</Text> March / 2008
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Due Upto :</Text> May / 2025
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detail}>
                <Text style={styles.label}>Arrear Demand :</Text>{' '}
                <Text style={styles.arrear}>3775.34</Text>
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Current Demand :</Text>{' '}
                <Text style={styles.current}>0</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Consumer Connection Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>
              Consumer Connection Details
            </Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.detail}>
                <Text style={styles.label}>Connection Type :</Text> Meter
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Connection Date :</Text> 02-04-2007
              </Text>
            </View>
            <Text style={styles.detail}>
              <Text style={styles.label}>Last Meter Reading :</Text> 720.00
            </Text>
          </View>
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setShowGenerateDemand(true)}
          >
            <Text style={styles.buttonText}>Generate Demand</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setShowProceedToPay(true)}
          >
            <Text style={styles.buttonText}>Proceed to Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setShowLastPayment(true)}
          >
            <Text style={styles.buttonText}>Last Payment Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setShowTotalDemand(true)}
          >
            <Text style={styles.buttonText}>Total Demand Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ All Modals */}
      <GenerateDemandModal
        visible={showGenerateDemand}
        onClose={() => setShowGenerateDemand(false)}
      />
      <ProceedToPayModal
        visible={showProceedToPay}
        onClose={() => setShowProceedToPay(false)}
      />
      <LastPaymentReceiptModal
        visible={showLastPayment}
        onClose={() => setShowLastPayment(false)}
      />
      <TotalDemandReceiptModal
        visible={showTotalDemand}
        onClose={() => setShowTotalDemand(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cardHeaderText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  cardBody: { padding: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  col: { width: width / 2.2 },
  detail: { fontSize: 13, color: '#333', marginBottom: 3 },
  label: { fontWeight: 'bold' },
  arrear: { color: 'red', fontWeight: 'bold' },
  current: { color: 'green', fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 15,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: width / 3.5,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WaterBillScreen;
