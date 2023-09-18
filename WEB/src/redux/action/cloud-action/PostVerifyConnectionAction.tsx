import { createAction } from "@reduxjs/toolkit";
import { VerifyConnection } from "../../@types/cloud-types/PostVerifyConnectionTypes";

export const postVerifyConnectionRequest = createAction<VerifyConnection>("postVerifyConnection/postVerifyConnectionRequest");
export const postVerifyConnectionSuccess = createAction<string>("postVerifyConnection/postVerifyConnectionSuccess");
export const postVerifyConnectionFailure = createAction<string>("postVerifyConnection/postVerifyConnectionFailure");