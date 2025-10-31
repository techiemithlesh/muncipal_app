import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { PROPERTY_REPORTS_API } from '../../../api/apiRoutes';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
import { useMasterData } from '../../../Context/MasterDataContext';

const CollectionReport = () => {
  const [wardOptions, setWardOptions] = useState([]);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [datas, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const collectorOptions = [
    { label: 'Mithlesh Patel', value: '62' },
    { label: 'Jubali Kumari', value: '63' },
  ];

  const { wardList, ownershipType, propertyTypeList } = useMasterData();

  useEffect(() => {
    if (wardList && wardList.length > 0) {
      const wards = wardList.map(item => ({
        label: item.wardNo,
        value: item.id,
      }));
      setWardOptions(wards);
      console.log('✅ Ward Options:', wards);
    }
  }, [wardList]);

  const paymentModeOptions = [
    { label: 'CASH', value: 'CASH' },
    { label: 'DD', value: 'DD' },
    { label: 'ONLINE', value: 'ONLINE' },
  ];

  const fetchReport = async (pageNo = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const token = await getToken();

      const payload = {
        page: pageNo,
        perPage: 10,
        key: null,
        fromDate: fromDate ? fromDate.toISOString().split('T')[0] : '',
        uptoDate: toDate ? toDate.toISOString().split('T')[0] : '',
        wardId: selectedWard ? Number(selectedWard) : null,
        paymentMode: selectedMode || null,
        userId: selectedCollector || null,
        appType: null,
      };
      console.log('Payload:', payload);

      const response = await axios.post(
        PROPERTY_REPORTS_API.COLLECTION_REPORT_API,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const responseData = response.data.data;
      setLastPage(responseData.lastPage || 1);

      if (isLoadMore) {
        setData(prev => [...prev, ...responseData.data]);
      } else {
        setData(responseData.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReport(1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchReport(1);
  };

  const loadMore = () => {
    if (page < lastPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReport(nextPage, true);
    }
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>SAF No</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Owner</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Mobile</Text>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Ward</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Payment Mode</Text>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Demand</Text>
      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Payable</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Tran No</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Date</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Collected By</Text>
      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Action</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.safNo}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.ownerName}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.mobileNo}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.wardNo}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.paymentMode}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.demandAmt}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.payableAmt}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.tranNo}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.tranDate}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.userName}</Text>
      <TouchableOpacity
        style={{
          flex: 2,
          backgroundColor: '#a1a3edff', // your desired color
          justifyContent: 'center', // vertically center text
          alignItems: 'center', // horizontally center text
          paddingVertical: 2, // optional padding
          borderRadius: 5, // optional rounded corners
        }}
        onPress={() => {
          console.log('View pressed!');
          // Add your navigation or action here
        }}
      >
        <Text style={styles.tableCell}>View</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <HeaderNavigation />

      {/* Search Card */}
      <View style={styles.searchCard}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>From Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowFromPicker(true)}
            >
              <Text>{fromDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowFromPicker(false);
                  if (date) setFromDate(date);
                }}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowToPicker(true)}
            >
              <Text>{toDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowToPicker(false);
                  if (date) setToDate(date);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Collector</Text>
            <Dropdown
              data={collectorOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Collector"
              value={selectedCollector}
              onChange={item => setSelectedCollector(item.value)}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ward</Text>
            <Dropdown
              data={wardOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Ward"
              value={selectedWard}
              onChange={item => setSelectedWard(item.value)}
              style={styles.dropdown}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Payment Mode</Text>
            <Dropdown
              data={paymentModeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Payment Mode"
              value={selectedMode}
              onChange={item => setSelectedMode(item.value)}
              style={styles.dropdown}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.cardSearchButton}
          onPress={handleSearch}
        >
          <Text style={styles.cardSearchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Table List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={datas}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          ListHeaderComponent={<TableHeader />}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: 80 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default CollectionReport;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  searchCard: {
    backgroundColor: '#fff',
    marginHorizontal: rw(1),
    marginTop: rh(0.5),
    borderRadius: 6,
    paddingVertical: rh(0.8),
    paddingHorizontal: rw(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    width: '50%',
    paddingHorizontal: rw(1),
  },
  label: {
    fontSize: rf(1.6),
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(3),
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: rh(6),
    paddingHorizontal: rw(3),
    backgroundColor: '#fff',
  },
  cardSearchButton: {
    backgroundColor: Colors.primary || '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(1.2),
    marginTop: rh(1),
  },
  cardSearchText: {
    color: '#fff',
    fontSize: rf(2),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: rh(1),
    paddingHorizontal: rw(1),
    marginHorizontal: rw(1),
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8,
    paddingHorizontal: rw(1),
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: rh(1),
    paddingHorizontal: rw(1),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 8,

    color: '#333',
    paddingHorizontal: rw(1),
  },
});
