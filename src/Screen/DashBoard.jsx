import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

const DashBoard = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuTree = async () => {
      try {
        const userDetailsStr = await AsyncStorage.getItem('userDetails');
        const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;

        if (userDetails && userDetails.menuTree) {
          setMenuItems(userDetails.menuTree);
        } else {
          setError('Menu data not available. Please login again.');
        }
      } catch (err) {
        setError(
          'Connection failed. If the problem persists, please check your internet connection.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuTree();
  }, []);

  const handleMenuPress = menuItem => {
    switch (menuItem.name) {
      case 'Dashboard':
        // Already on dashboard
        break;
      case 'Property':
        navigation.navigate('Property');
        break;
      case 'Assessment':
      case 'Assesment':
        navigation.navigate('Assessment');
        break;
      case 'Inbox':
        navigation.navigate('Inbox');
        break;
      default:
        console.log('Menu item pressed:', menuItem.name);
    }
  };

  const getIconName = iconName => {
    const iconMap = {
      FaHome: 'home',
      FaInbox: 'inbox',
      FaUser: 'person',
      FaCog: 'settings',
      FaChartBar: 'bar-chart',
      FaFileAlt: 'description',
      FaBuilding: 'business',
      FaCalculator: 'calculate',
      FaClipboardList: 'list',
      FaEnvelope: 'mail',
    };
    return iconMap[iconName] || 'dashboard';
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.box}
        onPress={() => handleMenuPress(item)}
      >
        <View style={styles.iconContainer}>
          <Icon name={getIconName(item.icon)} size={40} color="#4A90E2" />
        </View>
        <Text style={styles.boxText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  if (loading) {
    return (
      <View style={styles.mainDashboard}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainDashboard}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainDashboard}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>{renderMenuItems()}</View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>End of Dashboard</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainDashboard: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#4a90e2',
  },
  iconContainer: {
    marginBottom: 8,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default DashBoard;
