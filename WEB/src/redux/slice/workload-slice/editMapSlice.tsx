import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectCreationType } from "../../@types/project-types/CreateProjectTypes";

interface EditMapState {
  editMaptype:any;
  editMapLoading: boolean;
  editMapError: string | null;
  editMapSuccess: string | null;
}

const initialState: EditMapState = {
    editMaptype: null,
  editMapLoading: false,
  editMapError: null,
  editMapSuccess: null,
};

export const editMapSlice = createSlice({
  name: "editMap",
  initialState,
  reducers: {
    editMapRequest: (state, action) => {
      state.editMaptype = null;
      state.editMapLoading = true;
      state.editMapError = null;
    },
    editMapSuccess: (state,action) => {
      state.editMaptype = action.payload;
      state.editMapLoading = false;
      state.editMapSuccess = action.payload;
    },
    editMapFailure: (state, action) => {
      state.editMapLoading = false;
      state.editMapError = action.payload;
      state.editMaptype = null;

    },
    editMapReset: (state)=>{
     state.editMapSuccess = null;
     state.editMaptype=null;
     state.editMapError=null;
    }
  },
});

export const { 
  editMapRequest,
  editMapSuccess,
   editMapFailure,
   editMapReset } =
editMapSlice.actions;

export default  editMapSlice.reducer;
