import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    owner: "", //** Selected project_id */
    // ** constant_field key is used for local reference */
    constant_field: "",
};

export const OciPersistData = createSlice({
    name: "ociPersistData",
    initialState,
    reducers: {
        setOciPersistData: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        resetOciPersistData: () => initialState,
    },
});

export const {
    setOciPersistData,
    resetOciPersistData,
} = OciPersistData.actions;

export default OciPersistData.reducer;


