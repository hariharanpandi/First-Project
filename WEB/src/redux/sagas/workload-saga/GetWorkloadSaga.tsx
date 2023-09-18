import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import { getWorkloadFailure, getWorkloadRequest, getWorkloadSuccess } from "../../slice/workload-slice/GetWorkloadSlice";
let isGetWorkload = false;

function* handleGetWorkload({ payload }: { type: string; payload: any }) {
    if (isGetWorkload) {
        return; // Exit the function to prevent multiple calls
      }

    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.getWorkload}${payload.app_id}&limit=${payload?.limit}&count=${payload?.page}`;     

    const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

    try {
        isGetWorkload = true;
        const response: AxiosResponse<string> = yield call(API, {
            method: "GET",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response) {
            yield put(getWorkloadSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in GetWorkloadSaga', error?.message);
        yield put(getWorkloadFailure(error?.message));
    }
    finally {
        // Set the isCreatingProject flag to false to indicate that the API call has completed
        isGetWorkload = false;
      }
}

export function* watchHandleGetWorkload() {
    yield takeLatest(getWorkloadRequest.type, handleGetWorkload);
}
