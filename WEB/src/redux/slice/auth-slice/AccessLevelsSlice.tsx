import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const accessLevels = createSlice({
    name: "accessLevels",
    initialState,
    reducers: {
        setAccessLevels: (state, action) => {
            return {
                ...action.payload,
            };
        },
        resetAccessLevels: () => initialState,
    },
});

export const {
    setAccessLevels
} = accessLevels.actions;

export default accessLevels;