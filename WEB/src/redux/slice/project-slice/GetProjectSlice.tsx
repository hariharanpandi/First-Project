import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileInfoState {
  projectData: any | null;
  loading: boolean;
  success: string | null;
  error: string | null;
}

const initialState: ProfileInfoState = {
  projectData: null,
  loading: false,
  success: null,
  error: null,
};

export const getProjectSlice = createSlice({
  name: "getProject",
  initialState,
  reducers: {
    getProjectRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.projectData = null;
    },
    getProjectSuccess: (state, action) => {
      state.projectData = action.payload;
      state.loading = false;
      state.success = action.payload;
    },
    getProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getProjectReset: () => {
      return initialState;
    },
  },
});

export const {
  getProjectRequest,
  getProjectSuccess,
  getProjectFailure,
  getProjectReset,
} = getProjectSlice.actions;

export default getProjectSlice.reducer;
