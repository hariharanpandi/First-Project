import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetManageUser";


/* Creating an action creator functions*/
export const getManageUserRequest = createAction<any>("getManageUser/getManageUserRequest");
export const getManageUserSuccess = createAction<UserInfoData>("getManageUser/getManageUserSuccess");
export const getManageUserFailure = createAction<string>("getManageUser/getManageUserFailure");

