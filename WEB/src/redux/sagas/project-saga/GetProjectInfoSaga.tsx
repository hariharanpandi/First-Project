import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { getQueryParam } from "../../../helper/SearchParams";
import {
  getProjectInfoFailure,
  getProjectInfoRequest,
  getProjectInfoSuccess,
} from "../../action/project-action/GetProjectInfoAction";
import { ProjectInfoData } from "../../@types/project-types/GetProjectInfoTypes";
import _ from "lodash";

function* handleGetProjectInfo(action:any) {
  const projectId = getQueryParam("projectId");

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    if (!_.isNil(action?.payload)) {
    const response: ProjectInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.account.projectInfo.get}${action.payload}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getProjectInfoSuccess({data}));
    }
    } else {
      yield put(getProjectInfoFailure(''));
    }
  } catch (err: any) {
    
    yield put(getProjectInfoFailure(err?.response?.data));
  }
}

export function* watchGetProjectInfoSaga() {
  yield takeLatest(getProjectInfoRequest.type, handleGetProjectInfo);
}
