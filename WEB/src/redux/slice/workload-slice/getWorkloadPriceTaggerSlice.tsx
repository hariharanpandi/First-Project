import { createSlice } from "@reduxjs/toolkit";

interface GetWorkloadPriceTagger {
    getWorkloadPriceTagger: string | null;
    workloadPriceTaggerLoading: boolean;
    workloadPriceTaggerError: string | null;
    workloadPriceTaggerSuccess: string | null;
}

const initialState: GetWorkloadPriceTagger = {
    getWorkloadPriceTagger: null,
    workloadPriceTaggerLoading: false,
    workloadPriceTaggerError: null,
    workloadPriceTaggerSuccess: null,
};

export const getWorkloadPriceTaggerSlice = createSlice({
    name: "getWorkloadPriceTagger",
    initialState,
    reducers: {
        getWorkloadPriceTaggerRequest: (state, action) => {
            state.getWorkloadPriceTagger = null;
            state.workloadPriceTaggerLoading = true;
            state.workloadPriceTaggerError = null;
        },
        getWorkloadPriceTaggerSuccess: (state, action) => {
            state.getWorkloadPriceTagger = action.payload;
            state.workloadPriceTaggerLoading = false;
            state.workloadPriceTaggerSuccess = action.payload;
        },
        getWorkloadPriceTaggerFailure: (state, action) => {
            state.workloadPriceTaggerLoading = false;
            state.workloadPriceTaggerError = action.payload;
            state.getWorkloadPriceTagger = null;

        },
        getWorkloadPriceTaggerReset: (state) => {
            state.getWorkloadPriceTagger = null
            state.workloadPriceTaggerError = null;
        }
    },
});

export const {
    getWorkloadPriceTaggerRequest,
    getWorkloadPriceTaggerSuccess,
    getWorkloadPriceTaggerFailure,
    getWorkloadPriceTaggerReset
} = getWorkloadPriceTaggerSlice.actions;

export default getWorkloadPriceTaggerSlice.reducer;
