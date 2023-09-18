import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";

import { PasswordProfile } from "../../../../@types/setting-types/profile-setting/UpdatePassword";
import {
  passwordUpdateRequest,
  passwordUpdateFailure,
  passwordUpdateSuccess,
} from "../../../../slice/setting-slice/profile-setting/UpdataPasswordSlice";
import {
  deleteAccountFailure,
  deleteAccountRequest,
  deleteAccountSuccess,
} from "../../../../slice/setting-slice/profile-setting/DeleteAccountslice";
import { DeleteResponse } from "../../../../@types/setting-types/profile-setting/DeleteAccount";

// Define a variable to keep track of whether the API call is in progress
let isDeleteAccount = false;

export function* handleDeleteAccount(action: any) {
    // Check if another API call is already in progress
    if (isDeleteAccount) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = localStorage.getItem("userId")?.replace(/"/g, "");

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
        // Set the isDeleteAccount flag to true to indicate that an API call is in progress
        isDeleteAccount = true;
    const response: DeleteResponse = yield call(API, {
      method: "DELETE",
      url: `${BASE_URL}${endPoints.account.profile.delete}/${userId}`,
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${authToken}`,
      },
      data: {
        last_accessed_by: "Hari",
      },
    });

    if (response) {
      const { data } = response;

      yield put(deleteAccountSuccess(data));
    }
  } catch (err: any) {
    yield put(deleteAccountFailure(err.response.data));
  } finally {
    // Set the isDeleteAccount flag to false to indicate that the API call has completed
    isDeleteAccount = false;
  }
}

export function* watchDeleteAccountSaga() {
  yield takeLatest(deleteAccountRequest.type, handleDeleteAccount);
}
