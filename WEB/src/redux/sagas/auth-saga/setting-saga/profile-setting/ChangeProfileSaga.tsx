import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";

import { EditProfile } from "../../../../@types/setting-types/profile-setting/EditProfileTypes";
import { profileImageFailure, profileImageRequest, profileImageSuccess } from "../../../../slice/setting-slice/profile-setting/ChangeProfileSlice";
import { ImageResponse } from "../../../../@types/setting-types/profile-setting/ChangeProfileTypes";

// Define a variable to keep track of whether the API call is in progress
let isChangeProfile = false;

export function* handleProfileImage(action: any) {
    // Check if another API call is already in progress
    if (isChangeProfile) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
        // Set the isCreatingProject flag to true to indicate that an API call is in progress
        isChangeProfile = true;
    const response: ImageResponse = yield call(API, {
      method: "POST",
      url: `${BASE_URL}${endPoints.account.profile.imageUpload}/${userId}?imageupload=true`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: action.payload
     
    });   
    if (response) {
      const { data } = response;
      yield put(profileImageSuccess(data));
    }
    
  } catch (err: any) {
    yield put(profileImageFailure(err.response.data));
  } finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isChangeProfile = false;
  }
}

export function* watchProfileImageSaga() {
  yield takeLatest(profileImageRequest.type, handleProfileImage);
}
