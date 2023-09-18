import { createSlice } from "@reduxjs/toolkit";

interface GetWorkload {
    getWorkloadData: string | null;
    workloadLoading: boolean;
    workloadError: string | null;
    workloadSuccess: string | null;
}

const initialState: GetWorkload = {
    getWorkloadData: null,
    workloadLoading: false,
    workloadError: null,
    workloadSuccess: null,
};

export const getWorkloadSlice = createSlice({
    name: "getWorkload",
    initialState,
    reducers: {
        getWorkloadRequest: (state, action) => {
            state.getWorkloadData = null;
            state.workloadLoading = true;
            state.workloadError = null;
        },
        getWorkloadSuccess: (state, action) => {
            state.getWorkloadData = action.payload;
            state.workloadLoading = false;
            state.workloadSuccess = action.payload;
        },
        getWorkloadFailure: (state, action) => {
            state.workloadLoading = false;
            state.workloadError = action.payload;
            state.getWorkloadData = null;

        },
        getWorkloadReset: (state) => {
            state.getWorkloadData = null
            state.workloadError = null;
        }
    },
});

export const {
    getWorkloadRequest,
    getWorkloadSuccess,
    getWorkloadFailure,
    getWorkloadReset
} = getWorkloadSlice.actions;

export default getWorkloadSlice.reducer;
