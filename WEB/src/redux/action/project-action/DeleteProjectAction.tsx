import { createAction } from "@reduxjs/toolkit";
import { ProjectDeleteResponse } from "../../@types/project-types/DeleteProjectTypes";
import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";

/* Creating an action creator functions*/
export const deleteProjectRequest = createAction<string>("deleteProject/deleteProjectRequest");
export const deleteProjectSuccess = createAction<ProjectDeleteResponse>("deleteProject/deleteProjectSuccess");
export const deleteProjectFailure= createAction<string>("deleteProject/deleteProjectFailure");
