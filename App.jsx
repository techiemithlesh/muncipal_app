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
import AssessmentSummary from './src/PropertyMenu/AssessmentSummary';
import PreviewScreen from './src/Screen/PreviewScreen';
import ApplyAssessmentComponentized from './src/PropertyMenu/ApplyAssessmentComponentized';
import { Button, View } from 'react-native';
import ApplyLicense from './src/Trade/ApplyLicense';
import Search from './src/Trade/Search';
import InboxScreen from './src/Trade/InboxScreen';
import TradeLicenseSummary from './src/Trade/TradeLicenseSummary';
import ApplyLicenseSummary from './src/Trade/ApplyLicenseSummary';
import RenewLicense from './src/Trade/RenewLicense';
import { MasterDataProvider } from './src/Context/MasterDataContext';
import SurrenderLicense from './src/Trade/SurrenderLicense';
import SubmitVarification from './src/PropertyMenu/SubmitVarification';
const Stack = createNativeStackNavigator();

const App = ({ navigation }) => {
  return (
    <MasterDataProvider>
      <AlertNotificationRoot>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
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
            <Stack.Screen
              name="AssessmentSummary"
              component={AssessmentSummary}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ApplyAssessmentComponentized"
              component={ApplyAssessmentComponentized}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ApplyLicense"
              component={ApplyLicense}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InboxScreen"
              component={InboxScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TradeLicenseSummary"
              component={TradeLicenseSummary}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ApplyLicenseSummary"
              component={ApplyLicenseSummary}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RenewLicense"
              component={RenewLicense}
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen
              name="ApplyWaterConnection"
              component={ApplyWaterConnectionForm}
              options={{ headerShown: false }}
            /> */}
            <Stack.Screen
              name="SurrenderLicense"
              component={SurrenderLicense}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SubmitVarification"
              component={SubmitVarification}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AlertNotificationRoot>
    </MasterDataProvider>
  );
};

export default App;
