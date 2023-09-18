import { takeLatest, call, put } from "redux-saga/effects";
import { forgotPwdRequest } from "../../slice/auth-slice/ForgotPasswordSlice";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { SSO_USERSVC_URL } from "../../../api/ApiPath";
import { SSOUser, SSOResponse } from "../../@types/auth-types/LoginSsoTypes";
import { PayloadAction } from "@reduxjs/toolkit";
import { SSOFailure, SSORequest, SSOSuccess } from "../../slice/auth-slice/SsoSlice";
import { useNavigate } from "react-router";
import {navigateToUrl} from "../../../helper/navigate"


export function* handleSSO(action: {
  type: string;
  payload: { domain: string; };
}) 
{

 
  try {
    const response: SSOResponse = yield call(API, {
      method: "GET",
      url: `${SSO_USERSVC_URL}/sso-proxy?domain_name=${action.payload.domain}`,
      headers:{
        "Content-Type": "text/html",            
      },

    });
    if (response) {
   
      navigateToUrl(response?.data);
      yield put(SSOSuccess(response));
    
    } 
   
  } catch (error: any) {
    
    yield put(SSOFailure(error?.response?.data));
  }
}

export function* watchSSOSaga() {
  yield takeLatest(SSORequest.type, handleSSO);
}
