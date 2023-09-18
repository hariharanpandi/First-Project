import { createAction } from "@reduxjs/toolkit";

/* Creating an action creator functions*/
export const updateUserStatusRequest = createAction<any>("updateUserStatus/updateUserStatusRequest");
export const updateUserStatusSuccess = createAction<any>("updateUserStatus/updateUserStatusSuccess");
export const updateUserStatusFailure = createAction<string>("updateUserStatus/updateUserStatusFailure");
