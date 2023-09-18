import { createSlice } from "@reduxjs/toolkit";
import { UserEditType } from "../../@types/user-management-types/UpdateUser";

interface EditUserState {
    userEditType: UserEditType | null;
    editLoading: boolean;
    editError: string | null;
    editSuccess: boolean;
}

const initialState: EditUserState = {
    userEditType: null,
    editLoading: false,
    editError: null,
    editSuccess: false,
};

export const updateUserStatusSlice = createSlice({
    name: "updateUserStatus",
    initialState,
    reducers: {
        updateUserStatusRequest: (state, action) => {
            state.userEditType = null;
            state.editLoading = true;
            state.editError = null;
        },
        updateUserStatusSuccess: (state, action) => {
            state.userEditType = action.payload;
            state.editLoading = false;
            state.editSuccess = true;
        },
        updateUserStatusFailure: (state, action) => {
            state.editLoading = false;
            state.editError = action.payload;
            state.userEditType = null;

        },
        updateUserStatusReset: (state) => {
            state.editSuccess = false
        }
    },
});

export const {
    updateUserStatusRequest,
    updateUserStatusSuccess,
    updateUserStatusFailure,
    updateUserStatusReset } =
    updateUserStatusSlice.actions;

export default updateUserStatusSlice.reducer;
