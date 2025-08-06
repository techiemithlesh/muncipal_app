import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import FormField from '../Components/FormField';
import Colors from '../Constants/Colors';
import { useNavigation } from '@react-navigation/native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Search = () => {
  const navigation = useNavigation();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [wardNo, setWardNo] = useState(null);

  const wardOptions = [
    { label: 'Ward 1', value: '1' },
    { label: 'Ward 2', value: '2' },
    { label: 'Ward 3', value: '3' },
  ];

  // Sample static data
  const data = [];

  const renderItem = ({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.wardNo}</Text>
      <Text style={styles.cell}>{item.applicationNo}</Text>
      <Text style={styles.cell}>{item.firmName}</Text>
      <Text style={styles.cell}>{item.applicationType}</Text>
      <Text style={styles.cell}>{item.applyDate}</Text>
      <Text style={styles.cell}>{item.applyBy}</Text>
      <Text style={styles.cell}>👁️</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Search Form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Search Applicant</Text>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formItem}>
            <FormField
              label="From Date"
              placeholder="Select From Date"
              value={fromDate}
              onChange={setFromDate}
              type="date"
            />
          </View>
          <View style={styles.formItem}>
            <FormField
              label="To Date"
              placeholder="Select To Date"
              value={toDate}
              onChange={setToDate}
              type="date"
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formItem}>
            <FormField
              label="Ward No"
              placeholder="Select Ward No"
              value={wardNo}
              onChange={setWardNo}
              type="dropdown"
              options={wardOptions}
            />
          </View>
          <View style={styles.formItem}>
            <FormField
              type="button"
              label=""
              buttonLabel="SEARCH"
              onPressButton={() => {
                navigation.navigate('TradeLicenseSummary');
              }}
            />
          </View>
        </View>
      </View>

      {/* Search Result */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Search Result</Text>
        </View>

        <View style={styles.tableHeader}>
          {[
            '#',
            'Ward No.',
            'Application No.',
            'Firm Name',
            'App. Type',
            'Apply Date',
            'Apply By',
            'View',
          ].map((col, i) => (
            <Text key={i} style={styles.cell}>
              {col}
            </Text>
          ))}
        </View>

        {data.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={styles.noRecordText}>No records found.</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Search;
const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
    backgroundColor: '#f0f2f5',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: responsiveHeight(2),
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: Colors.primary || '#173a7b',
    padding: responsiveHeight(1.5),
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: responsiveWidth(1),
  },
  formItem: {
    width: '48%',
    marginBottom: responsiveHeight(1),
  },
  tableHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e8e8e8',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
  },
  tableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    width: '12.5%', // 8 columns
    fontSize: responsiveFontSize(1.5),
    textAlign: 'center',
    color: '#333',
  },
  noRecordText: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    textAlign: 'center',
    width: '100%',
    paddingVertical: responsiveHeight(1.5),
  },
});
