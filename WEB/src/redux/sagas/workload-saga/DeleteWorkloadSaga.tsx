import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../axios"
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL,BASE_PROJECT_URL,BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { ProjectDeleteResponse } from "../../@types/project-types/DeleteProjectTypes";
import { deleteWorkloadFailure, deleteWorkloadRequest, deleteWorkloadSuccess } from "../../slice/workload-slice/DeleteWorkloadSlice";




export function* handleDeleteWorkload(action: {
  type: string;
  payload: { deleteId: string };
}) {
  const deleteId = action.payload;
  const userId = localStorage.getItem("userId")?.replace(/"/g, "");

  
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  
  try {
    const response: ProjectDeleteResponse = yield call(API, {
      method: "DELETE",
      url: `${BASE_WORKLOAD_URL}${endPoints.workload.deleteWorkload}/${deleteId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
     
    });

    if (response) {
      const { data } = response;

      yield put(deleteWorkloadSuccess(data));
    }
  } catch (err: any) {
    yield put(deleteWorkloadFailure(err.response.data));
  }
}

export function* watchDeleteWorkloadSaga() {
  yield takeLatest(deleteWorkloadRequest.type, handleDeleteWorkload);
}
