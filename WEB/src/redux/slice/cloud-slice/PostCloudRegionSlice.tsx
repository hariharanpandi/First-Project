import { createSlice } from "@reduxjs/toolkit";

interface PostCloudRegion {
    postCloudRegionData: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: PostCloudRegion = {
    postCloudRegionData: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const postCloudRegion = createSlice({
    name: "CloudRegion",
    initialState,
    reducers: {
        postCloudRegionRequest: (state, action) => {
            state.postCloudRegionData = null;
            state.postLoading = true;
            state.postError = null;
        },
        postCloudRegionSuccess: (state, action) => {
            state.postCloudRegionData = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        postCloudRegionFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.postCloudRegionData = null;

        },
        postCloudRegionReset: (state) => {
            state.postCloudRegionData = null
            state.postError = null;
            state.postSuccess = null;
        }
    },
});

export const {
    postCloudRegionRequest,
    postCloudRegionSuccess,
    postCloudRegionFailure,
    postCloudRegionReset
} = postCloudRegion.actions;

export default postCloudRegion.reducer;
