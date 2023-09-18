import { createAction } from "@reduxjs/toolkit";

export const getCloudAccountRequest = createAction("getCloudAccount/getCloudAccountRequest");
export const getCloudAccountSuccess = createAction("getCloudAccount/getCloudAccountSuccess");
export const getCloudAccountFailure = createAction("getCloudAccount/getCloudAccountFailure");