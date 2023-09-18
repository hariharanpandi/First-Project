import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "", // _id will be given after the cloud account is created
  _cls: 'ec2', //** Platform details selected card key */
  apikey: "", //** Authentication-details Access key field */
  apisecret: "", //** Authentication-details Secret key field */
  owner: "", //** Selected project_id */
  account_name: "", //** final page account name field */
  account_type: "", //** Onboarding Account type field */
  access_type: "", //** Onboarding Access type field */
  environment: "", //** Onboarding AWS environment field*/
  authentication_protocol: "", //** Onboarding Authentication protocol field */
  bucket_name: "", //** Authentication-details bucket name field */
  cost_report_format_fields: "", //** Authentication-details Cost report format field */
  opted_regions: [], //** Authentication-details Region field */
  project_name: "", //** project name */
  // ** constant_field key is used for local reference */
  constant_field: "",
  is_verifyed_success: false,
};

export const AwsPersistData = createSlice({
  name: "awsPersistData",
  initialState,
  reducers: {
    setAwsPersistData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetAwsPersistData: () => initialState,
  },
});

export const {
  setAwsPersistData,
  resetAwsPersistData,
} = AwsPersistData.actions;

export default AwsPersistData.reducer;
