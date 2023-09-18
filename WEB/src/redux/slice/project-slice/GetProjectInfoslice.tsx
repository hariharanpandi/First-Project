import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ProfileInfoState {
    projectInfoData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: ProfileInfoState = {
  projectInfoData:null,
  loading: false,
  success: null,
  error: null,


};

export const getProjectInfoSlice = createSlice({
  name: "getProjectInfo",
  initialState,
  reducers: {
    getProjectInfoRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.projectInfoData = null;
      
    },
    getProjectInfoSuccess: (state,action) => {
      state.projectInfoData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getProjectInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getProjectInfoReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getProjectInfoRequest,
    getProjectInfoSuccess,
    getProjectInfoFailure,
    getProjectInfoReset
} = getProjectInfoSlice.actions;


export default getProjectInfoSlice.reducer;
