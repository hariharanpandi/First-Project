import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ProfileInfoState {
    projectInfoInitData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: ProfileInfoState = {
  projectInfoInitData:null,
  loading: false,
  success: null,
  error: null,


};

export const getProjectInfoInitSlice = createSlice({
  name: "getProjectInfoInit",
  initialState,
  reducers: {
    getProjectInfoInitRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.projectInfoInitData = null;
      
    },
    getProjectInfoInitSuccess: (state,action) => {
      state.projectInfoInitData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getProjectInfoInitFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getProjectInfoInitReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getProjectInfoInitRequest,
    getProjectInfoInitSuccess,
    getProjectInfoInitFailure,
    getProjectInfoInitReset
} = getProjectInfoInitSlice.actions;


export default getProjectInfoInitSlice.reducer;
