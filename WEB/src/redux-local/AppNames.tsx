import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { string } from "yup";


interface AppState {
    appsname: string;
    appsId: string | any;
    ProjectID: string | any;
    sideOpen: boolean | any;
  }

const initialState: AppState  = {
    appsname: "",
    appsId:"",
    ProjectID:"",
    sideOpen:"",
  };

  export const AppNamess = createSlice({
    name: "APPNAMESS",
    initialState,
    reducers: {
      setAppsname: (state, action: PayloadAction<any>) => {
        state.appsname = action.payload;
      },
      /* App id pass applicationDisplay to WorkloadList */
      setAppsId: (state, action: PayloadAction<any>) => {
        state.appsId = action.payload
      },
      setProjectID: (state,action:PayloadAction<any>) => {
        state.ProjectID = action.payload;
      },
      /* sidebar open carrosal 4 card show */
      setSideOpen:(state,action:PayloadAction<any>) => {
        state.sideOpen = action.payload;
      },
      resetAppname: (state) => {
        state.appsname = "";
      },
    },
});

export const {
    setAppsname,
    setAppsId,
    resetAppname,
    setProjectID,
    setSideOpen,
} = AppNamess.actions;

export default AppNamess.reducer;