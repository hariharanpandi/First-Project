import { createAction } from "@reduxjs/toolkit";
import { ProjectEditResponse,ProjectEditType } from "../../@types/project-types/EditProjectTypes";

/* Creating an action creator functions*/
export const editProjectRequest = createAction<ProjectEditType>("editProject/editProjectRequest");
export const editProjectSuccess = createAction<ProjectEditResponse>("editProject/editProjectSuccess");
export const editProjectFailure = createAction<string>("editProject/editProjectFailure");
