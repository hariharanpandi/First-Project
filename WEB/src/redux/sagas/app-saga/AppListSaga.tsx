import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL,BASE_PROJECT_URL } from "../../../api/ApiPath";


import { PayloadAction } from "@reduxjs/toolkit";
import { appListRequest,appListSuccess,appListFailure } from "../../slice/app-slice/AppListSlice";
import { Projects } from "../../@types/project-types/GetProjectTypes";
import { AppListResponse } from "../../@types/app-types/AppListTypes";
import _ from "lodash";

let isGettingAppList = false;

export function* handleAppInfo(action:any) {
  const token = localStorage.getItem("token");
  const user_type = localStorage.getItem("user_type");
  const authToken = token?.replace(/"/g, "");

  if(isGettingAppList) {
    return;
  }

  try {
    isGettingAppList = true;
    const {project_id, role_name} = action.payload;
    if (!_.isNil(action.payload.project_id)) {

    if (_.isNil(role_name) && JSON.parse(user_type!) === "N") return;

    let url = `${BASE_PROJECT_URL}${endPoints.application.get}/${project_id}?userapplication=true`

    if (role_name === "Workload_Admin" && JSON.parse(user_type!) === "N") {
      url += `&workloadadmin=true`
    }

    const response: AppListResponse = yield call(API, {
      method: "GET",
      url: url,
    
      headers: {
         "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response) {
        const { data } = response;

      yield put(appListSuccess(data));
    }
    }
  } catch (err: any) {
    yield put(appListFailure(err?.response?.data));
  } finally {
    isGettingAppList = false;
  }
}

export function* watchAppListSaga() {
  yield takeLatest(appListRequest.type, handleAppInfo);
}
