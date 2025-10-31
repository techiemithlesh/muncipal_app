import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

const PaymentWiseReport = () => {
  const [wardOptions, setWardOptions] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [datas, setData] = useState({});
  const [details, setDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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

  const collectorOptions = [
    { label: 'Mithlesh Patel', value: '62' },
    { label: 'Jubali Kumari', value: '63' },
  ];

  //   const wardOptions = [
  //     { label: '1', value: '1' },
  //     { label: '2', value: '2' },
  //     { label: '3', value: '3' },
  //   ];

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

      const response = await axios.post(
        PROPERTY_REPORTS_API.PAYMENT_MODE_WISE_REPORT_API,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const responseData = response.data;
      console.log('Report Data:', responseData);
      setLastPage(responseData.lastPage || 1);

      setData(responseData.data || {});

      if (isLoadMore) {
        setDetails(prev => [...prev, ...(responseData.data?.totalTran || [])]);
      } else {
        setDetails(responseData.data?.totalTran || []);
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

  // --- Summary Card Component with Table Design ---
  const SummaryCard = ({ title, data }) => {
    const getTotalAmount = () => {
      return data
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
        .toFixed(2);
    };

    return (
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>{title}</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.paymentModeColumn]}>
            Payment Mode
          </Text>
          <Text style={[styles.tableHeaderText, styles.countColumn]}>
            Count
          </Text>
          <Text style={[styles.tableHeaderText, styles.amountColumn]}>
            Amount
          </Text>
        </View>

        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.paymentModeColumn]}>
              {item.paymentMode}
            </Text>
            <Text style={[styles.tableCell, styles.countColumn]}>
              {item.count}
            </Text>
            <Text style={[styles.tableCell, styles.amountColumn]}>
              {item.amount}
            </Text>
          </View>
        ))}

        {/* Total Row */}
        {/* <View style={styles.totalRow}>
          <Text style={[styles.totalText, styles.paymentModeColumn]}>
            Total
          </Text>
          <Text style={[styles.totalText, styles.countColumn]}>
            {data.reduce((sum, item) => sum + parseInt(item.count || 0), 0)}
          </Text>
          <Text style={[styles.totalText, styles.amountColumn]}>
            {getTotalAmount()}
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderNavigation />

      {/* Search Filters */}
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

      {/* Summary Cards */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          {datas?.doorToDoor && (
            <SummaryCard
              title="Door to Door Collection"
              data={datas.doorToDoor}
            />
          )}
          {datas?.totalRefund && (
            <SummaryCard title="Total Refund" data={datas.totalRefund} />
          )}
          {datas?.totalTran && (
            <SummaryCard title="Total Transaction" data={datas.totalTran} />
          )}
          {datas?.netCollection && (
            <View style={styles.tableCard}>
              <Text style={styles.tableTitle}>Net Collection</Text>

              <View style={styles.tableHeader}>
                <Text
                  style={[styles.tableHeaderText, styles.paymentModeColumn]}
                >
                  Payment Mode
                </Text>
                <Text style={[styles.tableHeaderText, styles.countColumn]}>
                  Count
                </Text>
                <Text style={[styles.tableHeaderText, styles.amountColumn]}>
                  Amount
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.paymentModeColumn]}>
                  Net Collection
                </Text>
                <Text style={[styles.tableCell, styles.countColumn]}>
                  {datas.netCollection.count}
                </Text>
                <Text style={[styles.tableCell, styles.amountColumn]}>
                  {datas.netCollection.amount}
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default PaymentWiseReport;

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
  row: { flexDirection: 'row' },
  inputContainer: {
    width: '50%',
    paddingHorizontal: rw(1),
    marginBottom: rh(1),
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
  tableCard: {
    backgroundColor: '#fff',
    marginHorizontal: rw(2),
    marginVertical: rh(1),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: rf(2),
    fontWeight: 'bold',
    paddingVertical: rh(1),
    paddingHorizontal: rw(3),
    backgroundColor: '#f8f9fa',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    paddingVertical: rh(1),
    paddingHorizontal: rw(3),
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: rf(1.6),
    color: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: rh(1),
    paddingHorizontal: rw(3),
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableCell: { fontSize: rf(1.5), color: '#495057' },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: rh(1),
    paddingHorizontal: rw(3),
    backgroundColor: '#f8f9fa',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
  },
  totalText: { fontWeight: 'bold', fontSize: rf(1.6), color: '#212529' },
  paymentModeColumn: { flex: 2, textAlign: 'left' },
  countColumn: { flex: 1, textAlign: 'center' },
  amountColumn: { flex: 1, textAlign: 'right' },
});
