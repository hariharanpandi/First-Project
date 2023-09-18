import { takeLatest, call, put } from "redux-saga/effects";
import {
  forgotPwdRequest,
  forgotPwdSuccess,
  forgotPwdFailure,
  forgotPwdSlice,
} from "../../slice/auth-slice/ForgotPasswordSlice";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";
import {
  ForgotPwdResponse,
  ForgotPwdUser,
} from "../../@types/auth-types/ForgotPwdTypes";
import { PayloadAction } from "@reduxjs/toolkit";

export function* handleForgotPassword(action: {
  type: string;
  payload: { email: string };
}) {
  const {
    payload: { email },
  } = action;

  try {
    const response: ForgotPwdResponse = yield call(API, {
      method: "POST",
      url: `${BASE_URL}${endPoints.auth.forgotPassword}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: action.payload.email,
      },
    });
    if (response) {
      const { data } = response;

      yield put(forgotPwdSuccess(data));
    } else {
      const errorMessage: string = "Login failed";
      yield put(forgotPwdFailure(errorMessage));
    }
  } catch (err: any) {
    yield put(forgotPwdFailure(err.response.data));
  }
}

export function* watchForgotPasswordSaga() {
  yield takeLatest(forgotPwdRequest.type, handleForgotPassword);
}
