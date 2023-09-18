import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";

export interface DeleteProjectState {
  DeleteApp: any;
  deleteLoading: boolean;
  deleteAppError: string | null;
}

const initialState: DeleteProjectState = {
  DeleteApp: null,
  deleteLoading: false,
  deleteAppError: null,
};

export const deleteAppSlice = createSlice({
  name: "deleteApp",
  initialState,
  reducers: {
    deleteAppRequest: (state, action) => {
      state.deleteLoading = true;   
      state.deleteAppError = null;
      state.DeleteApp = null;
    },
    deleteAppSuccess: (state, action) => {
      state.DeleteApp = action.payload;
      state.deleteLoading = false;
    },
    deleteAppFailure: (state, action) => {
      state.deleteLoading = false;
      state.deleteAppError = action.payload;

      state.DeleteApp = null;
    },
    deleteAppReset: (state) => {
      state.deleteAppError = null;
      state.DeleteApp = null;
    },
  },
});

export const {
  deleteAppRequest,
  deleteAppSuccess,
  deleteAppFailure,
  deleteAppReset,
} = deleteAppSlice.actions;

export default deleteAppSlice.reducer;
