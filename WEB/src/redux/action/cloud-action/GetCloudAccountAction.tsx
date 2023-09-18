import { createAction } from "@reduxjs/toolkit";

export const getCloudPlatformRequest = createAction("getCloudPlatform/getCloudPlatformRequest");
export const getCloudPlatformSuccess = createAction("getCloudPlatform/getCloudPlatformSuccess");
export const getCloudPlatformFailure = createAction("getCloudPlatform/getCloudPlatformFailure");