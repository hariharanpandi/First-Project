import { createSlice } from "@reduxjs/toolkit";

interface GetWorkloadInfo {
    getWorkloadInfo: string | null;
    workloadInfoLoading: boolean;
    workloadInfoError: string | null;
    workloadInfoSuccess: string | null;
}

const initialState: GetWorkloadInfo = {
    getWorkloadInfo: null,
    workloadInfoLoading: false,
    workloadInfoError: null,
    workloadInfoSuccess: null,
};

export const getWorkloadInfoSlice = createSlice({
    name: "getWorkloadInfo",
    initialState,
    reducers: {
        getWorkloadInfoRequest: (state, action) => {
            state.getWorkloadInfo = null;
            state.workloadInfoLoading = true;
            state.workloadInfoError = null;
        },
        getWorkloadInfoSuccess: (state, action) => {
            state.getWorkloadInfo = action.payload;
            state.workloadInfoLoading = false;
            state.workloadInfoSuccess = action.payload;
        },
        getWorkloadInfoFailure: (state, action) => {
            state.workloadInfoLoading = false;
            state.workloadInfoError = action.payload;
            state.getWorkloadInfo = null;

        },
        getWorkloadInfoReset: (state) => {
            state.getWorkloadInfo = null
            state.workloadInfoError = null;
        }
    },
});

export const {
    getWorkloadInfoRequest,
    getWorkloadInfoSuccess,
    getWorkloadInfoFailure,
    getWorkloadInfoReset
} = getWorkloadInfoSlice.actions;

export default getWorkloadInfoSlice.reducer;
