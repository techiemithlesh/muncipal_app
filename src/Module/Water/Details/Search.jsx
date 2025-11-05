// Search.jsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
import { WATER_API_ROUTES, API_ROUTES } from '../../../api/apiRoutes';
import Pagination from '../../../Components/Pagination';

const Search = ({ navigation }) => {
  const [value, setValue] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState(null);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // 🟩 Pagination States
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setLoadingMaster(true);
        const token = await getToken();
        if (!token) {
          Alert.alert('Auth error', 'No token found. Please login.');
          setLoadingMaster(false);
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

          const wards = Array.isArray(data.wardList) ? data.wardList : [];
          const wardOptions = wards.map(w => ({
            label: w.wardNo?.toString() ?? 'N/A',
            value: w.id,
          }));
          setWardDropdownOptions(wardOptions);
        } else {
          setMasterData(null);
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

  // 🔹 Search Function with Pagination
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

      const response = await axios.post(WATER_API_ROUTES.WATER_SEARCH, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const handleViewPress = item => {
    navigation.navigate('WaterDetails', { id: item.id });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.row}>
        <Text style={styles.label}>Apply Date:</Text>
        <Text style={styles.value}>{item.applyDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{item.appStatus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>SL No:</Text>
        <Text style={styles.value}>{index + 1}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ward No:</Text>
        <Text style={styles.value}>{item.wardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>New Ward No:</Text>
        <Text style={styles.value}>{item.newWardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Application No:</Text>
        <Text style={styles.value}>{item.applicationNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Owner Name:</Text>
        <Text style={styles.value}>{item.ownerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Guardian Name:</Text>
        <Text style={styles.value}>{item.guardianName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text
          style={[styles.value, { flex: 1, textAlign: 'right' }]}
          numberOfLines={2}
        >
          {item.address}
        </Text>
      </View>
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{item.mobileNo}</Text>
      </View>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.seacrhCont}>
      <View style={styles.searchhead}>
        <Text style={styles.text}>Search Application</Text>
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
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <View style={styles.container}>
        {renderHeader()}

        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          // ListHeaderComponent={renderHeader}
          ListFooterComponent={
            <>
              {loadingSearch && (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ marginVertical: 10 }}
                />
              )}

              {searchResults.length > 0 && !loadingSearch && (
                <Pagination
                  page={page}
                  lastPage={lastPage}
                  total={total}
                  onNext={() => search(page + 1)}
                  onPrev={() => search(page - 1)}
                />
              )}
            </>
          }
          contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}
        />
      </View>
    </View>
  );
};

export default Search;

// same styles as yours below

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  seacrhCont: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(3),
    borderColor: Colors.borderColor,
    borderWidth: 1, // optional, adds border around
    borderRadius: 5, // makes shadow and border look nice
    height: 200,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // shadow direction
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: responsiveHeight(10),
    // Android shadow
    elevation: 5,
    backgroundColor: '#fff', // required on Android to see elevation
  },

  searchhead: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(1),
    marginBottom: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // makes shadow go down
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,

    // Optional: rounded corners to make shadow fully visible
    borderRadius: 5,
    overflow: 'visible', // ensures shadow isn't clipped
  },

  text: {
    color: Colors.background,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveHeight(1),
    marginRight: responsiveWidth(5),
  },
  optionLabel: {
    fontSize: responsiveFontSize(1.9),
    color: Colors.textPrimary,
    marginLeft: responsiveWidth(1.5),
  },
  circle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselected: {
    backgroundColor: 'transparent',
    borderColor: Colors.borderColor,
  },
  selected: {
    backgroundColor: Colors.borderColor,
    borderColor: Colors.borderColor,
  },
  innerDot: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
    backgroundColor: Colors.background,
  },
  dropdown: {
    height: responsiveHeight(5),
    width: responsiveWidth(40),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: responsiveWidth(2),
  },
  input: {
    width: responsiveWidth(40),
    height: responsiveHeight(5),
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectWardKey: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1.5),
  },
  button: {
    backgroundColor: Colors.borderColor,
    paddingVertical: responsiveHeight(1),
    // paddingHorizontal: responsiveWidth(1),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
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
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
