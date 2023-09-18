import { createAction } from "@reduxjs/toolkit";

export const getCloudResourceRequest = createAction("getCloudResource/getCloudResourceRequest");
export const getCloudResourceSuccess = createAction("getCloudResource/getCloudResourceSuccess");
export const getCloudResourceFailure = createAction("getCloudResource/getCloudResourceFailure");