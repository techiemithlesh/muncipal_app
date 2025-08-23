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
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderNavigation from '../Components/HeaderNavigation';
import { BASE_URL } from '../config';
const InboxScreen = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log(token, 'our token');

        const body = {
          perPage: 20,
          page: 1,
          keyWord: 'a',
          wardId: [1, 2, 3],
        };

        if (!token) {
          console.warn('No token found');
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/api/trade/inbox`,
          body, // <-- passing body here
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const list = response.data?.data?.data || [];
        console.log('List:', list);

        console.log('Fetched Data:', response.data?.data);
        setData(response.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(data, 'data');

  const renderEmpty = () => (
    <View style={styles.emptyRow}>
      <Text style={styles.mutedText}>No records found.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
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
              applicationNo={item.applicationNo}
              wardNo={item.wardNo}
              firmType={item.firmType}
              ownerName={item.ownerName}
              applyDate={item.applyDate}
              address={item.address}
              natureOfBusiness={item.natureOfBusiness}
              onPress={() =>
                navigation.navigate(
                  'LicenseVerificationScreen',
                  { id: item.id },
                  console.log(item.id, 'my id'),
                )
              }
            />
          )}
        />
      </View>
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
