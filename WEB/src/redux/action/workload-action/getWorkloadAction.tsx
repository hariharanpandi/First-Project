import { createAction } from "@reduxjs/toolkit";

export const getWorkloadRequest = createAction<any>("getWorkload/getWorkloadRequest");
export const getWorkloadSuccess = createAction("getWorkload/getWorkloadSuccess");
export const getWorkloadFailure = createAction("getWorkload/getWorkloadFailure");