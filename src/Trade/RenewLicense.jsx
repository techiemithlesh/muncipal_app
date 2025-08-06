import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../Constants/Colors';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import FormField from '../Components/FormField';

const RenewLicense = () => {
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [wardNo, setwardNo] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Firm Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FIRM DETAILS</Text>
        <View style={styles.card}>
          {/* Row 1 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Holding No.</Text>
              <Text style={styles.value}>0010000771000X1</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Ward No.</Text>
              <Text style={styles.value}>1</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Firm Name</Text>
              <Text style={styles.value}>SHANTI NIKETAN</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Total Area (in Sq. Ft)</Text>
              <Text style={styles.value}>180.00</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Firm Establishment Date</Text>
              <Text style={styles.value}>2017-10-09</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Business Address</Text>
              <Text style={styles.value}>OPP S.S MEMORIAL COLLEGE RANCHI</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Pin Code</Text>
              <FormField
                type="input"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={setPincode}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>New Ward No.</Text>
              <FormField
                type="input"
                value={wardNo}
                onChange={setwardNo}
                placeholder="enter ward"
              />
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Owner of Business Premises</Text>
              <Text style={styles.value}>SMT. URMILA DEVI</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Landmark</Text>
              <FormField
                type="input"
                placeholder="Enter landmark"
                value={landmark}
                onChange={setLandmark}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Business Description</Text>
              <Text style={styles.value}>XEROX SHOP STUDIO</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Owner Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OWNER DETAILS</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 2 }]}>OWNER NAME</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>GUARDIAN NAME</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>MOBILE NO</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>EMAIL ID</Text>
        </View>

        {/* Row 1 */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            PRAKASH RAJAN SRIVASTAVA
          </Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            LATE MADAN MEHAN SRIVASTAV
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>9876543210</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>rahul@example.com</Text>
        </View>

        {/* Row 2 */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>RAHUL SHARMA</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            LATE RAMESH SHARMA
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>rahul@example.com</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>rahul@example.com</Text>
        </View>
      </View>

      {/* Nature of Business */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NATURE OF BUSINESS</Text>
        <View style={styles.card}>
          <Text style={styles.value}>
            MATCH MATCHES FOR LIGHTING INCLUDING BENGAL MATCHES MANUFACTURING
            PARCHING PACKING PRESSING CLEANING CLEANSING BOILING MELTING
            GRINDING OR PREPARING BY ANY PROCESS GRINDING WHATSOEVER EXCEPT FOR
            DOMESTIC PURPOSES
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: rw(3),
    backgroundColor: Colors.background,
  },
  section: {
    marginBottom: rh(2),
  },
  sectionTitle: {
    backgroundColor: Colors.primary,
    color: Colors.background,
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(2.5),
    fontSize: rf(2.1),
    fontWeight: 'bold',
    borderTopLeftRadius: rw(2),
    borderTopRightRadius: rw(2),
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: rw(3.5),
    borderRadius: rw(2),
    backgroundColor: Colors.backgroundColor,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: rh(1.5),
  },
  column: {
    width: '47%',
    marginBottom: rh(1),
  },
  label: {
    fontSize: rf(1.6),
    color: '#555',
    marginBottom: rh(0.4),
  },
  value: {
    fontSize: rf(1.8),
    fontWeight: 'bold',
    color: Colors.backgroundColor,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: rh(1),
    paddingHorizontal: rw(2),
    borderTopLeftRadius: rw(2),
    borderTopRightRadius: rw(2),
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: rh(1),
    paddingHorizontal: rw(2),
    backgroundColor: '#fff',
  },
  tableCell: {
    fontSize: rf(1.6),
    paddingHorizontal: rw(1),
    color: '#000',
  },
});

export default RenewLicense;
