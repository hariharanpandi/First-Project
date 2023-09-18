import { createSlice } from "@reduxjs/toolkit";

interface GetCloudPlatform {
    getCloudPlatformData: string | null;
    getLoading: boolean;
    getError: string | null;
    getSuccess: string | null;
}

const initialState: GetCloudPlatform = {
    getCloudPlatformData: null,
    getLoading: false,
    getError: null,
    getSuccess: null,
};

export const getCloudPlatform = createSlice({
    name: "getCloudPlatform",
    initialState,
    reducers: {
        getCloudPlatformRequest: (state, action) => {
            state.getCloudPlatformData = null;
            state.getLoading = true;
            state.getError = null;
        },
        getCloudPlatformSuccess: (state, action) => {
            state.getCloudPlatformData = action.payload;
            state.getLoading = false;
            state.getSuccess = action.payload;
        },
        getCloudPlatformFailure: (state, action) => {
            state.getLoading = false;
            state.getError = action.payload;
            state.getCloudPlatformData = null;

        },
        getCloudPlatformReset: (state) => {
            state.getCloudPlatformData = null
            state.getError = null;
        }
    },
});

export const {
    getCloudPlatformRequest,
    getCloudPlatformSuccess,
    getCloudPlatformFailure,
    getCloudPlatformReset
} = getCloudPlatform.actions;

export default getCloudPlatform.reducer;
