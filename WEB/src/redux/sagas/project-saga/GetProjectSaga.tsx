import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL,BASE_PROJECT_URL } from "../../../api/ApiPath";


import { PayloadAction } from "@reduxjs/toolkit";
import {
  getProjectReset,
  getProjectSlice,
  getProjectSuccess,
  getProjectRequest,
  getProjectFailure,
} from "../../slice/project-slice/GetProjectSlice";
import { Projects } from "../../@types/project-types/GetProjectTypes";
let isGetProject = false;
export function* handleProjectInfo() {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  if (isGetProject) {
    return; // Exit the function to prevent multiple calls
  }
  try {
    isGetProject = true;
    const response: Projects = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.account.project.get}?userproject=true&mappedproject=true`,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response) {
        const { data } = response;

      yield put(getProjectSuccess(data));
    }
  } catch (err: any) {
    yield put(getProjectFailure(err?.response?.data || err?.message));
  } 
  finally {
    // Set the isGetProject flag to false to indicate that the API call has completed
    isGetProject = false;
  }
}

export function* watchGetProjectSaga() {
  yield takeLatest(getProjectRequest.type, handleProjectInfo);
}
