import { createAction } from "@reduxjs/toolkit";
import { ForgotPwdResponse, ForgotPwdUser } from "../../@types/auth-types/ForgotPwdTypes";

/* Creating an action creator functions*/
export const forgotPwdRequest = createAction<ForgotPwdUser>("forgotPwd/forgotPwdRequest");
export const forgotPwdSuccess = createAction<ForgotPwdResponse>("forgotPwd/forgotPwdSuccess");
export const forgotPwdFailure = createAction<string>("forgotPwd/forgotPwdFailure");
