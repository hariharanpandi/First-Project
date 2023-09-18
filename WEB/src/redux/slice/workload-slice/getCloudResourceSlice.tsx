import { createSlice } from "@reduxjs/toolkit";

interface GetCloudResource {
    getCloudResourceData: string | null;
    getLoading: boolean;
    getError: string | null;
    getSuccess: string | null;
}

const initialState: GetCloudResource = {
    getCloudResourceData: null,
    getLoading: false,
    getError: null,
    getSuccess: null,
};

export const getCloudResource = createSlice({
    name: "getCloudResource",
    initialState,
    reducers: {
        getCloudResourceRequest: (state, action) => {
            state.getCloudResourceData = null;
            state.getLoading = true;
            state.getError = null;
        },
        getCloudResourceSuccess: (state, action) => {
            state.getCloudResourceData = action.payload;
            state.getLoading = false;
            state.getSuccess = action.payload;
        },
        getCloudResourceFailure: (state, action) => {
            state.getLoading = false;
            state.getError = action.payload;
            state.getCloudResourceData = null;

        },
        getCloudResourceReset: (state) => {
            state.getCloudResourceData = null
            state.getError = null;
        }
    },
});

export const {
    getCloudResourceRequest,
    getCloudResourceSuccess,
    getCloudResourceFailure,
    getCloudResourceReset
} = getCloudResource.actions;

export default getCloudResource.reducer;
