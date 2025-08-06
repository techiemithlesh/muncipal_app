import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'react-native-alert-notification/lib/typescript/service';
import Colors from '../Constants/Colors';

const SurrenderLicense = () => {
  const navigation = useNavigation();

  const [landmark, setLandmark] = useState('');
  const [newWardNo, setNewWardNo] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* APPLY LICENSE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPLY LICENSE</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Application Type *</Text>
            <Text style={styles.value}>RENEWAL</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Firm Type *</Text>
            <Text style={styles.value}>PROPRIETORSHIP</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Type of Ownership *</Text>
            <Text style={styles.value}>OWN PROPERTY</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>License No.</Text>
            <Text style={styles.value}>8583</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Category *</Text>
            <Text style={styles.value}>Others</Text>
          </View>
        </View>
      </View>
      {/* FIRM DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FIRM DETAILS</Text>
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
            <Text style={styles.label}>Firm Name *</Text>
            <Text style={styles.value}>SHANTI NIKETAN</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Total Area (Sq. Ft)</Text>
            <Text style={styles.value}>180.00</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Firm Establishment Date</Text>
            <Text style={styles.value}>2017-10-09</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Pin Code</Text>
            <Text style={styles.value}>0</Text>
          </View>
        </View>
        <View>
          <Text style={styles.label}>Business Address</Text>
          <Text style={styles.value}>OPP S.S MEMORIAL COLLEGE RANCHI</Text>
        </View>
        <View>
          <Text style={styles.label}>Owner of Business Premises</Text>
          <Text style={styles.value}>SMT. URMILA DEVI</Text>
        </View>
        <View>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Landmark"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>
        <View>
          <Text style={styles.label}>Business Description *</Text>
          <Text style={styles.value}>XEROX SHOP STUDIO</Text>
        </View>
        <View>
          <Text style={styles.label}>New Ward No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter New Ward No."
            value={newWardNo}
            onChangeText={setNewWardNo}
          />
        </View>
      </View>
      {/* OWNER DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OWNER DETAILS</Text>
        {/* Owner 1 */}
        <View style={styles.ownerRow}>
          <View style={styles.ownerColumn}>
            <Text style={styles.label}>Owner Name *</Text>
            <Text style={styles.value}>PRAKASH RAJAN SRIVASTAVA</Text>
          </View>
          <View style={styles.ownerColumn}>
            <Text style={styles.label}>Guardian Name</Text>
            <Text style={styles.value}>LATE MADAN MEHAN SRIVASTAV</Text>
          </View>
          <View style={styles.ownerColumn}>
            <Text style={styles.label}>Mobile No.</Text>
            <Text style={styles.value}>9876543210</Text>
          </View>
          <View style={styles.ownerColumn}>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Owner 2 */}
        <View style={styles.ownerRow}>
          <View style={styles.ownerColumn}>
            <Text style={styles.value}>RAHUL SHARMA</Text>
          </View>
          <View style={styles.ownerColumn}>
            <Text style={styles.value}>LATE RAMESH SHARMA</Text>
          </View>
          <View style={styles.ownerColumn}>
            <Text style={styles.value}>rahul@example.com</Text>
          </View>
          <View style={styles.ownerColumn}>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* NATURE OF BUSINESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NATURE OF BUSINESS</Text>
        <Text style={styles.value}>
          MATCH MATCHES FOR LIGHTING INCLUDING BENGAL MATCHES MANUFACTURING
          PARCHING PACKING PRESSING CLEANING CLEANSING BOILING MELTING GRINDING
          OR PREPARING BY ANY PROCESS GRINDING WHATSOEVER EXCEPT FOR DOMESTIC
          PURPOSES
        </Text>
      </View>
      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('DocUpload')}
      >
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  section: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: Colors.primary,
    color: '#fff',
    padding: 4,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  column: { flex: 1, minWidth: '45%', marginRight: 10, marginBottom: 8 },
  label: { fontSize: 12, color: '#555' },
  value: { fontSize: 14, color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 6,
    marginTop: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  ownerColumn: { flex: 1, minWidth: '15%', marginBottom: 4 },
  uploadButton: {
    backgroundColor: Colors.primary,
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  uploadText: { color: '#fff', fontSize: 12 },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 4,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SurrenderLicense;
