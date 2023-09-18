import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    getCloudCategorySuccess,
    getCloudCategoryFailure,
    getCloudCategoryRequest,
} from "../../slice/workload-slice/getCloudCategorySlice";
let isCloud= false;

function* handleCloudCategory({ payload }: { type: string; payload: Record<string, any> }) {
    if (isCloud) {
        return; // Exit the function to prevent multiple calls
      }

    const { queryparams } = payload;

    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.cloudCategory}`;

    if (queryparams && queryparams !== '') {
        url += `?${queryparams}`;
    }

    const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

    try {
        isCloud = true;
        const response: AxiosResponse<string> = yield call(API, {
            method: "GET",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response) {
            yield put(getCloudCategorySuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in CloudCategorySaga', error?.message);
        yield put(getCloudCategoryFailure(error?.message));
    }
    finally {
        // Set the isCreatingProject flag to false to indicate that the API call has completed
        isCloud = false;
      }
}

export function* watchHandleCloudCategory() {
    yield takeLatest(getCloudCategoryRequest.type, handleCloudCategory);
}
