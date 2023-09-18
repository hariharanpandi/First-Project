import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectCreationType } from "../../@types/project-types/CreateProjectTypes";

interface renameState {
    newWorkloadType: any;
    newWorkloadLoading: boolean;
    newWorkloadError: string | null;
    newWorkloadSuccess: string | null;
}

const initialState: renameState = {
    newWorkloadType: null,
    newWorkloadLoading: false,
    newWorkloadError: null,
    newWorkloadSuccess: null,
};

export const  newWorkloadSlice = createSlice({
    name: " newWorkload",
    initialState,
    reducers: {
        newWorkloadRequest: (state, action) => {
            state. newWorkloadType = null;
            state. newWorkloadLoading = true;
            state. newWorkloadError = null;
        },
        newWorkloadSuccess: (state, action) => {
            state. newWorkloadType = action.payload;
            state. newWorkloadLoading = false;
            state. newWorkloadSuccess = action.payload;
        },
        newWorkloadFailure: (state, action) => {
            state. newWorkloadLoading = false;
            state. newWorkloadError = action.payload;
            state. newWorkloadType = null;
           
        },
        newWorkloadReset: (state) => {
            state. newWorkloadSuccess = null;
            state. newWorkloadType = null;
            state. newWorkloadLoading=false;
            state. newWorkloadError = null;
        }
    }
});

export const {
    newWorkloadRequest,
    newWorkloadSuccess,
    newWorkloadFailure,
    newWorkloadReset } =
    newWorkloadSlice.actions;

export default newWorkloadSlice.reducer;
