import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import {
    manageUserSuccess,
    manageUserFailure,
    manageUserRequest
} from "../../slice/user-management-slice/manageUserSlice";

function* handleGetManageUser({ payload }: { type: string; payload: string }) {
    const projectId = payload;

    let url = `${BASE_URL}${endPoints.user.getManageUser}/${projectId}`;

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
            yield put(manageUserSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in GetManageUserSaga', error?.message);
        yield put(manageUserFailure(error?.message));
    }
}

export function* watchHandleGetManageUser() {
    yield takeLatest(manageUserRequest.type, handleGetManageUser);
}
