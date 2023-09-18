import { createSlice } from "@reduxjs/toolkit";

interface PostVerifyConnection {
    verifyConnectionType: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: PostVerifyConnection = {
    verifyConnectionType: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const postVerifyConnection = createSlice({
    name: "verifyConnection",
    initialState,
    reducers: {
        postVerifyConnectionRequest: (state, action) => {
            state.verifyConnectionType = null;
            state.postLoading = true;
            state.postError = null;
        },
        postVerifyConnectionSuccess: (state, action) => {
            state.verifyConnectionType = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        postVerifyConnectionFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.verifyConnectionType = null;

        },
        postVerifyConnectionReset: (state) => {
            state.verifyConnectionType = null
            state.postError = null;
        }
    },
});

export const {
    postVerifyConnectionRequest,
    postVerifyConnectionSuccess,
    postVerifyConnectionFailure,
    postVerifyConnectionReset
} = postVerifyConnection.actions;

export default postVerifyConnection.reducer;
