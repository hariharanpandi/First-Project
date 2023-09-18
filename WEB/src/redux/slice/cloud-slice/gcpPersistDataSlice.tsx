import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  owner: "", //** Selected project_id */
  // ** constant_field key is used for local reference */
  constant_field: "",
};

export const GcpPersistData = createSlice({
  name: "gcpPersistData",
  initialState,
  reducers: {
    setGcpPersistData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetGcpPersistData: () => initialState,
  },
});

export const {
  setGcpPersistData,
  resetGcpPersistData
} = GcpPersistData.actions;
export default GcpPersistData.reducer;