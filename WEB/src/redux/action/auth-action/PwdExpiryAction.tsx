import { createAction } from "@reduxjs/toolkit";
import { ForgotPwdResponse, ForgotPwdUser } from "../../@types/auth-types/ForgotPwdTypes";

/* Creating an action creator functions*/
export const  pwdExpiryRequest = createAction(" pwdExpiry/ pwdExpiryRequest");
export const  pwdExpirySuccess = createAction<ForgotPwdResponse>(" pwdExpiry/ pwdExpirySuccess");
export const  pwdExpiryFailure = createAction<string>(" pwdExpiry/ pwdExpiryFailure");
