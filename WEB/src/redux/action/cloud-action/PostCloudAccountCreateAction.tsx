import { createAction } from "@reduxjs/toolkit";
import { CloudAccountCreate } from "../../@types/cloud-types/PostCloudAccountCreateType";

export const postCloudAccountCreateRequest = createAction<CloudAccountCreate>("postCloudAccountCreate/postCloudAccountCreateRequest");
export const postCloudAccountCreateSuccess = createAction("postCloudAccountCreate/postCloudAccountCreateSuccess");
export const postCloudAccountCreateFailure = createAction("postCloudAccountCreate/postCloudAccountCreateFailure");