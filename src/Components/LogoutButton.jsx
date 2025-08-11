import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Colors from '../Constants/Colors';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userDetails');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            }),
          );
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.icon}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
    width: 50, // square button
    height: 30,
    justifyContent: 'center',
    marginLeft: 'auto', // align to the right
    marginRight: 20,
  },
  icon: {
    color: Colors.primary,
    fontSize: 10,
    textAlign: 'center',
  },
});
