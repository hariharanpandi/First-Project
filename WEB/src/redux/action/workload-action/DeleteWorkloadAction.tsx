import { createAction } from "@reduxjs/toolkit";
import { WorkloadDeleteResponse } from "../../@types/workload-types/DeleteWorkloadType";



/* Creating an action creator functions*/
export const deleteWorkloadRequest = createAction<string>("deleteWorkload/deleteWorkloadRequest");
export const deleteWorkloadSuccess = createAction<WorkloadDeleteResponse>("deleteWorkload/deleteWorkloadSuccess");
export const deleteWorkloadFailure= createAction<string>("deleteWorkload/deleteWorkloadFailure");