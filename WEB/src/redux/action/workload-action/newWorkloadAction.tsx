import { createAction } from "@reduxjs/toolkit";
import { CreateMapRequest,CreateMapResponse } from "../../@types/workload-types/workloadTypes"; 
/* Creating an action creator functions*/
export const newWorkloadRequest = createAction<CreateMapRequest>("newWorkload/newWorkloadRequest");
export const newWorkloadSuccess = createAction<CreateMapResponse>("newWorkload/newWorkloadSuccess");
export const newWorkloadFailure = createAction<string>("newWorkload/newWorkloadFailure");
