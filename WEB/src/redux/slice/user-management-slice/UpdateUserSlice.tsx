import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const editUserSlice = createSlice({
  name: "editUser",
  initialState,
  reducers: {
    editUserRequest: (state, action) => {
      state.userEditType = null;
      state.editLoading = true;
      state.editError = null;
    },
    editUserSuccess: (state,action) => {
      state.userEditType = action.payload;
      state.editLoading = false;
      state.editSuccess = true;
    },
    editUserFailure: (state, action) => {
      state.editLoading = false;
      state.editError = action.payload;
      state.userEditType = null;

    },
    editUserReset: (state)=>{
     state.editSuccess = false
    }
  },
});

export const { 
    editUserRequest,
    editUserSuccess,
    editUserFailure,
    editUserReset } =
editUserSlice.actions;

export default  editUserSlice.reducer;
