import { createAction } from "@reduxjs/toolkit";


import { DeleteRequest, DeleteResponse } from "../../../@types/setting-types/profile-setting/DeleteAccount";

/* Creating an action creator functions*/
export const deleteAccountRequest = createAction<DeleteRequest>("deleteAccount/deleteAccountRequest");
export const deleteAccountSuccess = createAction<DeleteResponse>("deleteAccount/deleteAccountSuccess");
export const deleteAccountFailure= createAction<string>("deleteAccount/deleteAccountFailure");
