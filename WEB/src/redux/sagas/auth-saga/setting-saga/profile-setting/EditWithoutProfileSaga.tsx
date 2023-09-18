import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";

import { EditWithoutProfile } from "../../../../@types/setting-types/profile-setting/EditWithoutProfileTypes";
import { profileEditWithoutFailure, profileEditWithoutRequest, profileEditWithoutSuccess } from "../../../../slice/setting-slice/profile-setting/EditWithoutProfileSlice";
import { profileInfoRequest } from "../../../../slice/setting-slice/profile-setting/ProfileSettingSlice";

// Define a variable to keep track of whether the API call is in progress
let isWithoutProfile = false;

export function* handleProfileWithoutEdit(action: any) {
    // Check if another API call is already in progress
    if (isWithoutProfile) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
     // Set the isWithoutProfile flag to true to indicate that an API call is in progress
     isWithoutProfile = true;

    const response: EditWithoutProfile = yield call(API, {
      method: "PUT",
      url: `${BASE_URL}${endPoints.account.profile.update}/${userId}?imageupload=false`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
      
    
     
    });
 
     if (response) {
      const { data } = response;

      yield put(profileEditWithoutSuccess(data));
      yield put(profileInfoRequest(userId));
    } 
   
  } catch (err: any) {
    yield put(profileEditWithoutFailure(err));
  } finally {
    // Set the isWithoutProfile flag to false to indicate that the API call has completed
    isWithoutProfile = false;
  }
}

export function* watchProfileWithoutEditSaga() {
  yield takeLatest(profileEditWithoutRequest.type, handleProfileWithoutEdit);
}
