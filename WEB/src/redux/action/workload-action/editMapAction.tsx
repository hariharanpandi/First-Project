import { createAction } from "@reduxjs/toolkit";
import { CreateMapRequest,CreateMapResponse } from "../../@types/workload-types/workloadTypes"; 
/* Creating an action creator functions*/
export const editMapRequest = createAction<CreateMapRequest>("editMap/editMapRequest");
export const editMapSuccess = createAction<CreateMapResponse>("editMap/editMapSuccess");
export const editMapFailure = createAction<string>("editMap/editMapFailure");
