import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    role:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: UserInfoState = {
  role:null,
  loading: false,
  success: null,
  error: null,


};

export const getRoleSlice = createSlice({
  name: "getRole",
  initialState,
  reducers: {
    getRoleRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.role = null;
      
    },
    getRoleSuccess: (state,action) => {
      state.role = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getRoleReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getRoleRequest,
    getRoleSuccess,
    getRoleFailure,
    getRoleReset
} = getRoleSlice.actions;


export default getRoleSlice.reducer;
