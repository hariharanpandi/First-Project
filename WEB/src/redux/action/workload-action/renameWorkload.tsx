import { createAction } from "@reduxjs/toolkit";
import { CreateMapRequest,CreateMapResponse } from "../../@types/workload-types/workloadTypes"; 
/* Creating an action creator functions*/
export const renmaeRequest = createAction<CreateMapRequest>("rename/renameRequest");
export const renameSuccess = createAction<CreateMapResponse>("rename/renameSuccess");
export const renameFailure = createAction<string>("rename/renameFailure");
