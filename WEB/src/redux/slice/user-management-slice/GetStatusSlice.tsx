import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserEditType } from "../../@types/user-management-types/UpdateUser";

interface StatusUserState {
  userStatus: UserEditType | null;
  statusLoading: boolean;
  editError: string | null;
  editSuccess: boolean;
}

const initialState: StatusUserState = {
    userStatus: null,
    statusLoading: false,
  editError: null,
  editSuccess: false,
};

export const getStatusSlice = createSlice({
  name: "getStatus",
  initialState,
  reducers: {
    getStatusRequest: (state, action) => {
      state.userStatus = null;
      state.statusLoading = true;
      state.editError = null;
    },
    getStatusSuccess: (state,action) => {
      state.userStatus = action.payload;
      state.statusLoading = false;
      state.editSuccess = true;
    },
    getStatusFailure: (state, action) => {
      state.statusLoading = false;
      state.editError = action.payload;
      state.userStatus = null;

    },
    getStatusReset: (state)=>{
     state.editSuccess = false
    }
  },
});

export const { 
    getStatusRequest,
    getStatusSuccess,
    getStatusFailure,
    getStatusReset } =
    getStatusSlice.actions;

export default  getStatusSlice.reducer;
