import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetUser";


/* Creating an action creator functions*/
export const getStatusRequest = createAction("getStatus/getStatusRequest");
export const getStatusSuccess = createAction<UserInfoData>("getStatus/getStatusSuccess");
export const getStatusFailure = createAction<string>("getStatus/getStatusFailure");

