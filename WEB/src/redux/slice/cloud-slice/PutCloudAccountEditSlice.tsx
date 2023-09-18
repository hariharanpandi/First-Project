import { createSlice } from "@reduxjs/toolkit";

interface PutCloudAccountEdit {
    putCloudAccountEditData: string | null;
    postLoading: boolean;
    postError: string | null;
    postSuccess: string | null;
}

const initialState: PutCloudAccountEdit = {
    putCloudAccountEditData: null,
    postLoading: false,
    postError: null,
    postSuccess: null,
};

export const putCloudAccountEdit = createSlice({
    name: "CloudAccountEdit",
    initialState,
    reducers: {
        putCloudAccountEditRequest: (state, action) => {
            state.putCloudAccountEditData = null;
            state.postLoading = true;
            state.postError = null;
        },
        putCloudAccountEditSuccess: (state, action) => {
            state.putCloudAccountEditData = action.payload;
            state.postLoading = false;
            state.postSuccess = action.payload;
        },
        putCloudAccountEditFailure: (state, action) => {
            state.postLoading = false;
            state.postError = action.payload;
            state.putCloudAccountEditData = null;

        },
        putCloudAccountEditReset: (state) => {
            state.putCloudAccountEditData = null
            state.postError = null;
        }
    },
});

export const {
    putCloudAccountEditRequest,
    putCloudAccountEditSuccess,
    putCloudAccountEditFailure,
    putCloudAccountEditReset
} = putCloudAccountEdit.actions;

export default putCloudAccountEdit.reducer;
