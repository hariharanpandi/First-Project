import { createSlice } from "@reduxjs/toolkit";

interface PostSubscriptions {
    postSubscriptionsData: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: PostSubscriptions = {
    postSubscriptionsData: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const postSubscriptions = createSlice({
    name: "Subscriptions",
    initialState,
    reducers: {
        postSubscriptionsRequest: (state, action) => {
            state.postSubscriptionsData = null;
            state.postLoading = true;
            state.postError = null;
        },
        postSubscriptionsSuccess: (state, action) => {
            state.postSubscriptionsData = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        postSubscriptionsFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.postSubscriptionsData = null;

        },
        postSubscriptionsReset: (state) => {
            state.postSubscriptionsData = null
            state.postError = null;
            state.postError = null;
        }
    },
});

export const {
    postSubscriptionsRequest,
    postSubscriptionsSuccess,
    postSubscriptionsFailure,
    postSubscriptionsReset
} = postSubscriptions.actions;

export default postSubscriptions.reducer;
