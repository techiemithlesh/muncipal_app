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
  TRADE_PAY_DEMAND:`${BASE_URL}/api/trade/pay-demand`,
  TRADE_DOCUMENT_DETAILS:`${BASE_URL}/api/trade/get-uploaded-doc-list`,
  TRADE_UPLOAD_DOC:`${BASE_URL}/api/trade/uploaded-doc`,
  TRADE_REVIEW_INBOX:`${BASE_URL}/api/trade/inbox`,
  TRADE_APPLY:`${BASE_URL}/api/trade/apply`,
};
export const SAF_API_ROUTES = {
  SAF_VARIFICATION_MODEL: `${BASE_URL}/api/property/field-verification-dtl`,
  APPLY_SAF: `${BASE_URL}/api/property/saf-apply`,
  APPLY_SAF_RESSESMENT_API: `${BASE_URL}/api/property/saf-apply Reassessment`,
  SEND_TO_LEVEL_API: `${BASE_URL}/api/property/post-next`,
};
export const WORK_FLOW_PERMISSION = `${BASE_URL}/api/get-workflow-permission`;
export const PROPERTY_API = {
  MASTER_DATA: `${BASE_URL}/api/property/get-saf-master-data`,
  FIELD_VARIFICATION_API: `${BASE_URL}/api/property/field-verification`,
  GEOTAGING_IMAGE_API: `${BASE_URL}/api/property/geotage`,
  APARTMENT_API: `${BASE_URL}/api/property/get-apartment-by-old-ward`, // 👈 added missing slash
};
export const HOLDIGN_API_ROUTES ={
  SEARCH_API:`${BASE_URL}/api/property/search-prop`,
  DETAILS_API:`${BASE_URL}/api/property/get-prop-dtl`,
  MASTER_DATA_API:`${BASE_URL}/api/property/get-saf-master-data`,
  DEMAND_API:`${BASE_URL}/api/property/get-prop-demand`,
  PAY_DEMAND_API:`${BASE_URL}/api/property/pay-prop-demand`
};

export const WATER_API_ROUTES ={
  WATER_SEARCH_API:`${BASE_URL}/api/water/app/search`,
  WATER_DETAILS_API:`${BASE_URL}/api/water/app/dtl`,
  WATER_DUE_API:`${BASE_URL}/api/water/app/due`,
  PAY_DEMAND_API:`${BASE_URL}/api/water/app/pay-demand`,
  PAYMENT_RECEIPT_API:`${BASE_URL}/api/water/app/payment-receipt`,
  WATER_DOC_LIST:`${BASE_URL}/api/water/app/get-uploaded-doc-list`,
  WATER_REMARKS_API:`${BASE_URL}/api/water/app/post-next`,
  MASTER_DATA_API:`${BASE_URL}/api/water/app/master-data`,
  TEST_REQUEST_API :`${BASE_URL}/api/water/app/test-request`,
   APPLY_CONNECTION_API :`${BASE_URL}/api/water/app/apply-connection`,
 REVIEW_TAX_API :`${BASE_URL}/api/water/app/review-tax`,
}

export const CUSTOMER_API ={
  CUSTOMER_DETAILS_API:`${BASE_URL}/api/water/consumer/dtl`,
  CUSTOMER_SEARCH_API:`${BASE_URL}/api/water/consumer/search`,
  CUSTOMER_DUE_API:`${BASE_URL}/api/water/consumer/due`,
  CUSTOMER_PAYMENT_RECIPT_API:`${BASE_URL}/api/water/app/payment-receipt`,
  CUSTOMER_PAY_DUE_API:`${BASE_URL}/api/water/consumer/pay-due`,

}
  
