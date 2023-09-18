import { takeLatest, call, put } from "redux-saga/effects";
import {
  editProjectSuccess,
  editProjectFailure,
} from "../../slice/project-slice/EditProjectSlice";
import { BASE_PROJECT_URL, BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { getQueryParam } from "../../../helper/SearchParams";

import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { getRoleAccessRequest,getRoleAccessFailure,getRoleAccessSuccess } from "../../slice/user-management-slice/GetRoleAccessSlice";

function* handleGetRoleAccessInfo(action:any) {
    const{
        payload: {requestBody},
      } = action;

   
  const projectId = getQueryParam('projectId');

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  

  try {
    const response: UserInfoData = yield call(API, {
      method: "PUT",
      url: `${BASE_PROJECT_URL}${endPoints.role.update}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload,
    });

    const data = response.data;


    if (response) {
      yield put(getRoleAccessSuccess({data}));
    }
  } catch (err: any) {
   
    yield put(getRoleAccessFailure(err?.response?.data));
  }
}

export function* watchGetRoleAccessSaga() {
  yield takeLatest(getRoleAccessRequest.type, handleGetRoleAccessInfo);
}
