import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_PROJECT_URL, BASE_URL } from "../../../api/ApiPath";
import { CloudCountResponse } from "../../@types/discovery-types/CloudCountType";
import { fetchClodCountSuccess, fetchCloudCountFailure, fetchCloudCountRequest } from "../../action/discovery-actions/CloudCoundAction";

export function* handleCloudCounts(action:any) {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  try {
    const response: CloudCountResponse = yield call(API, {
      url: `${BASE_PROJECT_URL}${endPoints.cloud.getCount}${action.payload}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

   
    

    if (response) {
      const { data }:any = response;
      yield put(fetchClodCountSuccess(data));
    } 

  } catch (err: any) {
    yield put(fetchCloudCountFailure(err.response.data));
  }
}

export function* watchCloudCountsSaga() {
  yield takeLatest(
    fetchCloudCountRequest.type,
    handleCloudCounts
  );
}
