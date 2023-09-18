import { createAction } from "@reduxjs/toolkit";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";
/* Creating an action creator functions*/
export const GetAppRequest = createAction<any>("GetApp/GetAppRequest");
export const GetAppSuccess = createAction<AppCreationResponse>("GetApp/GetAppSuccess");
export const GetAppFailure = createAction<string>("GetApp/GetAppFailure");
