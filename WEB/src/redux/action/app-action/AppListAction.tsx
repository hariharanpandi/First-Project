import { createAction } from "@reduxjs/toolkit";
import { AppListResponse } from "../../@types/app-types/AppListTypes";


/* Creating an action creator functions*/
export const  appListRequest = createAction<any>("appList/appListRequest");
export const appListSuccess = createAction<AppListResponse>("appList/appListSuccess");
export const appListFailure = createAction<string>("appList/appListFailure");

