import { createAction } from "@reduxjs/toolkit";

export const getWorkloadPriceTaggerRequest = createAction<any>("getWorkloadPriceTagger/getWorkloadPriceTaggerRequest");
export const getWorkloadPriceTaggerSuccess = createAction("getWorkloadPriceTagger/getWorkloadPriceTaggerSuccess");
export const getWorkloadPriceTaggerFailure = createAction("getWorkloadPriceTagger/getWorkloadPriceTaggerFailure");