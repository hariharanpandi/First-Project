import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import { Subscriptions } from "../../@types/cloud-types/PostSubscriptionsTypes";
import { postSubscriptionsFailure, postSubscriptionsRequest, postSubscriptionsSuccess } from "../../slice/cloud-slice/PostSubscriptionsSlice";

function* handlePostSubscriptions({ payload }: { type: string; payload: Subscriptions }) {
    const { data, queryparams }: {
        data: Record<string, any>,
        queryparams: string
    } = payload;

    let url = `${BASE_PROJECT_URL}${endPoints.cloud.getSubscriptions}`;

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
            yield put(postSubscriptionsSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in PostSubscriptionsSaga', error?.message);
        yield put(postSubscriptionsFailure(error?.message));
    }
}

export function* watchHandleSubscriptions() {
    yield takeLatest(postSubscriptionsRequest.type, handlePostSubscriptions);
}
