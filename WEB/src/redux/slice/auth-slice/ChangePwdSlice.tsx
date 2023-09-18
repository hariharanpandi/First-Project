import { createSlice } from '@reduxjs/toolkit';
import { ChangePwdUser, changePwdUserRequest } from '../../@types/auth-types/ChangePassword';


interface ChangePwdState {
  user: changePwdUserRequest | null;
  isLoading: boolean;
  success: string | null;
    error: string | null;
  
}

const initialState: ChangePwdState = {
  user: null,
  isLoading: false,
  
  success: null,
  error: null,
};

export const changePwdSlice  = createSlice({
  name: 'changePwd',
  initialState,
   reducers: {
    changePwdRequest: (state,action) => {
      
       state.user = null;
      state.isLoading = true;
      state.success = null;
      state.error = null;
    
      // state.isLoading = true;
    },
    changePwdSuccess: (state,action) => {
      state.user = action.payload;
      state.isLoading = false;
     
      state.success = action.payload;
      state.error = null;
    },
    changePwdFailure: (state, action) => {
      state.isLoading = false;
      
      state.error = action.payload;
    },
    changePwdReset : ()=>{
        return initialState;
      }
  },
});

export const { changePwdRequest, changePwdSuccess, changePwdFailure,changePwdReset } = changePwdSlice.actions;

export default changePwdSlice.reducer;