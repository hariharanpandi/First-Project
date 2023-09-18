import { createAction } from "@reduxjs/toolkit";

export const getCloudResourceGroupRequest = createAction("getCloudResourceGroup/getCloudResourceGroupRequest");
export const getCloudResourceGroupSuccess = createAction("getCloudResourceGroup/getCloudResourceGroupSuccess");
export const getCloudResourceGroupFailure = createAction("getCloudResourceGroup/getCloudResourceGroupFailure");