import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../axios";
import { setLocalStorage } from "../../../helper/LocalStorage";
import { User, LoginResponse, Error } from "../../@types/auth-types/AuthTypes";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";
import {
  changePwdRequest,
  changePwdFailure,
  changePwdSuccess,
} from "../../action/auth-action/ChangePwdAction";
import { ChangePwdResponse } from "../../@types/auth-types/ChangePassword";
import { getQueryParam } from "../../../helper/SearchParams";

export function* handleChangePassword(action: {
  type: string;
  payload: { userid: string; password: string };
}) {
  const {
    payload: { userid, password },
  } = action;

  const userId = getQueryParam('id');

  try {
    const loginResponse: ChangePwdResponse = yield call(API, {
      method: "POST",
      url: `${BASE_URL}${endPoints.auth.changePassword}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userid:userId,
        password:password,
      },
    });

    if (loginResponse) {
      const { data } = loginResponse;

      yield put(changePwdSuccess(data));
    } else {
      const errorMessage: string = "Login failed";

      yield put(changePwdFailure(errorMessage));
      
      // localStorage.clear();
    }
  } catch (err: any) {
    yield put(changePwdFailure(err.response.data));
  }
}

export function* watchChangePwdSaga() {
  yield takeLatest(changePwdRequest.type, handleChangePassword);
}
