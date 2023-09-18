import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";



export interface DeleteUserState {
 
  DeleteUser:any|null;
  deleteLoading: boolean;

  error: string | null;
}

const initialState: DeleteUserState = {
 
  DeleteUser: null,
  deleteLoading: false,
  error: null,
};

export const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState,
  reducers: {
    deleteUserRequest: (state, action) => {
      state.deleteLoading = true;
      state.error = null;
      state.DeleteUser = null;
    },
    deleteUserSuccess: (state, action) => {
      state.DeleteUser = action.payload;
      state.deleteLoading = false;
    },
    deleteUserFailure: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
      
      state.DeleteUser = null;
    },
    deleteUserReset: () => {
      return initialState;
    },
  },
});

export const {
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUserReset,
} = deleteUserSlice.actions;

export default deleteUserSlice.reducer;
