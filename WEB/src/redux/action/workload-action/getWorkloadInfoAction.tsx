import { createAction } from "@reduxjs/toolkit";

export const getWorkloadInfoRequest = createAction<any>("getWorkloadInfo/getWorkloadInfoRequest");
export const getWorkloadInfoSuccess = createAction("getWorkloadInfo/getWorkloadInfoSuccess");
export const getWorkloadInfoFailure = createAction("getWorkloadInfo/getWorkloadInfoFailure");