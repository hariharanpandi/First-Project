import { createSlice } from "@reduxjs/toolkit";

interface GetCloudResourceGroup {
    getCloudResourceGroupData: string | null;
    getLoading: boolean;
    getError: string | null;
    getSuccess: string | null;
}

const initialState: GetCloudResourceGroup = {
    getCloudResourceGroupData: null,
    getLoading: false,
    getError: null,
    getSuccess: null,
};

export const getCloudResourceGroup = createSlice({
    name: "getCloudResourceGroup",
    initialState,
    reducers: {
        getCloudResourceGroupRequest: (state, action) => {
            state.getCloudResourceGroupData = null;
            state.getLoading = true;
            state.getError = null;
        },
        getCloudResourceGroupSuccess: (state, action) => {
            state.getCloudResourceGroupData = action.payload;
            state.getLoading = false;
            state.getSuccess = action.payload;
        },
        getCloudResourceGroupFailure: (state, action) => {
            state.getLoading = false;
            state.getError = action.payload;
            state.getCloudResourceGroupData = null;

        },
        getCloudResourceGroupReset: (state) => {
            state.getCloudResourceGroupData = null
            state.getError = null;
        }
    },
});

export const {
    getCloudResourceGroupRequest,
    getCloudResourceGroupSuccess,
    getCloudResourceGroupFailure,
    getCloudResourceGroupReset
} = getCloudResourceGroup.actions;

export default getCloudResourceGroup.reducer;
