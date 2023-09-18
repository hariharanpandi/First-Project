import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectCreationType } from "../../@types/project-types/CreateProjectTypes";

interface CreateMapState {
  createMaptype:any;
  createMapLoading: boolean;
  createMapError: string | null;
  createMapSuccess: string | null;
}

const initialState: CreateMapState = {
    createMaptype: null,
  createMapLoading: false,
  createMapError: null,
  createMapSuccess: null,
};

export const createMapSlice = createSlice({
  name: "createMap",
  initialState,
  reducers: {
    createMapRequest: (state, action) => {
      state.createMaptype = null;
      state.createMapLoading = true;
      state.createMapError = null;
    },
    createMapSuccess: (state,action) => {
      state.createMaptype = action.payload;
      state.createMapLoading = false;
      state.createMapSuccess = action.payload;
    },
    createMapFailure: (state, action) => {
      state.createMapLoading = false;
      state.createMapError = action.payload;
      state.createMaptype = null;

    },
    createMapReset: (state)=>{
     state.createMapSuccess = null;
     state.createMaptype=null;
     state.createMapError=null;
    }
  },
});

export const { 
  createMapRequest,
  createMapSuccess,
   createMapFailure,
   createMapReset } =
createMapSlice.actions;

export default  createMapSlice.reducer;
