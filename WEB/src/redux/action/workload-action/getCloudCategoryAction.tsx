import { createAction } from "@reduxjs/toolkit";

export const getCloudCategoryRequest = createAction("getCloudCategory/getCloudCategoryRequest");
export const getCloudCategorySuccess = createAction("getCloudCategory/getCloudCategorySuccess");
export const getCloudCategoryFailure = createAction("getCloudCategory/getCloudCategoryFailure");