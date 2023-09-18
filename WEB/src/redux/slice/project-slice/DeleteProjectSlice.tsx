import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";



export interface DeleteProjectState {
 
  DeleteProject:ProjectRequest|null;
  deleteLoading: boolean;

  error: string | null;
}

const initialState: DeleteProjectState = {
 
  DeleteProject: null,
  deleteLoading: false,

  error: null,
};

export const deleteProjectSlice = createSlice({
  name: "deleteProject",
  initialState,
  reducers: {
    deleteProjectRequest: (state, action) => {
      state.deleteLoading = true;
      state.error = null;
      state.DeleteProject = null;
    },
    deleteProjectSuccess: (state, action) => {
      state.DeleteProject = action.payload;
      state.deleteLoading = false;
    },
    deleteProjectFailure: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
      
      state.DeleteProject = null;
    },
    deleteProjectReset: (state) => {
      state.DeleteProject = null;;
    },
  },
});

export const {
  deleteProjectRequest,
  deleteProjectSuccess,
  deleteProjectFailure,
  deleteProjectReset,
} = deleteProjectSlice.actions;

export default deleteProjectSlice.reducer;
