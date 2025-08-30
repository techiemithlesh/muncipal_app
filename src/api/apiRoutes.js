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

  TRADE_PAY_DEMAND:`${BASE_URL}/api/trade//pay-demand`,
  TRADE_DOCUMENT_DETAILS:`${BASE_URL}/api/trade/get-uploaded-doc-list`,
  TRADE_UPLOAD_DOC:`${BASE_URL}/api/trade/uploaded-doc`,
  TRADE_REVIEW_INBOX:`${BASE_URL}/api/trade/inbox`,
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

export const PROPERTY_API ={
  MASTER_DATA:`${BASE_URL}/api/property/get-saf-master-data`

};

export const HOLDIGN_API_ROUTES ={
  SEARCH_API:`${BASE_URL}/api/property/search-prop`,
  DETAILS_API:`${BASE_URL}/api/property/get-prop-dtl`,
  MASTER_DATA_API:`${BASE_URL}/api/property/get-saf-master-data`,
  DEMAND_API:`${BASE_URL}/api/property/get-prop-demand`,
  PAY_DEMAND_API:`${BASE_URL}/api/property/pay-prop-demand`
};