import { createAction } from "@reduxjs/toolkit";

export const putCloudAccountEditRequest = createAction("putCloudAccountEdit/putCloudAccountEditRequest");
export const putCloudAccountEditSuccess = createAction("putCloudAccountEdit/putCloudAccountEditSuccess");
export const putCloudAccountEditFailure = createAction("putCloudAccountEdit/putCloudAccountEditFailure");