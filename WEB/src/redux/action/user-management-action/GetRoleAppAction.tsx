import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetRoleProject";


/* Creating an action creator functions*/
export const getRoleAppRequest = createAction("getRoleApp/getRoleAppRequest");
export const getRoleAppSuccess = createAction<UserInfoData>("getRoleApp/getRoleAppSuccess");
export const getRoleAppFailure = createAction<string>("getRoleApp/getRoleAppFailure");

