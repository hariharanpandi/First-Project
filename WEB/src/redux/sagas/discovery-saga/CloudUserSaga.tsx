import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL, BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import API from "../../axios";
import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { PayloadAction } from "@reduxjs/toolkit";
import { getCloudUserRequest,getCloudUserFailure,getCloudUserSuccess } from "../../slice/discovery-slice/CloudUserSlice";


function* handleCloudUserInfo(action: PayloadAction<{
  id?: string;
  queryparams: string;
}>): Generator<any, any, any> {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  try {
    const response: UserInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.cloud.getUser}?${action?.payload?.queryparams ?? ''
      }`,
      // url: `${BASE_PROJECT_URL}/users/cloud/list?project_id=64a6b3c6f31e6a771f2a08b0&cloud_name=azure_arm&page=1&limit=10&search=aws&sort=account_type&orderBy=desc`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getCloudUserSuccess({data}));
    }
  } catch (err: any) {
    
    yield put(getCloudUserFailure(err?.response?.data));
  }
}

export function*watchCloudUserSaga() {
  yield takeLatest(getCloudUserRequest.type, handleCloudUserInfo);
}
