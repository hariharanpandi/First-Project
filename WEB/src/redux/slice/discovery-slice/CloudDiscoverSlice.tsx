import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserEditType } from "../../@types/user-management-types/UpdateUser";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";

interface EditUserState {
  cloudDiscovery:  null;
  cloudDiscoveryLoading: boolean;
  cloudDiscoveryError: string | null;
  cloudDiscoverySuccess: null;
}

const initialState: EditUserState = {
    cloudDiscovery: null,
    cloudDiscoveryLoading: false,
    cloudDiscoveryError: null,
    cloudDiscoverySuccess: null,
};

export const cloudDiscoverSlice = createSlice({
  name: "cloudDiscover",
  initialState,
  reducers: {
    cloudDiscoverRequest: (state,action) => {
      state.cloudDiscovery = null;
      state.cloudDiscoveryLoading = true;
      state.cloudDiscoveryError = null;
      state.cloudDiscoverySuccess = null
    },
    cloudDiscoverSuccess: (state,action) => {
      state.cloudDiscovery = action.payload;
      state.cloudDiscoveryLoading = false;
      state.cloudDiscoverySuccess = action.payload;
    },
    cloudDiscoverFailure: (state, action) => {
      state.cloudDiscoveryLoading = false;
      state.cloudDiscoveryError = action.payload;
      state.cloudDiscovery = null;
      state.cloudDiscoverySuccess=null;

    },
    cloudDiscoverReset: (state)=>{
    
     state.cloudDiscoveryError=null;
     state.cloudDiscoverySuccess=null
    //  state.cloudDiscovery = null;
    }
  },
});

export const { 
    cloudDiscoverRequest,
    cloudDiscoverSuccess,
    cloudDiscoverFailure,
    cloudDiscoverReset } =
    cloudDiscoverSlice.actions;

export default  cloudDiscoverSlice.reducer;
