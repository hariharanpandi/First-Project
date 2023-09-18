import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL, BASE_PROJECT_URL } from "../../../api/ApiPath";

import { PayloadAction } from "@reduxjs/toolkit";
import {
  GetAppRequest,
  GetAppFailure,
  GetAppSuccess,
} from "../../slice/app-slice/GetAppInfoSlice";
import { Projects } from "../../@types/project-types/GetProjectTypes";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";

// Define a variable to keep track of whether the API call is in progress
let isGetingApp = false;

export function* handleGetApp(action: any) {
    // Check if another API call is already in progress
    if (isGetingApp) {
      return; // Exit the function to prevent multiple calls
    }
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
        // Set the isGetingApp flag to true to indicate that an API call is in progress
        isGetingApp = true;

    const response: AppCreationResponse = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.application.getInfo}/${action.payload}`,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response) {
      const { data } = response;

      yield put(GetAppSuccess(data));
    }
  } catch (err: any) {
    yield put(GetAppFailure(err?.response?.data));
  } finally {
    // Set the isGetingApp flag to false to indicate that the API call has completed
     isGetingApp = false;
  }
}

export function* watchGetAppSaga() {
  yield takeLatest(GetAppRequest.type, handleGetApp);
}
