import { createAction } from "@reduxjs/toolkit";
import { CreateMapRequest,CreateMapResponse } from "../../@types/workload-types/workloadTypes"; 

/* Creating an action creator functions*/
export const createMapRequest = createAction<CreateMapRequest>("createMap/createMapRequest");
export const createMapSuccess = createAction<CreateMapResponse>("createMap/createMapSuccess");
export const createMapFailure = createAction<string>("createMap/createMapFailure");
