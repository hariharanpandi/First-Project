import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../@types/auth-types/AuthTypes';


interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn:boolean;
  
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  
 isLoggedIn: false,
  error: null,
};

export const loginSlice  = createSlice({
  name: 'auth',
  initialState,
   reducers: {
    loginRequest: (state,action) => {
      
       state.user = null;
      state.isLoading = true;
      state.isLoggedIn = false;
     
    },
    loginSuccess: (state,action) => {
      state.user = action.payload;
      state.isLoading = false;
     
      state.isLoggedIn = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = action.payload;
    },
    loginReset : ()=>{
      return initialState;
    }
  },
});

export const { loginRequest, loginSuccess, loginFailure,loginReset } = loginSlice.actions;

export default loginSlice.reducer;