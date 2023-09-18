import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetRoleProject";


/* Creating an action creator functions*/
export const getRoleProjectRequest = createAction<any>("getRoleProject/getRoleProjectRequest");
export const getRoleProjectSuccess = createAction<UserInfoData>("getRoleProject/getRoleProjectSuccess");
export const getRoleProjectFailure = createAction<string>("getRoleProject/getRoleProjectFailure");

