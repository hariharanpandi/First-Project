import { createSlice } from "@reduxjs/toolkit";

interface ViewWorkload {
    viewWorkloadData: string | null;
    workloadLoading: boolean;
    workloadError: string | null;
    workloadSuccess: string | null;
}

const initialState: ViewWorkload = {
    viewWorkloadData: null,
    workloadLoading: false,
    workloadError: null,
    workloadSuccess: null,
};

export const viewWorkloadSlice = createSlice({
    name: "viewWorkload",
    initialState,
    reducers: {
        viewWorkloadRequest: (state, action) => {
            state.viewWorkloadData = null;
            state.workloadLoading = true;
            state.workloadError = null;
        },
        viewWorkloadSuccess: (state, action) => {
            state.viewWorkloadData = action.payload;
            state.workloadLoading = false;
            state.workloadSuccess = action.payload;
        },
        viewWorkloadFailure: (state, action) => {
            state.workloadLoading = false;
            state.workloadError = action.payload;
            state.viewWorkloadData = null;

        },
        viewWorkloadReset: (state) => {
            state.viewWorkloadData = null
            state.workloadError = null;
        }
    },
});

export const {
    viewWorkloadRequest,
    viewWorkloadSuccess,
    viewWorkloadFailure,
    viewWorkloadReset
} = viewWorkloadSlice.actions;

export default viewWorkloadSlice.reducer;
