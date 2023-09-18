import { createAction } from "@reduxjs/toolkit";
import { AppCreationResponse } from "../../@types/app-types/CreateAppTypes";

/* Creating an action creator functions*/
export const createAppRequest = createAction<AppCreationResponse>("createApp/createAppRequest");
export const createAppSuccess = createAction<any>("createApp/createAppSuccess");
export const createAppFailure = createAction<string>("createApp/createAppFailure");
