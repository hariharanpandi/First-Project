import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { VerifyConnection } from "../../@types/cloud-types/PostVerifyConnectionTypes";
import { postVerifyConnectionFailure, postVerifyConnectionSuccess, postVerifyConnectionRequest } from "../../slice/cloud-slice/PostVerifyConnectionSlice";
import { AxiosResponse } from "axios";

function* handlePostVerifyConnection({ payload }: { type: string; payload: VerifyConnection }) {
  const { data, queryparams }: {
    data: Record<string, any>,
    queryparams: string
  } = payload;

  let url = `${BASE_PROJECT_URL}${endPoints.cloud.verifyConnection}`;

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
      yield put(postVerifyConnectionSuccess(response.data));
    }
  } catch (error: any) {
    console.log('Error occurred in PostVerifyConnectionSaga', error?.message);
    yield put(postVerifyConnectionFailure(error?.message));
  }
}

export function* watchHandleVerifyConnection() {
  yield takeLatest(postVerifyConnectionRequest.type, handlePostVerifyConnection);
}
