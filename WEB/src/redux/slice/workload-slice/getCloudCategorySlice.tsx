import { createSlice } from "@reduxjs/toolkit";

interface GetCloudCategory {
    getCloudCategoryData: string | null;
    getLoading: boolean;
    getError: string | null;
    getSuccess: string | null;
}

const initialState: GetCloudCategory = {
    getCloudCategoryData: null,
    getLoading: false,
    getError: null,
    getSuccess: null,
};

export const getCloudCategory = createSlice({
    name: "getCloudCategory",
    initialState,
    reducers: {
        getCloudCategoryRequest: (state, action) => {
            state.getCloudCategoryData = null;
            state.getLoading = true;
            state.getError = null;
        },
        getCloudCategorySuccess: (state, action) => {
            state.getCloudCategoryData = action.payload;
            state.getLoading = false;
            state.getSuccess = action.payload;
        },
        getCloudCategoryFailure: (state, action) => {
            state.getLoading = false;
            state.getError = action.payload;
            state.getCloudCategoryData = null;

        },
        getCloudCategoryReset: (state) => {
            state.getCloudCategoryData = null
            state.getError = null;
        }
    },
});

export const {
    getCloudCategoryRequest,
    getCloudCategorySuccess,
    getCloudCategoryFailure,
    getCloudCategoryReset
} = getCloudCategory.actions;

export default getCloudCategory.reducer;
