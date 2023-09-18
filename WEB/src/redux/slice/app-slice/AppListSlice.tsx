import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AppList {
    appListData:any| null;
    appListLoading: boolean;
    appListSuccess: string | null;
    appListError: string | null;
    
    
  }

const initialState: AppList = {
    appListData:null,
    appListLoading: false,
    appListSuccess: null,
    appListError: null,


};

export const appListSlice = createSlice({
  name: "appList",
  initialState,
  reducers: {
    appListRequest: (state, action) => {
      state.appListLoading = true;
      state.appListSuccess = null;
      state.appListError = null;      
    },
    appListSuccess: (state,action) => {
      state.appListData = action.payload;
      state.appListLoading = false;
      state.appListSuccess = action.payload;
      
    },
    appListFailure: (state, action) => {
      state.appListLoading = false;
      state.appListError = action.payload;
    
  
    },
    appListReset : ()=>{
      return initialState;
    }
  },
});

export const {
    appListRequest,
    appListSuccess,
    appListFailure,
    appListReset
} = appListSlice.actions;


export default appListSlice.reducer;
