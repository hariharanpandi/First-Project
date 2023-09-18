import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    getCloudAccountSuccess,
    getCloudAccountFailure,
    getCloudAccountRequest
} from "../../slice/cloud-slice/GetCloudAccountSlice";

function* handleGetCloudAccount({ payload }: { type: string; payload: string }) {
    const cloudAccountId = payload;

    let url = `${BASE_PROJECT_URL}${endPoints.cloud.getCloudDetails}/${cloudAccountId}`;

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
            yield put(getCloudAccountSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in GetCloudAccountSaga', error?.message);
        yield put(getCloudAccountFailure(error?.message));
    }
}

export function* watchHandleGetCloudAccount() {
    yield takeLatest(getCloudAccountRequest.type, handleGetCloudAccount);
}
