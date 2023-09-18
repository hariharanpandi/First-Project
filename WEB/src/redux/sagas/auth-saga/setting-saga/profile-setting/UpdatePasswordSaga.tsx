import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";

import { PasswordProfile } from "../../../../@types/setting-types/profile-setting/UpdatePassword";
import { passwordUpdateRequest, passwordUpdateFailure,passwordUpdateSuccess } from "../../../../slice/setting-slice/profile-setting/UpdataPasswordSlice";
import { profileInfoRequest } from "../../../../slice/setting-slice/profile-setting/ProfileSettingSlice";

// Define a variable to keep track of whether the API call is in progress
let isUpdatePassword = false;

export function* handlePasswordUpdate(action: any) {
    // Check if another API call is already in progress
    if (isUpdatePassword) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
        // Set the isCreatingProject flag to true to indicate that an API call is in progress
        isUpdatePassword = true;
    const response: PasswordProfile = yield call(API, {
      method: "POST",
      url: `${BASE_URL}${endPoints.account.profile.changePassword}/${userId}`,
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${authToken}`,
      },
      data: {
        tenant_id:action.payload.tenant_id?.replace(/"/g, ""),
        tenant_group_id: action.payload.tenant_group_id?.replace(/"/g, ""),
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        email: action.payload.email,
        password:action.payload.password,
        status: action.payload.status,
      },
    
     
    });
    
    if (response) {
      const { data } = response;

      yield put(passwordUpdateSuccess(data));
      yield put(profileInfoRequest(userId));
    } 
   
  } catch (err: any) {
    yield put(passwordUpdateFailure(err.response.data));
  } finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isUpdatePassword = false;
  }
}

export function* watchPasswordUpdateSaga() {
  yield takeLatest(passwordUpdateRequest.type, handlePasswordUpdate);
}
