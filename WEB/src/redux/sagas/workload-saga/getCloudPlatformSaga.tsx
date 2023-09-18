import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    getCloudPlatformSuccess,
    getCloudPlatformFailure,
    getCloudPlatformRequest,
} from "../../slice/workload-slice/getCloudPlatformSlice";

function* handleCloudPlatform({ payload }: { type: string; payload: Record<string, any> }) {

    const { queryparams } = payload;

    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.cloudPlatformList}`;

    if (queryparams && queryparams !== '') {
        url += `?${queryparams}`;
    }

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
            yield put(getCloudPlatformSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in CloudPlatformSaga', error?.message);
        yield put(getCloudPlatformFailure(error?.message));
    }
}

export function* watchHandleCloudPlatform() {
    yield takeLatest(getCloudPlatformRequest.type, handleCloudPlatform);
}
