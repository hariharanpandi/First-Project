import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface RoleInfoState {
    roleData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: RoleInfoState = {
    roleData:null,
  loading: false,
  success: null,
  error: null,


};

export const getRoleAccessSlice = createSlice({
  name: "getRoleAccess",
  initialState,
  reducers: {
    getRoleAccessRequest: (state,action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.roleData = null;
      
    },
    getRoleAccessSuccess: (state,action) => {
      state.roleData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getRoleAccessFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getRoleAccessReset : (state)=>{
      state.success=null;
      state.error=null;
      state.roleData=null;
    }
  },
});

export const {
    getRoleAccessRequest,
    getRoleAccessSuccess,
    getRoleAccessFailure,
    getRoleAccessReset
} = getRoleAccessSlice.actions;


export default getRoleAccessSlice.reducer;
