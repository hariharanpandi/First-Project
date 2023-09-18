import { createAction } from "@reduxjs/toolkit";
import { UserEditType,UserEditResponse } from "../../@types/user-management-types/UpdateUser";

/* Creating an action creator functions*/
export const editUserRequest = createAction<any>("editUser/editUserRequest");
export const editUserSuccess = createAction<UserEditResponse>("editUser/editUserSuccess");
export const editUserFailure = createAction<string>("editUser/editUserFailure");
