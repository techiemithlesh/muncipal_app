// components/HeaderNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Constants/Colors';
import LogoutButton from './LogoutButton';
import LeftSidebar from '../Screen/LeftSidebar';
const HeaderNavigation = ({ title, showBack = true, customBackAction }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      navigation.goBack();
    }
  };

  const handleHome = () => {
    navigation.navigate('DashBoard'); // Adjust this to your home screen name
  };

  return (
    <View style={styles.container}>
      {/* Conditional rendering for back button */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.navButtonPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={handleHome} style={styles.navButton}>
        <Text style={styles.navText}>🏠</Text>
      </TouchableOpacity>
      {/* Logout button */}
      <LogoutButton />
    </View>
  );
};

export default HeaderNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 100,
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: Colors.primary,
    borderBottomWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navButton: {
    backgroundColor: '#ffffff20', // transparent white overlay
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navButtonPlaceholder: {
    width: 60, // To keep title centered
  },
  navText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
