import { createSlice } from "@reduxjs/toolkit";

interface PostCloudAccountCreate {
    postCloudAccountCreateData: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: PostCloudAccountCreate = {
    postCloudAccountCreateData: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const postCloudAccountCreate = createSlice({
    name: "CloudCreate",
    initialState,
    reducers: {
        postCloudAccountCreateRequest: (state, action) => {
            state.postCloudAccountCreateData = null;
            state.postLoading = true;
            state.postError = null;
        },
        postCloudAccountCreateSuccess: (state, action) => {
            state.postCloudAccountCreateData = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        postCloudAccountCreateFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.postCloudAccountCreateData = null;

        },
        postCloudAccountCreateReset: (state) => {
            state.postCloudAccountCreateData = null
            state.postError = null;
        }
    },
});

export const {
    postCloudAccountCreateRequest,
    postCloudAccountCreateSuccess,
    postCloudAccountCreateFailure,
    postCloudAccountCreateReset
} = postCloudAccountCreate.actions;

export default postCloudAccountCreate.reducer;
