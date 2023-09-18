import { createAction } from "@reduxjs/toolkit";
import { CreateMapRequest,CreateMapResponse } from "../../@types/workload-types/workloadTypes"; 

export const viewWorkloadRequest = createAction<any>("viewWorkload/viewWorkloadRequest");
export const viewWorkloadSuccess = createAction("viewWorkload/viewWorkloadSuccess");
export const viewWorkloadFailure = createAction("viewWorkload/viewWorkloadFailure");