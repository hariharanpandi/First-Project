import { createAction } from "@reduxjs/toolkit";
import { ProjectEditResponse,ProjectEditType } from "../../@types/project-types/EditProjectTypes";

/* Creating an action creator functions*/
export const updateAppProjectRequest = createAction<ProjectEditType>("updateApp/updateAppRequest");
export const updateAppSuccess = createAction<ProjectEditResponse>("updateApp/updateAppSuccess");
export const updateAppFailure = createAction<string>("updateApp/updateAppFailure");
