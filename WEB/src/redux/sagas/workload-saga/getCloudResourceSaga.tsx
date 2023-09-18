import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    getCloudResourceSuccess,
    getCloudResourceFailure,
    getCloudResourceRequest,
} from "../../slice/workload-slice/getCloudResourceSlice";

function* handleCloudResource({ payload }: { type: string; payload: Record<string, any> }) {

    const { queryparams } = payload;

    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.cloudResource}`;

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
            yield put(getCloudResourceSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in CloudResourceSaga', error?.message);
        yield put(getCloudResourceFailure(error?.message));
    }
}

export function* watchHandleCloudResource() {
    yield takeLatest(getCloudResourceRequest.type, handleCloudResource);
}
