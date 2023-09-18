import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetRoleProject";


/* Creating an action creator functions*/
export const getRoleRequest = createAction("getRole/getRoleRequest");
export const getRoleSuccess = createAction<UserInfoData>("getRole/getRoleSuccess");
export const getRoleFailure = createAction<string>("getRole/getRoleFailure");

