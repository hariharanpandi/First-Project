import { createSlice } from "@reduxjs/toolkit";

interface ManageUser {
    manageUserData: string | null;
    Loading: boolean;
    Error: string | null;
    Success: string | null;
}

const initialState: ManageUser = {
    manageUserData: null,
    Loading: false,
    Error: null,
    Success: null,
};

export const manageUser = createSlice({
    name: "manageUser",
    initialState,
    reducers: {
        manageUserRequest: (state, action) => {
            state.manageUserData = null;
            state.Loading = true;
            state.Error = null;
        },
        manageUserSuccess: (state, action) => {
            state.manageUserData = action.payload;
            state.Loading = false;
            state.Success = action.payload;
        },
        manageUserFailure: (state, action) => {
            state.Loading = false;
            state.Error = action.payload;
            state.manageUserData = null;

        },
        manageUserReset: (state) => {
            state.manageUserData = null
            state.Error = null;
        }
    },
});

export const {
    manageUserRequest,
    manageUserSuccess,
    manageUserFailure,
    manageUserReset
} = manageUser.actions;

export default manageUser.reducer;
