import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserCreationType } from "../../@types/user-management-types/CreateUser";

interface CreateUserState {
  userCreationType: UserCreationType | null;
  createLoading: boolean;
  error: string | null;
  createSuccess: string | null;
}

const initialState: CreateUserState = {
  userCreationType: null,
  createLoading: false,
  error: null,
  createSuccess: null,
};

export const createUserSlice = createSlice({
  name: "createUser",
  initialState,
  reducers: {
    createUserRequest: (state, action) => {
      state.userCreationType = null;
      state.createLoading = true;
      state.error = null;
    },
    createUserSuccess: (state,action) => {
      state.userCreationType = action.payload;
      state.createLoading = false;
      state.createSuccess = action.payload;
    },
    createUserFailure: (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
      state.userCreationType = null;

    },
    createUserReset: (state)=>{
     state.createSuccess = null;
     state.error = null;
    }
  },
});

export const { 
  createUserRequest,
  createUserSuccess,
   createUserFailure,
   createUserReset } =
createUserSlice.actions;

export default  createUserSlice.reducer;
