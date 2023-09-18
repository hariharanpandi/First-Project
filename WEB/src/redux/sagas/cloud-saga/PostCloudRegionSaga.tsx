import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import { CloudRegion } from "../../@types/cloud-types/PostCloudRegionTypes";
import { postCloudRegionFailure, postCloudRegionRequest, postCloudRegionSuccess } from "../../slice/cloud-slice/PostCloudRegionSlice";

function* handlePostCloudRegion({ payload }: { type: string; payload: CloudRegion }) {
    const { data, queryparams }: {
        data: Record<string, any>,
        queryparams: string
    } = payload;

    let url = `${BASE_PROJECT_URL}${endPoints.cloud.getRegion}`;

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
            yield put(postCloudRegionSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in PostCloudRegionSaga', error?.message);
        yield put(postCloudRegionFailure(error?.message));
    }
}

export function* watchHandleCloudRegion() {
    yield takeLatest(postCloudRegionRequest.type, handlePostCloudRegion);
}
