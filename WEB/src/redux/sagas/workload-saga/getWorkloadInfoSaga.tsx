import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import { getWorkloadInfoFailure, getWorkloadInfoRequest, getWorkloadInfoSuccess } from "../../slice/workload-slice/getWorkloadInfoSlice";


function* handleGetWorkloadInfo({ payload }: { type: string; payload: any }) {

    // let url = `${BASE_WORKLOAD_URL}${endPoints.workload.getWorkloadInfo}?resource_group_id=${'64bf9f7d8780909e8ed85388'}&resource_id=${'i-05c18d2f75277707f'}`;     
    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.getWorkloadInfo}?resource_group_id=${payload.resource_group_id}&resource_id=${payload.resource_id}&workload_id=${payload.workload_id}&cid=${payload.cloud_id}`;     
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
            yield put(getWorkloadInfoSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in GetWorkloadSaga', error?.message);
        yield put(getWorkloadInfoFailure(error?.message));
    }
}

export function* watchHandleGetWorkloadInfo() {
    yield takeLatest(getWorkloadInfoRequest.type, handleGetWorkloadInfo);
}
