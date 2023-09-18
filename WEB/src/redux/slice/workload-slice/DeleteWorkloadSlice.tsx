import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";



export interface DeleteWorkloadState {
 
  DeleteWorkload:ProjectRequest|null;
  deleteLoading: boolean;

  error: string | null;
}

const initialState: DeleteWorkloadState = {
 
  DeleteWorkload: null,
  deleteLoading: false,

  error: null,
};

export const deleteWorkloadSlice = createSlice({
  name: "deleteWorkload",
  initialState,
  reducers: {
    deleteWorkloadRequest: (state, action) => {
      state.deleteLoading = true;
      state.error = null;
      state.DeleteWorkload = null;
    },
    deleteWorkloadSuccess: (state, action) => {
      state.DeleteWorkload = action.payload;
      state.deleteLoading = false;
    },
    deleteWorkloadFailure: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
      
      state.DeleteWorkload = null;
    },
    deleteWorkloadReset: () => {
      return initialState;
    },
  },
});

export const {
  deleteWorkloadRequest,
  deleteWorkloadSuccess,
  deleteWorkloadFailure,
  deleteWorkloadReset,
} = deleteWorkloadSlice.actions;

export default deleteWorkloadSlice.reducer;