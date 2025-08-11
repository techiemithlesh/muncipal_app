import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { BASE_URL } from '../config';
import Colors from '../Constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selected, setSelected] = useState('email'); // Default to 'email'
  const [showPassword, setShowPassword] = useState(false); // Show/hide password

  const handleLogin = async () => {
    if (selected === null) {
      Alert.alert('Error', 'Please select Email or Username');
      return;
    }

    const loginPayload =
      selected === 'email'
        ? { email, password, type: 'mobile' }
        : { userName, password, type: 'mobile' };

    if (
      (selected === 'email' && !email) ||
      (selected === 'username' && !userName) ||
      !password
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, loginPayload);

      if (response?.data?.data?.token) {
        const { token, userDetails } = response.data.data;
        await AsyncStorage.setItem('token', JSON.stringify(token));
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('DashBoard');
        console.log('Login successful, userDetails:', userDetails);
        console.log('MenuTree data:', userDetails.menuTree);
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Incorrect credentials');
      } else {
        Alert.alert(
          'Login Failed',
          error.response?.data?.message || 'Something went wrong',
        );
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../android/assets/images/background6.webp')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.loginContainer}>
            <Text style={styles.login}>Login</Text>

            {/* Email / Username Selection */}
            <View style={styles.emailuser}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setSelected('email')}
              >
                <View
                  style={[
                    styles.circle,
                    selected === 'email' && styles.selected,
                  ]}
                />
                <Text style={styles.label}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionRow, { marginLeft: 30 }]}
                onPress={() => setSelected('username')}
              >
                <View
                  style={[
                    styles.circle,
                    selected === 'username' && styles.selected,
                  ]}
                />
                <Text style={styles.label}>Username</Text>
              </TouchableOpacity>
            </View>

            {/* Email or Username Input */}
            <View style={styles.emailContainer}>
              <Text>{selected === 'email' ? 'Email' : 'Username'}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter your ${selected}`}
                placeholderTextColor="#000"
                value={selected === 'email' ? email : userName}
                onChangeText={text =>
                  selected === 'email' ? setEmail(text) : setUserName(text)
                }
                keyboardType={
                  selected === 'email' ? 'email-address' : 'default'
                }
              />
            </View>

            {/* Password Field with Eye */}
            <View style={styles.emailContainer}>
              <Text>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#000"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={{ fontSize: 18 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me and Forgot Password */}
            <View style={styles.remfogpass}>
              <TouchableOpacity
                style={[styles.checkbox, checked && styles.checked]}
                onPress={() => setChecked(!checked)}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text>Remember Me</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <View style={styles.emailContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  login: {
    color: Colors.primary,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '800',
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(3),
  },
  loginContainer: {
    justifyContent: 'center',
    padding: 22,
    borderRadius: 10,
    backgroundColor: Colors.background,
    marginTop: responsiveHeight(25),
    marginLeft: responsiveWidth(5),
    marginRight: responsiveWidth(5),
    borderWidth: 2,
    borderColor: 'red',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.65,
    elevation: 10,
  },
  emailuser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    height: responsiveHeight(5),
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
    color: '#000',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  forgotText: {
    color: 'blue',
    marginLeft: responsiveWidth(13),
  },
  remfogpass: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#777',
    marginRight: 10,
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  emailContainer: {
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    height: responsiveHeight(5),
  },
  passwordInput: {
    flex: 1,
    color: '#000',
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
