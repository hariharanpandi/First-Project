import { createAction } from "@reduxjs/toolkit";
import { CloudRegion } from "../../@types/cloud-types/PostCloudRegionTypes";

export const postCloudRegionRequest = createAction<CloudRegion>("postCloudRegion/postCloudRegionRequest");
export const postCloudRegionSuccess = createAction("postCloudRegion/postCloudRegionSuccess");
export const postCloudRegionFailure = createAction("postCloudRegion/postCloudRegionFailure");