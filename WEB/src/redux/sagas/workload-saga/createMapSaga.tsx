import { takeLatest, call, put } from "redux-saga/effects";
import { createMapRequest,createMapFailure,createMapSuccess } from "../../slice/workload-slice/createMapSaga";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";

import API from "../../axios";
import { CreateMapResponse } from "../../@types/workload-types/workloadTypes";

// Define a variable to keep track of whether the API call is in progress
let isCreatingProject = false;

function* handleCreateMap(action:any) {
  // Check if another API call is already in progress
  if (isCreatingProject) {
    return; // Exit the function to prevent multiple calls
  }





  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    // Set the isCreatingProject flag to true to indicate that an API call is in progress
    isCreatingProject = true;

    const response: CreateMapResponse = yield call(API, {
      method: "POST",
      url: `${BASE_WORKLOAD_URL}${endPoints.workload.createMapping}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
    });

    if (response) {
      const { data } = response;
      yield put(createMapSuccess(data));
    }
  } catch (err: any) {

    yield put(createMapFailure(err?.response?.data));
  } finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isCreatingProject = false;
  }
}

export function* watchCreateMapSaga() {
  yield takeLatest(createMapRequest.type, handleCreateMap);
}