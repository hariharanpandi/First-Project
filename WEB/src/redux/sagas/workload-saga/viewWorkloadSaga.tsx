import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { AxiosResponse } from "axios";
import {
  viewWorkloadFailure,
  viewWorkloadRequest,
  viewWorkloadSuccess,
} from "../../slice/workload-slice/viewWorkloadSlice";

function* handleWorkloadView({ payload }: { type: string; payload: any }) {
  let url =
    payload?.select === "priceTagger"
      ? `${BASE_WORKLOAD_URL}${endPoints.workload.viewWorkload}/${payload?.workloadId}?pricetagger=true&start_date=${payload?.start_date}&end_date=${payload?.end_date}&project_id=${payload?.project_id}`
      : `${BASE_WORKLOAD_URL}${endPoints.workload.viewWorkload}/${payload?.workloadId}`;

  const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

  try {
    const response: AxiosResponse<string> = yield call(API, {
      method: "GET",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response) {
      yield put(viewWorkloadSuccess(response.data));
    }
  } catch (error: any) {
    
  
    yield put(viewWorkloadFailure(error?.response?.data));
  }
}

export function* watchHandleViewWorkload() {
  yield takeLatest(viewWorkloadRequest.type, handleWorkloadView);
}
