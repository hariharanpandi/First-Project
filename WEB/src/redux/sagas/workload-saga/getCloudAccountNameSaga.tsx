import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    getCloudAccountNameSuccess,
    getCloudAccountNameFailure,
    getCloudAccountNameRequest,
} from "../../slice/workload-slice/getCloudAccountNameSlice";

function* handleGetCloudAccountName({ payload }: { type: string; payload: Record<string, any> }) {

    const { queryparams } = payload;

    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.getCloudAccountName}`;

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
            yield put(getCloudAccountNameSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in getCloudAccountNameSaga', error?.message);
        yield put(getCloudAccountNameFailure(error?.message));
    }
}

export function* watchHandleGetCloudAccountName() {
    yield takeLatest(getCloudAccountNameRequest.type, handleGetCloudAccountName);
}
