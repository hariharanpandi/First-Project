import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    _id: '', // _id will be given after the cloud account is created
    _cls: 'azure_arm', //** Platform details selected card key */
    key: "", //** Authentication-details name field */
    secret: "", //** Authentication-details Secret field */
    owner: "", //** Selected project_id */
    subscription_id: "", //** Authentication-details subscription field */
    tenant_id: "", //** Authentication-details tenant id field */
    account_name: "", //** final page account name field */
    access_type: "", //** Onboarding access type field */
    environment: "", //** Onboarding AWS environment field*/
    subscription_type: "", //** Authentication-details Subscription type field */
    project_name: "", //** project name */
    // ** constant_field key is used for local reference */
    constant_field: "",
    is_verifyed_success: false,
};

export const AzurePersistData = createSlice({
    name: "azurePersistData",
    initialState,
    reducers: {
        setAzurePersistData: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        resetAzurePersistData: () => initialState,
    },
});

export const {
    setAzurePersistData,
    resetAzurePersistData
} = AzurePersistData.actions;

export default AzurePersistData.reducer;