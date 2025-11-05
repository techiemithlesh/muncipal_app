import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../Constants/Colors';
import HeaderNavigation from '../../Components/HeaderNavigation';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_ROUTES, CUSTOMER_API } from '../../api/apiRoutes';
import { getToken } from '../../utils/auth';
import Pagination from '../../Components/Pagination';

const Search = ({ navigation }) => {
  const [value, setValue] = useState(null); // selected ward id
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState(null);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🟢 Fetch Master Data (Wards)
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setLoadingMaster(true);
        const token = await getToken();
        if (!token) {
          Alert.alert('Auth error', 'No token found. Please login.');
          return;
        }

        const response = await axios.post(
          API_ROUTES.TRADE_MASTER_DETAILS,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.status && response.data.data) {
          const data = response.data.data;
          setMasterData(data);
          const wardOptions = (data.wardList || []).map(w => ({
            label: w.wardNo?.toString() ?? 'N/A',
            value: w.id,
          }));
          setWardDropdownOptions(wardOptions);
        } else {
          setWardDropdownOptions([]);
        }
      } catch (error) {
        console.error('Fetch master data error:', error);
        Alert.alert('Error', 'Failed to fetch master data.');
      } finally {
        setLoadingMaster(false);
      }
    };

    fetchMaster();
  }, []);

  // 🟢 Search Function with Pagination
  const search = async (pageNo = 1) => {
    try {
      setLoadingSearch(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Auth error', 'No token found. Please login.');
        return;
      }

      const body = {
        perPage: 5,
        page: pageNo,
        keyWord: keyword?.trim() || '',
        wardId: value ? [value] : [],
      };

      const response = await axios.post(
        CUSTOMER_API.CUSTOMER_SEARCH_API,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data?.status) {
        const results = response.data.data?.data ?? [];
        setSearchResults(results);
        setPage(pageNo);
        setLastPage(response.data.data?.lastPage || 1);
        setTotal(response.data.data?.total || 0);
      } else {
        setSearchResults([]);
        Alert.alert('Search', response.data?.message || 'No results found');
      }
    } catch (error) {
      console.error('Search API error:', error);
      Alert.alert('Error', 'Failed to perform search.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleViewPress = item =>
    navigation.navigate('CustomerDetails', { id: item.id });

  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.row}>
        <Text style={styles.label}>SL No:</Text>
        <Text style={styles.value}>{index + 1 + (page - 1) * 5}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ward No:</Text>
        <Text style={styles.value}>{item.wardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Consumer No:</Text>
        <Text style={styles.value}>{item.consumerNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{item.ownerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={[styles.value, { flex: 1, textAlign: 'right' }]}>
          {item.address}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />

      {/* 🔵 SEARCH UI OUTSIDE FLATLIST (Fixes Input Focus Issue) */}
      <View style={styles.searchCont}>
        <View style={styles.searchhead}>
          <Text style={styles.text}>Search Consumer</Text>
        </View>

        <View style={styles.selectWardKey}>
          <Dropdown
            style={styles.dropdown}
            data={wardDropdownOptions}
            labelField="label"
            valueField="value"
            placeholder={loadingMaster ? 'Loading wards...' : 'Select Ward'}
            value={value}
            onChange={item => setValue(item.value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Search Keyword"
            placeholderTextColor="black"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => search(1)}>
          <Text style={styles.buttonText}>
            {loadingSearch ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>

        {searchResults.length === 0 && !loadingSearch && (
          <Text style={styles.noResults}>No results to show</Text>
        )}
      </View>

      {/* 🔵 RESULT LIST */}
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <>
            {loadingSearch && (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{ marginVertical: 15 }}
              />
            )}
            {searchResults.length > 0 && !loadingSearch && (
              <Pagination
                page={page}
                lastPage={lastPage}
                total={total}
                onNext={() => search(page + 1)}
                onPrev={() => search(page - 1)}
                onPageChange={(pageNo) => search(pageNo)}
              />
            )}
          </>
        }
        contentContainerStyle={{ paddingBottom: responsiveHeight(8) }}
      />
    </View>
  );
};

export default Search;

// 🧾 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchCont: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    margin: responsiveWidth(3),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
  },
  searchhead: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(1),
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  text: {
    color: Colors.background,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  selectWardKey: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5),
  },
  dropdown: {
    height: responsiveHeight(5),
    width: responsiveWidth(40),
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    width: responsiveWidth(40),
    height: responsiveHeight(5),
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1),
    borderRadius: 6,
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(1),
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.8),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
    width: '45%',
    fontWeight: '500',
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    color: '#111',
    width: '55%',
    textAlign: 'right',
    fontWeight: '600',
  },
  viewButton: {
    marginTop: responsiveHeight(1),
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1),
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: responsiveWidth(5),
  },
  viewButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
