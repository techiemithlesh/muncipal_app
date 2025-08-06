import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../Constants/Colors';
import Card from '../Components/Card';
import { useNavigation } from '@react-navigation/native';
const InboxScreen = () => {
  const navigation = useNavigation();
  const data = [
    {
      id: 1,
      wardNo: '10',
      licenseNo: 'LIC12345',
      ownerName: 'Rahul Sharma',
      guardianName: 'Mr. Sharma',
      address: '123 Main Street, City',
    },
    {
      id: 2,
      wardNo: '11',
      licenseNo: 'LIC67890',
      ownerName: 'Amit Kumar',
      guardianName: 'Mr. Kumar',
      address: '456 Another Street, City',
    },

    {
      id: 3,
      wardNo: '11',
      licenseNo: 'LIC67890',
      ownerName: 'Amit Kumar',
      guardianName: 'Mr. Kumar',
      address: '456 Another Street, City',
    },
    {
      id: 4,
      wardNo: '11',
      licenseNo: 'LIC67890',
      ownerName: 'Amit Kumar',
      guardianName: 'Mr. Kumar',
      address: '456 Another Street, City',
    },
    // More data...
  ];

  const renderHeader = () => (
    <View style={styles.tableRow}>
      <Text style={styles.headerCell}>#</Text>
      <Text style={styles.headerCell}>Ward No.</Text>
      <Text style={styles.headerCell}>License No.</Text>
      <Text style={styles.headerCell}>Owner Name</Text>
      <Text style={styles.headerCell}>Guardian Name</Text>
      <Text style={styles.headerCell}>Address</Text>
      <Text style={styles.headerCell}>Action</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyRow}>
      <Text style={styles.mutedText}>No records found.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.excelButton}>
          <Text style={styles.buttonText}>Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pdfButton}>
          <Text style={styles.buttonText}>PDF</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput placeholder="Search..." style={styles.searchInput} />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💠 Card Container */}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item, index }) => (
          <Card
            index={index + 1}
            wardNo={item.wardNo}
            licenseNo={item.licenseNo}
            ownerName={item.ownerName}
            guardianName={item.guardianName}
            address={item.address}
            onPress={() =>
              navigation.navigate('LicenseVerificationScreen', { id: item.id })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
    backgroundColor: Colors.background,
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    color: Colors.text,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: responsiveWidth(2),
    borderRadius: 8,
  },
  excelButton: {
    backgroundColor: Colors.success,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 5,
    marginRight: 10,
  },
  pdfButton: {
    backgroundColor: Colors.danger,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: Colors.background,
    fontSize: responsiveFontSize(1.8),
  },
  searchContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: responsiveHeight(1),
    width: responsiveWidth(35),
    borderRadius: 4,
    marginRight: 5,
    fontSize: responsiveFontSize(1.8),
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 5,
  },
  emptyRow: {
    padding: responsiveHeight(2),
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  mutedText: {
    color: Colors.muted,
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
  },
});

export default InboxScreen;
