import { createAction } from "@reduxjs/toolkit";

export const manageUserRequest = createAction("manageUser/manageUserRequest");
export const manageUserSuccess = createAction("manageUser/manageUserSuccess");
export const manageUserFailure = createAction("manageUser/manageUserFailure");