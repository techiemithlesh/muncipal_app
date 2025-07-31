import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../Constants/Colors';
import Header from '../Screen/Header';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { BASE_URL } from '../config';
const SearchAssesment = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [value, setValue] = useState(); // ward id
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      {/* Row with Apply Date and Application Status */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <Text style={[styles.label, { flex: 1 }]}>
          Apply Date: <Text style={styles.value}>{item.applyDate}</Text>
        </Text>
        <Text style={[styles.label, { flex: 1, textAlign: 'right' }]}>
          Status: <Text style={styles.value}>{item.appStatus}</Text>
        </Text>
      </View>

      <Text style={styles.label}>
        🏷️ SL No: <Text style={styles.value}>{index + 1}</Text>
      </Text>
      <Text style={styles.label}>
        🏠 Ward No: <Text style={styles.value}>{item.wardNo}</Text>
      </Text>
      <Text style={styles.label}>
        🆕 New Ward No: <Text style={styles.value}>{item.newWardNo}</Text>
      </Text>
      <Text style={styles.label}>
        📄 Application No: <Text style={styles.value}>{item.safNo}</Text>
      </Text>
      <Text style={styles.label}>
        🏢 Assessment Type:{' '}
        <Text style={styles.value}>{item.assessmentType}</Text>
      </Text>
      <Text style={styles.label}>
        👤 Owner: <Text style={styles.value}>{item.ownerName}</Text>
      </Text>
      <Text style={styles.label}>
        👨‍👩‍👧 Guardian Name: <Text style={styles.value}>{item.guardianName}</Text>
      </Text>

      <Text style={styles.label}>
        🏡 Property Type: <Text style={styles.value}>{item.propertyType}</Text>
      </Text>
      <Text style={styles.label}>
        📍 Address: <Text style={styles.value}>{item.propAddress}</Text>
      </Text>
      <Text style={styles.label}>
        📞 Mobile: <Text style={styles.value}>{item.mobileNo}</Text>
      </Text>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const handleViewPress = item => {
    console.log('View button clicked:', item);
    navigation.navigate('SafDueDetails', { id: item.id });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log(token);

        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const ubid = response.data.data.wardList.ubid || [];
        console.log(ubid,"my ub")
        console.log(ubid,"i am passing data to all")
        console.log(response.data.data,"i am passing data to all")
        setMasterData(response.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const wardDropdownOptions = (masterData?.wardList || []).map(item => ({
    label: item.wardNo,
    value: item.id,
  }));
  const onPress = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const body = {
        perPage: 5,
        page: 1,
        keyWord: keyword?.trim() || '', // send blank if empty
        wardId: value ? [value] : [], // send empty array if not selected
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/search-saf`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.status) {
        setSearchResults(response.data.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search API error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView>
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
              placeholder="Select Ward"
              value={value}
              onChange={item => setValue(item.value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Search Keyword"
              placeholderTextColor="black"
              value={keyword}
              onChangeText={text => setKeyword(text)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={renderItem}
              contentContainerStyle={{
                marginTop: responsiveHeight(2),
                paddingBottom: responsiveHeight(5),
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchAssesment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  seacrhCont: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: Colors.borderColor,
  },
  searchhead: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: responsiveHeight(2),
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
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(10),
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
    borderRadius: 12,
    padding: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.textPrimary,
    fontWeight: 500,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: responsiveHeight(1.5),
    marginVertical: responsiveHeight(1),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    color: Colors.textPrimary,
    fontSize: responsiveFontSize(1.8),
    marginBottom: 3,
  },
  slNoText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: responsiveHeight(1),
    alignSelf: 'flex-end',
  },
  label: {
    fontSize: responsiveFontSize(1.9),
    color: '#333',
    marginBottom: responsiveHeight(0.5),
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  viewButton: {
    marginTop: responsiveHeight(1),
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
