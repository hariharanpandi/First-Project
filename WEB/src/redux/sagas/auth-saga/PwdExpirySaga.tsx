import { takeLatest, call, put } from "redux-saga/effects";
import { pwdExpiryFailure,pwdExpiryRequest,pwdExpirySuccess } from "../../slice/auth-slice/PwdExpirySlice";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";
import {
  ForgotPwdResponse,
  ForgotPwdUser,
} from "../../@types/auth-types/ForgotPwdTypes";
import { PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../../helper/LocalStorage";
import { getQueryParam } from "../../../helper/SearchParams";
let isCreatingProject = false;
const user_id = getQueryParam("id")
export function* handlePwdExpiry() {
  if (isCreatingProject || !user_id) {
    return; // Exit the function to prevent multiple calls
  }
 
 

  try {
    isCreatingProject = true;

    const response: ForgotPwdResponse = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.user.expiry}/${user_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      
    });
    if (response) {
      const { data } = response;

      yield put(pwdExpirySuccess(data));
    } 
  } catch (err: any) {

    yield put(pwdExpiryFailure(err?.response?.data));
  }
  finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isCreatingProject = false;
  }
}

export function* watchPwdExpiry() {
  yield takeLatest(pwdExpiryRequest.type, handlePwdExpiry);
}
