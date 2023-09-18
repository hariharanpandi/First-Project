import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL, BASE_PROJECT_URL } from "../../../api/ApiPath";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  deleteAppRequest,
  deleteAppFailure,
  deleteAppSuccess,
} from "../../slice/app-slice/DeleteAppSlice";
import { AppDeleteResponse } from "../../@types/app-types/DeleteAppTypes";

export function* handleDeleteApp(action: any) {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    const response: AppDeleteResponse = yield call(API, {
      method: "DELETE",
      url: `${BASE_PROJECT_URL}${endPoints.application.delete}/${action.payload}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response) {
      const { data } = response;

      yield put(deleteAppSuccess(data));
    }
  } catch (err: any) {
    yield put(deleteAppFailure(err.response.data));
  }
}

export function* watchDeleteAppSaga() {
  yield takeLatest(deleteAppRequest.type, handleDeleteApp);
}
