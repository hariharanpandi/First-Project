import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectEditType } from "../../@types/project-types/EditProjectTypes";

interface EditProjectState {
  projectEditType: ProjectEditType | null;
  editLoading: boolean;
  editError: string | null;
  editSuccess: string | null;
}

const initialState: EditProjectState = {
  projectEditType: null,
  editLoading: false,
  editError: null,
  editSuccess: null,
};

export const editProjectSlice = createSlice({
  name: "editProject",
  initialState,
  reducers: {
    editProjectRequest: (state, action) => {
      state.projectEditType = null;
      state.editLoading = true;
      state.editError = null;
    },
    editProjectSuccess: (state,action) => {
      state.projectEditType = action.payload;
      state.editLoading = false;
      state.editSuccess = action.payload;
    },
    editProjectFailure: (state, action) => {
      state.editLoading = false;
      state.editError = action.payload;
      state.projectEditType = null;

    },
    editProjectReset: (state)=>{
     state.editSuccess = null;
     state.editError = null;
    }
  },
});

export const { 
    editProjectRequest,
    editProjectSuccess,
    editProjectFailure,
    editProjectReset } =
editProjectSlice.actions;

export default  editProjectSlice.reducer;
