import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../../../axios";
import { endPoints } from "../../../../../api/EndPoints";
import { BASE_URL } from "../../../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";
import {
  profileInfoFailure,
  profileInfoReset,
  profileInfoSlice,
  profileInfoSuccess,
  profileInfoRequest,
} from "../../../../slice/setting-slice/profile-setting/ProfileSettingSlice";
import { UserProfile } from "../../../../@types/setting-types/profile-setting/ProfileSettingTypes";
import { setLocalStorage } from "../../../../../helper/LocalStorage";
import {CustomBackdrop} from "../../../../../helper/backDrop";
import _ from "lodash";

// Define a variable to keep track of whether the API call is in progress
let isProfileSetting = false;

export function* handleProfileInfo(action: any) {
    // Check if another API call is already in progress
    if (isProfileSetting) {
      return; // Exit the function to prevent multiple calls
    }
  const userId = action.payload;
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
     // Set the isProfileSetting flag to true to indicate that an API call is in progress
     isProfileSetting = true;
    if (!_.isNil(userId)) {
    yield call(() => new Promise<void>((resolve) => {
      const newLocal = { open: true };
      CustomBackdrop(newLocal);
      resolve();
    }));
    const response: UserProfile = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.account.profile.get}/${encodeURIComponent(userId?.replace(/"/g, ""))}`,
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response) {
      const { data } = response;
    

      yield put(profileInfoSuccess(response?.data?.data));
      setLocalStorage("tenant_id", response?.data?.data?.tenant_id);
      setLocalStorage("tenant_group_id", response?.data?.data?.tenant_group_id);
      setLocalStorage("last_accessed_by", response?.data?.data?.last_accessed_by);
    } else {
      const errorMessage: string = "Login failed";
      yield put(profileInfoFailure(errorMessage));
    }
    } else {
      yield put(profileInfoFailure(''));
    }
  } catch (err: any) {
    yield put(profileInfoFailure(err.response.data));
  } finally {
    // Set the isProfileSetting flag to false to indicate that the API call has completed
    isProfileSetting = false;
  }
}

export function* watchProfileInfoSaga() {
  yield takeLatest(profileInfoRequest.type, handleProfileInfo);
}
