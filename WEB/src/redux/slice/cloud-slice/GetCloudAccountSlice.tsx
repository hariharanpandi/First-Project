import { createSlice } from "@reduxjs/toolkit";

interface GetCloudAccount {
    getCloudAccountData: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: GetCloudAccount = {
    getCloudAccountData: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const getCloudAccount = createSlice({
    name: "GetCloudAccount",
    initialState,
    reducers: {
        getCloudAccountRequest: (state, action) => {
            state.getCloudAccountData = null;
            state.postLoading = true;
            state.postError = null;
        },
        getCloudAccountSuccess: (state, action) => {
            state.getCloudAccountData = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        getCloudAccountFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.getCloudAccountData = null;

        },
        getCloudAccountReset: (state) => {
            state.getCloudAccountData = null
            state.postError = null;
        }
    },
});

export const {
    getCloudAccountRequest,
    getCloudAccountSuccess,
    getCloudAccountFailure,
    getCloudAccountReset
} = getCloudAccount.actions;

export default getCloudAccount.reducer;
