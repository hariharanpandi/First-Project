import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";

import { EditProfile } from "../../../../@types/setting-types/profile-setting/EditProfileTypes";
import { profileEditFailure, profileEditRequest, profileEditSuccess } from "../../../../slice/setting-slice/profile-setting/EditProfileslice";
import { profileInfoRequest } from "../../../../slice/setting-slice/profile-setting/ProfileSettingSlice";

// Define a variable to keep track of whether the API call is in progress
let isEditeProfile = false;

export function* handleProfileEdit(action: any) {
    // Check if another API call is already in progress
    if (isEditeProfile) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
       // Set the isEditeProfile flag to true to indicate that an API call is in progress
       isEditeProfile = true;

    const response: EditProfile = yield call(API, {
      method: "PUT",
      url: `${BASE_URL}${endPoints.account.profile.update}/${userId}?imageupload=true`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
      
    
     
    });
 
     if (response) {
      const { data } = response;
     

      yield put(profileEditSuccess(data));
      yield put(profileInfoRequest(userId));
    } 
   
  } catch (err: any) {
    yield put(profileEditFailure(err));
  } finally {
    // Set the isEditeProfile flag to false to indicate that the API call has completed
    isEditeProfile  = false;
  }
}

export function* watchProfileEditSaga() {
  yield takeLatest(profileEditRequest.type, handleProfileEdit);
}
