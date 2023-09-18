import { takeLatest, call, put } from "redux-saga/effects";
import {
  loginSuccess,
  loginFailure,
  loginRequest,
} from "../../action/auth-action/AuthAction";

import API from "../../axios";
import { setLocalStorage } from "../../../helper/LocalStorage";
import { User, LoginResponse, Error } from "../../@types/auth-types/AuthTypes";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";

export function* handleLogin(action: {
  type: string;
  payload: { email: string; password: string };
}) {
  const {
    payload: { email, password },
  } = action;
  try {
    const loginResponse: LoginResponse = yield call(API, {
      method: "POST",
      url: `${BASE_URL}${endPoints.auth.login}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: action.payload.email,
        password: action.payload.password,
      },
    });

    if (loginResponse) {
      const { data } = loginResponse;

      setLocalStorage("token", data?.authDetails?.accessToken);
      setLocalStorage("userId", data?.userDetails?.id);
      setLocalStorage("user_name",data?.userDetails?.name);
      setLocalStorage("user_type",data?.userDetails?.user_type)
      yield put(loginSuccess(loginResponse?.data as LoginResponse));
    } else {
      const errorMessage: string = "Login failed";

      yield put(loginFailure(errorMessage));
    }
  } catch (err: any) {
    yield put(loginFailure(err.response.data));
  }
}

export function* watchLoginSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
