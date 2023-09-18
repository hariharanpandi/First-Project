import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import API from "../../axios";

import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { getRoleProjectSuccess,getRoleProjectRequest,getRoleProjectFailure } from "../../action/user-management-action/GetRoleProjectAction";

function* handleGetRoleProjectInfo(action: {
  type: string;
  payload: {
    queryparams: string,
  };
}) {

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
 
  const url  =  `${BASE_PROJECT_URL}${endPoints.role.project}?${action?.payload?.queryparams}`;

  try {
    const response: UserInfoData = yield call(API, {
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getRoleProjectSuccess({data}));
    }
  } catch (err: any) {
 
    yield put(getRoleProjectFailure(err?.response?.data));
  }
}

export function* watchGetRoleProjectSaga() {
  yield takeLatest(getRoleProjectRequest.type, handleGetRoleProjectInfo);
}
