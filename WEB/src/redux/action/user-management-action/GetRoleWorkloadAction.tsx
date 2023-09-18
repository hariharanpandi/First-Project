import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetRoleWorkload";


/* Creating an action creator functions*/
export const getRoleWorkloadRequest = createAction("getRoleWorkload/getRoleWorkloadRequest");
export const getRoleWorkloadSuccess = createAction<UserInfoData>("getRoleWorkload/getRoleWorkloadSuccess");
export const getRoleWorkloadFailure = createAction<string>("getRoleWorkload/getRoleWorkloadFailure");

