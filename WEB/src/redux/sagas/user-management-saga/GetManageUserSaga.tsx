import { takeLatest, call, put } from "redux-saga/effects";
import {
  editProjectSuccess,
  editProjectFailure,
} from "../../slice/project-slice/EditProjectSlice";
import { BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { getQueryParam } from "../../../helper/SearchParams";
import { getManageUserRequest,getManageUserSuccess,getManageUserFailure } from "../../action/user-management-action/GetManageUserAction";
import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { PayloadAction } from "@reduxjs/toolkit";

function* handleGetManageUserInfo(action: PayloadAction<{
  data?: {}
  queryparams: string;
}>) {
  const projectId = getQueryParam('projectId');

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  


  try {
    const response: UserInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.user.list}/${projectId}?${action?.payload?.queryparams}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getManageUserSuccess({data}));
    }
  } catch (err: any) {
    yield put(getManageUserFailure(err?.response?.data));
  }
}

export function* watchGetManageUserSaga() {
  yield takeLatest(getManageUserRequest.type, handleGetManageUserInfo);
}
