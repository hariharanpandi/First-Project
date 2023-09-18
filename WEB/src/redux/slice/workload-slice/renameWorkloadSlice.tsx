import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectCreationType } from "../../@types/project-types/CreateProjectTypes";

interface renameState {
    renameType: any;
    renameLoading: boolean;
    renameError: string | null;
    renameSuccess: string | null;
}

const initialState: renameState = {
    renameType: null,
    renameLoading: false,
    renameError: null,
    renameSuccess: null,
};

export const renameSlice = createSlice({
    name: "rename",
    initialState,
    reducers: {
        renameRequest: (state, action) => {
            state.renameType = null;
            state.renameLoading = true;
            state.renameError = null;
        },
        renameSuccess: (state, action) => {
            state.renameType = action.payload;
            state.renameLoading = false;
            state.renameSuccess = action.payload;
        },
        renameFailure: (state, action) => {
            state.renameLoading = false;
            state.renameError = action.payload;
            state.renameType = null;

        },
        renameReset: (state) => {
            state.renameSuccess = null;
            state.renameType = null;
            state.renameLoading=false;
            state.renameError = null;
        }
    },
});

export const {
    renameRequest,
    renameSuccess,
    renameFailure,
    renameReset } =
    renameSlice.actions;

export default renameSlice.reducer;
