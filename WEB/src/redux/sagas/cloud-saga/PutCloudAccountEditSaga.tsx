import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { CloudAccountCreate } from "../../@types/cloud-types/PostCloudAccountCreateType";
import { AxiosResponse } from "axios";
import {
    putCloudAccountEditSuccess,
    putCloudAccountEditFailure,
    putCloudAccountEditRequest,
} from "../../slice/cloud-slice/PutCloudAccountEditSlice";

function* handlePutCloudAccountEdit({ payload }: { type: string; payload: CloudAccountCreate }) {
    const { data, queryparams }: {
        data: Record<string, any>,
        queryparams: string
    } = payload;

    let url = `${BASE_PROJECT_URL}${endPoints.cloud.cloudAccountEdit}`;

    if (queryparams && queryparams !== '') {
        url += `?${queryparams}`;
    }

    const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

    try {
        const response: AxiosResponse<string> = yield call(API, {
            method: "PUT",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            data,
        });

        if (response) {
            yield put(putCloudAccountEditSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in PutCloudAccountEditSaga', error?.message);
        yield put(putCloudAccountEditFailure(error?.message));
    }
}

export function* watchHandlePutCloudAccountEdit() {
    yield takeLatest(putCloudAccountEditRequest.type, handlePutCloudAccountEdit);
}
