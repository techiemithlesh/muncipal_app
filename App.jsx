import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { MasterDataProvider } from './src/Context/MasterDataContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';

// Screens
import DashBoard from './src/Screen/DashBoard';
import StaffCard from './src/Screen/StaffCard';
import Property from './src/Screen/Property';
import Assessment from './src/Screen/Assessment';
import Inbox from './src/Screen/Inbox';
import FieldVarification from './src/PropertyMenu/FieldVarification';
import SurveyPage from './src/PropertyMenu/SurveyPage';
import ForgotPassword from './src/Screen/ForgetPassword';
import VerifiedStatus from './src/PropertyMenu/VerifiedStatus';
import SearchAssesment from './src/PropertyMenu/SearchAssesment';
import SafDueDetails from './src/PropertyMenu/SafDueDetails';
import ApplyAssessment from './src/PropertyMenu/ApplyAssessment';
import AssessmentSummary from './src/PropertyMenu/AssessmentSummary';
import ApplyAssessmentComponentized from './src/PropertyMenu/ApplyAssessmentComponentized';
import ApplyLicense from './src/Trade/ApplyLicense';
import Search from './src/Trade/Details/Search';
import InboxScreen from './src/Trade/Inbox/InboxScreen';
import TradeDetails from './src/Trade/Details/TradeDetails';
import ApplyLicenseSummary from './src/Trade/ApplyLicenseSummary';
import SubmitVarification from './src/PropertyMenu/SubmitVarification';
import DocUpload from './src/Trade/DocUpload';
import ApplyWaterConnectionForm from './src/Water/ApplyWater/ApplyWaterConnectionForm';
import LoginScreen from './src/Screen/LoginScreen';
import SearchWater from './src/Water/SearchWater';
import WaterBillScreen from './src/Water/WaterBillScreen';
import SurrenderLicense from './src/Trade/Surender/SurrenderLicense';
import SurrenderLicensePage from './src/Trade/Surender/SurrenderLicensePage';
import RenewLicensePage from './src/Trade/Renew/RenewLicensePage';
import RenewLicense from './src/Trade/Renew/RenewLicense';
import EditTrade from './src/Trade/Details/EditTrade';
import InboxDtls from './src/Trade/Inbox/InboxDtls';
import SearchHolding from './src/PropertyMenu/Holding/Search';
import HoldingDetails from './src/PropertyMenu/Holding/HoldingDetails';
import RessesmentSummry from './src/PropertyMenu/SubmitData/RessesmentSummry';
import SubmitApply from './src/Water/ApplyWater/SubmitApply';
import MyInput from './src/Water/ApplyWater/MyInput';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                name="TradeDetails"
                component={TradeDetails}
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
              <Stack.Screen
                name="ApplyWaterConnection"
                component={ApplyWaterConnectionForm}
                options={{ headerShown: false }}
              />
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
              <Stack.Screen
                name="DocUpload"
                component={DocUpload}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SearchWater"
                component={SearchWater}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="WaterBillScreen"
                component={WaterBillScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SurrenderLicensePage"
                component={SurrenderLicensePage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RenewLicensePage"
                component={RenewLicensePage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditTrade"
                component={EditTrade}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InboxDtls"
                component={InboxDtls}
                options={{ headerShown: false }}
              />
              {/* Holding Navigators */}
              <Stack.Screen
                name="SearchHolding"
                component={SearchHolding}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HoldingDetails"
                component={HoldingDetails}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RessesmentSummry"
                component={RessesmentSummry}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SubmitApply"
                component={SubmitApply}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MyInput"
                component={MyInput}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AlertNotificationRoot>
      </MasterDataProvider>

      {/* 👇 Toast outside everything, stays above Modals */}
      <Toast
        config={toastConfig}
        topOffset={60}
        visibilityTime={2500}
        position="top"
      />
    </GestureHandlerRootView>
  );
};

export default App;
