import { createSlice } from "@reduxjs/toolkit";

interface GetCloudAccountName {
    getCloudAccountNameData: string | null;
    workloadLoading: boolean;
    workloadError: string | null;
    workloadSuccess: string | null;
}

const initialState: GetCloudAccountName = {
    getCloudAccountNameData: null,
    workloadLoading: false,
    workloadError: null,
    workloadSuccess: null,
};

export const getCloudAccountNameSlice = createSlice({
    name: "cloudAccountName",
    initialState,
    reducers: {
        getCloudAccountNameRequest: (state, action) => {
            state.getCloudAccountNameData = null;
            state.workloadLoading = true;
            state.workloadError = null;
        },
        getCloudAccountNameSuccess: (state, action) => {
            state.getCloudAccountNameData = action.payload;
            state.workloadLoading = false;
            state.workloadSuccess = action.payload;
        },
        getCloudAccountNameFailure: (state, action) => {
            state.workloadLoading = false;
            state.workloadError = action.payload;
            state.getCloudAccountNameData = null;

        },
        getCloudAccountNameReset: (state) => {
            state.getCloudAccountNameData = null
            state.workloadError = null;
        }
    },
});

export const {
    getCloudAccountNameRequest,
    getCloudAccountNameSuccess,
    getCloudAccountNameFailure,
    getCloudAccountNameReset
} = getCloudAccountNameSlice.actions;

export default getCloudAccountNameSlice.reducer;
