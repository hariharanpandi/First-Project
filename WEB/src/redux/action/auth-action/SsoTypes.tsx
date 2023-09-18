import { createAction } from "@reduxjs/toolkit";

import { SSOResponse } from "../../@types/auth-types/LoginSsoTypes";

/* Creating an action creator functions*/
export const SSORequest = createAction<any>("sso/SSORequest");
export const SSOSuccess = createAction<SSOResponse>("sso/SSOSuccess");
export const SSOFailure = createAction<string>("sso/SSOFailure");
