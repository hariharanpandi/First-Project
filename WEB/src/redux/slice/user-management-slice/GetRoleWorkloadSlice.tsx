import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    workloadData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: UserInfoState = {
    workloadData:null,
  loading: false,
  success: null,
  error: null,


};

export const getRoleWorkloadSlice = createSlice({
  name: "getRoleWorkload",
  initialState,
  reducers: {
    getRoleWorkloadRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.workloadData = null;
      
    },
    getRoleWorkloadSuccess: (state,action) => {
      state.workloadData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getRoleWorkloadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getRoleWorkloadReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getRoleWorkloadRequest,
    getRoleWorkloadSuccess,
    getRoleWorkloadFailure,
    getRoleWorkloadReset
} = getRoleWorkloadSlice.actions;


export default getRoleWorkloadSlice.reducer;
