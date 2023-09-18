import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import API from "../../axios";
import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { PayloadAction } from "@reduxjs/toolkit";
import { getUserFailure, getUserRequest, getUserSuccess } from "../../action/user-management-action/GetUserAction";


function* handleGetUserInfo(action: PayloadAction<{
  id?: string;
  queryparams: string;
}>): Generator<any, any, any> {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  try {
    const response: UserInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.user.list}?${
        action?.payload?.queryparams ?? ''
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getUserSuccess({data}));
    }
  } catch (err: any) {
    yield put(getUserFailure(err?.response?.data));
  }
}

export function*watchGetUserSaga() {
  yield takeLatest(getUserRequest.type, handleGetUserInfo);
}
