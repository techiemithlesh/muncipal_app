import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screen/LoginScreen';
import DashBoard from './src/Screen/DashBoard';
import StaffCard from './src/Screen/StaffCard';
import Property from './src/Screen/Property';
import Assessment from './src/Screen/Assessment';
import Inbox from './src/Screen/Inbox';
import FieldVarification from './src/PropertyMenu/FieldVarification';
import PropertyAssessmentForm from './src/PropertyMenu/WardCard';
import SurveyPage from './src/PropertyMenu/SurveyPage';
import ForgotPassword from './src/Screen/ForgetPassword';
import VerifiedStatus from './src/PropertyMenu/VerifiedStatus';
import SearchAssesment from './src/PropertyMenu/SearchAssesment';
import SafDueDetails from './src/PropertyMenu/SafDueDetails';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ApplyAssessment from './src/PropertyMenu/ApplyAssessment';

import PreviewScreen from './src/Screen/PreviewScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AlertNotificationRoot>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            contentStyle: { backgroundColor: 'orange' },
            headerStyle: { backgroundColor: 'orange' },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DashBoard"
            component={DashBoard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StaffCard"
            component={StaffCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SurveyPage"
            component={SurveyPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Property"
            component={Property}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Assessment"
            component={Assessment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Inbox"
            component={Inbox}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FieldVarification"
            component={FieldVarification}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VerifiedStatus"
            component={VerifiedStatus}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SearchAssesment"
            component={SearchAssesment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SafDueDetails"
            component={SafDueDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ApplyAssessment"
            component={ApplyAssessment}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertNotificationRoot>
  );
};

export default App;
