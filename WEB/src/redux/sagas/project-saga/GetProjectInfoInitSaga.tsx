import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import API from "../../axios";
import { ProjectInfoData } from "../../@types/project-types/GetProjectInfoTypes";
import { getProjectInfoInitRequest, getProjectInfoInitSuccess, getProjectInfoInitFailure } from "../../slice/project-slice/GetProjectInfoInitSlice";

function* handleGetProjectInfoInit() {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    const response: ProjectInfoData = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.account.projectInfoInit.get}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = response.data;

    if (response) {
      yield put(getProjectInfoInitSuccess({ data }));
    }
  } catch (err: any) {
    
    yield put(getProjectInfoInitFailure(err?.response?.data));
  }
}

export function* watchGetProjectInfoInitSaga() {
  yield takeLatest(getProjectInfoInitRequest.type, handleGetProjectInfoInit);
}
