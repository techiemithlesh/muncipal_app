import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Colors from '../Constants/Colors';
import { showToast } from '../utils/toast';

const LogoutButton = () => {
  const navigation = useNavigation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userDetails');
      await AsyncStorage.removeItem('tokenExpiry');

      showToast('success', 'Logged out successfully!');

      navigation.navigate('LoginScreen');
    } catch (error) {
      showToast('error', 'Logout failed!');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowConfirm(true)}
      >
        <Text style={styles.icon}>Logout</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
    width: 50,
    height: 30,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 20,
  },
  icon: {
    color: Colors.primary,
    fontSize: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: Colors.primary,
  },
  cancelText: {
    color: '#000',
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
