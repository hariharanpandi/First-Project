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

import { UserInfoData } from "../../@types/user-management-types/GetRoleApp";
import { getRoleAppFailure,getRoleAppRequest,getRoleAppSuccess } from "../../slice/user-management-slice/GetRoleAppSlice";
import _ from "lodash";

let isGetApp = false;
function* handleGetRoleAppInfo(action: {
    type: string;
    payload: { project_id: string, role_name: string };
  }) {
    if (isGetApp) {
      return; // Exit the function to prevent multiple calls
    }
    const { project_id, role_name } = action.payload;

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  const user_type = localStorage.getItem("user_type");

  try {
    isGetApp = true;
    if (!_.isNil(project_id)) {

      let url = `${BASE_PROJECT_URL}${endPoints.role.app}/${project_id}`

      if (JSON.parse(user_type!) === "N") {
        url += `?userapplication=true`
      }

      if (role_name === "Workload_Admin" && JSON.parse(user_type!) === "N") {
        url += `&workloadadmin=true`
      }

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
      yield put(getRoleAppSuccess(response?.data));
    }
    } else {
      yield put(getRoleAppFailure(''));
    }
  } catch (err: any) {
    
    yield put(getRoleAppFailure(err?.response?.data));
  }
  finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isGetApp = false;
  }
}

export function* watchGetRoleAppSaga() {
  yield takeLatest(getRoleAppRequest.type, handleGetRoleAppInfo);
}
