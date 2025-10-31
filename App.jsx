import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { MasterDataProvider } from './src/Context/MasterDataContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
// Reports All Urls
import PropertyCollection from './src/Module/PropertyMenu/Report/Collection';
import PaymentWiseReportPorpty from './src/Module/PropertyMenu/Report/PaymentWiseReport';
// Water Url Screenimport

import WaterInbox from './src/Module/Water/Inbox/Inbox';
import WaterSurvey from './src/Module/Water/Inbox/WaterSurvey';
import SubmitSurey from './src/Module/Water/Inbox/SubmitSurey';
import MutationScreen from './src/Module/PropertyMenu/Saf/SubmitData/Verification/MutationScreen';
// Screens
import DashBoard from './src/Screen/DashBoard';
import StaffCard from './src/Screen/StaffCard';
import Property from './src/Screen/Property';
import Assessment from './src/Screen/Assessment';
import Inbox from './src/Screen/Inbox';
import FieldVarification from './src/Module/PropertyMenu/Saf/FieldVarification';
import SurveyPage from './src/Module/PropertyMenu/Saf/SurveyPage';
import ForgotPassword from './src/Screen/ForgetPassword';
import VerifiedStatus from './src/Module/PropertyMenu/Saf/VerifiedStatus';
import SearchAssesment from './src/Module/PropertyMenu/Saf/SearchAssesment';
import SafDueDetails from './src/Module/PropertyMenu/Saf/SafDueDetails';
import ApplyAssessment from './src/Module/PropertyMenu/Saf/ApplyAssessment';
import AssessmentSummary from './src/Module/PropertyMenu/Saf/AssessmentSummary';
import ApplyAssessmentComponentized from './src/Module/PropertyMenu/Saf/ApplyAssessmentComponentized';
import ApplyLicense from './src/Module/Trade/ApplyLicense';
import Search from './src/Module/Trade/Details/Search';
import InboxScreen from './src/Module/Trade/Inbox/InboxScreen';
import TradeDetails from './src/Module/Trade/Details/TradeDetails';
import ApplyLicenseSummary from './src/Module/Trade/ApplyLicenseSummary';
import SubmitVarification from './src/Module/PropertyMenu/Saf/SubmitVarification';
import DocUpload from './src/Module/Trade/DocUpload';
import ApplyWaterConnectionForm from './src/Module/Water/ApplyWater/ApplyWaterConnectionForm';
import LoginScreen from './src/Screen/LoginScreen';
import SearchWater from './src/Module/Water/Details/Search';
import WaterDetails from './src/Module/Water/Details/Details';
// import WaterBillScreen from './src/Module/Water/WaterBillScreen';
import SurrenderLicense from './src/Module/Trade/Surender/SurrenderLicense';
import SurrenderLicensePage from './src/Module/Trade/Surender/SurrenderLicensePage';
import RenewLicensePage from './src/Module/Trade/Renew/RenewLicensePage';
import RenewLicense from './src/Module/Trade/Renew/RenewLicense';
import InboxDtls from './src/Module/Trade/Inbox/InboxDtls';
import SearchHolding from './src/Module/PropertyMenu/Holding/Search';
import HoldingDetails from './src/Module/PropertyMenu/Holding/HoldingDetails';
import RessesmentSummry from './src/Module/PropertyMenu/Saf/SubmitData/RessesmentSummry';
import SubmitApply from './src/Module/Water/ApplyWater/SubmitApply';
import MyInput from './src/Module/Water/ApplyWater/MyInput';
// customer urls
import SearchCustomer from './src/Module/Customer/Search';

import Amedment from './src/Module/Trade/Amedment/Amedment';
import AmedmentSummery from './src/Module/Trade/Amedment/AmedmentSummery';

import CustomerDetails from './src/Module/Customer/Details';
import SubmitSummaryPage from './src/Module/PropertyMenu/Saf/SubmitData/Verification/SubmitSummaryPage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MasterDataProvider>
        <AlertNotificationRoot>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ gestureEnabled: false }}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="DashBoard"
                component={DashBoard}
                options={{
                  gestureEnabled: false,
                  headerShown: false,
                  headerBackVisible: false,
                }}
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
              <Stack.Screen
                name="WaterDetails"
                component={WaterDetails}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SearchCustomer"
                component={SearchCustomer}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="CustomerDetails"
                component={CustomerDetails}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="SubmitSummaryPage"
                component={SubmitSummaryPage}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="WaterInbox"
                component={WaterInbox}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="WaterSurvey"
                component={WaterSurvey}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="SubmitSurey"
                component={SubmitSurey}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="PropertyCollection"
                component={PropertyCollection}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaymentWiseReportPorpty"
                component={PaymentWiseReportPorpty}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MutationScreen"
                component={MutationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Amedment"
                component={Amedment}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="AmedmentSummery"
                component={AmedmentSummery}
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
