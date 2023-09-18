import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    postCloudAccountCreateFailure,
    postCloudAccountCreateRequest,
    postCloudAccountCreateSuccess
} from "../../slice/cloud-slice/PostCloudAccountCreateSlice";
import { CloudAccountCreate } from "../../@types/cloud-types/PostCloudAccountCreateType";

function* handlePostCloudAccountCreate({ payload }: { type: string; payload: CloudAccountCreate }) {
    const { data, queryparams }: {
        data: Record<string, any>,
        queryparams: string
    } = payload;

    let url = `${BASE_PROJECT_URL}${endPoints.cloud.cloudAccountCreate}`;

    if (queryparams && queryparams !== '') {
        url += `?${queryparams}`;
    }

    const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

    try {
        const response: AxiosResponse<string> = yield call(API, {
            method: "POST",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            data,
        });

        if (response) {
            yield put(postCloudAccountCreateSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in PostCloudAccountCreateSaga', error?.message);
        yield put(postCloudAccountCreateFailure(error?.response?.data));
    }
}

export function* watchHandleCloudAccountCreate() {
    yield takeLatest(postCloudAccountCreateRequest.type, handlePostCloudAccountCreate);
}
