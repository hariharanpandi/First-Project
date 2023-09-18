import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectCreationType } from "../../@types/project-types/CreateProjectTypes";

interface CreateProjectState {
  projectCreationType: ProjectCreationType | null;
  createLoading: boolean;
  error: string | null;
  createSuccess: string | null;
}

const initialState: CreateProjectState = {
  projectCreationType: null,
  createLoading: false,
  error: null,
  createSuccess: null,
};

export const createProjectSlice = createSlice({
  name: "createProject",
  initialState,
  reducers: {
    createProjectRequest: (state, action) => {
      state.projectCreationType = null;
      state.createLoading = true;
      state.error = null;
    },
    createProjectSuccess: (state,action) => {
      state.projectCreationType = action.payload;
      state.createLoading = false;
      state.createSuccess = action.payload;
    },
    createProjectFailure: (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
      state.projectCreationType = null;

    },
    createProjectReset: (state)=>{
     state.createSuccess = null;
     state.error = null;
    }
  },
});

export const { 
  createProjectRequest,
  createProjectSuccess,
   createProjectFailure,
   createProjectReset } =
createProjectSlice.actions;

export default  createProjectSlice.reducer;
