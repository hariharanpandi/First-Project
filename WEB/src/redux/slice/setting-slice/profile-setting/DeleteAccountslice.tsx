import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DeleteRequest } from "../../../@types/setting-types/profile-setting/DeleteAccount";

export interface DeleteAccountState {
  DeleteAccount: DeleteRequest | null;
  deleteLoading: boolean;

  error: string | null;
}

const initialState: DeleteAccountState = {
  DeleteAccount: null,
  deleteLoading: false,

  error: null,
};

export const deleteAccountSlice = createSlice({
  name: "deleteAccount",
  initialState,
  reducers: {
    deleteAccountRequest: (state, action) => {
      state.deleteLoading = true;
      state.error = null;
      state.DeleteAccount = null;
    },
    deleteAccountSuccess: (state, action) => {
      state.DeleteAccount = action.payload;
      state.deleteLoading = false;
    },
    deleteAccountFailure: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
      state.DeleteAccount = null;
    },
    deleteAccountReset: () => {
      return initialState;
    },
  },
});

export const {
  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFailure,
  deleteAccountReset,
} = deleteAccountSlice.actions;

export default deleteAccountSlice.reducer;
