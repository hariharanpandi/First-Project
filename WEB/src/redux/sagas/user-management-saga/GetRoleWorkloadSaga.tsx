import { takeLatest, call, put } from "redux-saga/effects";
import {
  editProjectSuccess,
  editProjectFailure,
} from "../../slice/project-slice/EditProjectSlice";
import { BASE_PROJECT_URL,BASE_WORKLOAD_URL} from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { getQueryParam } from "../../../helper/SearchParams";

import { UserInfoData } from "../../@types/user-management-types/GetUser";
import { getRoleWorkloadFailure,getRoleWorkloadRequest,getRoleWorkloadSuccess } from "../../slice/user-management-slice/GetRoleWorkloadSlice";

let isGetWorkload = false;
function* handleGetRoleWorkloadInfo(action: {
    type: string;
    payload: { 
      data: Record<string, unknown>,
      queryparams: string,
    };
  }) {
    if (isGetWorkload) {
      return; // Exit the function to prevent multiple calls
    }
    const { data, queryparams }: {
      data: Record<string, any>,
      queryparams: string
  } = action.payload;

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

 let url = `${BASE_WORKLOAD_URL}${endPoints.role.workload}/${data.id}`;

    if (queryparams && queryparams !== '') {
        url += `?${queryparams}`;
    }


  try {
    isGetWorkload = true;
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
      yield put(getRoleWorkloadSuccess({data}));
    }
  } catch (err: any) {
   
    yield put(getRoleWorkloadFailure(err?.response?.data));
  }
  finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isGetWorkload = false;
  }
}

export function* watchGetRoleWorkloadSaga() {
  yield takeLatest(getRoleWorkloadRequest.type, handleGetRoleWorkloadInfo);
}
