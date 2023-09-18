import { createAction } from "@reduxjs/toolkit";

import { ChangePwdResponse ,ChangePwdUser, changePwdUserRequest} from "../../@types/auth-types/ChangePassword";

/* Creating an action creator functions*/
export const changePwdRequest = createAction<changePwdUserRequest>("changePwd/changePwdRequest");
export const changePwdSuccess = createAction<any>("changePwd/changePwdSuccess");
export const changePwdFailure = createAction<string>("changePwd/changePwdFailure");
