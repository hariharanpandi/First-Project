import { takeLatest, call, put } from "redux-saga/effects";
import {
  editProjectSuccess,
  editProjectFailure,
} from "../../slice/project-slice/EditProjectSlice";
import {  BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { getQueryParam } from "../../../helper/SearchParams";

import { UserInfoData } from "../../@types/user-management-types/GetRoleApp";
import { getRoleRequest,getRoleFailure,getRoleSuccess } from "../../slice/user-management-slice/GetRoleSlice";
function* handleGetRoleInfo(action: {
    type: string;
    payload: { projectId: string };
  }) {
    const projectId = action.payload;

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    const response: UserInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.role.roles}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getRoleSuccess(response?.data));
    }
  } catch (err: any) {
    
    yield put(getRoleFailure(err?.response?.data));
  }
}

export function* watchGetRoleSaga() {
  yield takeLatest(getRoleRequest.type, handleGetRoleInfo);
}
