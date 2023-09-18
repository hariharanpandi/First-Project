import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    userData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    search: string | undefined; 
    currentPage: any;
    totalPages: number;

  }

const initialState: UserInfoState = {
  userData:null,
  loading: false,
  success: null,
  error: null,
  search: undefined,
  currentPage: 1, // Default page number
  totalPages: 0,
};

export const getUserSlice = createSlice({
  name: "getUser",
  initialState,
  reducers: {
    getUserRequest: (state, action: PayloadAction<string | undefined>) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.userData = null;
      state.search = action.payload;
      state.currentPage = action.payload; 
    },
    getUserSuccess: (state,action) => {
      state.userData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },


    getUserReset : ()=>{
      return initialState;
    },
  }
});

export const {
    getUserRequest,
    getUserSuccess,
    getUserFailure,
    getUserReset,
} = getUserSlice.actions;


export default getUserSlice.reducer;
