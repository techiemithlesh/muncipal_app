import { BASE_URL } from "../config";
export const API_ROUTES = {
  // trade api routes
  TRADE_DETAILS: `${BASE_URL}/api/trade/get-dtl`,
  TRADE_SEARCH: `${BASE_URL}/api/trade/search`,
  TRADE_MASTER_DETAILS:`${BASE_URL}/api/trade/get-trade-master-data`,
  TRADE_DUE_DETAILS:`${BASE_URL}/api/trade/get-due`,
  TRADE_PAYMENT:`${BASE_URL}/api/trade/pay-demand`,
  TRADE_PAYMENT_RECEIPT:`${BASE_URL}/api/trade/payment-receipt`,
  TRADE_REVIEW_TAX:`${BASE_URL}/api/trade/review-tax`,
  TRADE_APPLY:`${BASE_URL}/api/trade/apply`,

  
  
};


export const SAF_API_ROUTES = {
  // trade api routes
  SAF_VARIFICATION_MODEL: `${BASE_URL}/api/property/field-verification-dtl`,
  TRADE_SEARCH: `${BASE_URL}/api/trade/search`,
  TRADE_MASTER_DETAILS:`${BASE_URL}/api/trade/get-trade-master-data`,
  TRADE_DUE_DETAILS:`${BASE_URL}/api/trade/get-due`,
  TRADE_PAYMENT:`${BASE_URL}/api/trade/pay-demand`,
  TRADE_PAYMENT_RECEIPT:`${BASE_URL}/api/trade/payment-receipt`,
};


export const WORK_FLOW_PERMISSION = `${BASE_URL}/api/get-workflow-permission`;