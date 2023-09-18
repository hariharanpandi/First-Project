import { createAction } from "@reduxjs/toolkit";

export const getCloudAccountNameRequest = createAction("getCloudAccountName/getCloudAccountNameRequest");
export const getCloudAccountNameSuccess = createAction("getCloudAccountName/getCloudAccountNameSuccess");
export const getCloudAccountNameFailure = createAction("getCloudAccountName/getCloudAccountNameFailure");