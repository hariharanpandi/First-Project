import { createAction } from "@reduxjs/toolkit";
import { ProjectCreationType,ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes"; 

/* Creating an action creator functions*/
export const projectCreationRequest = createAction<ProjectCreationType>("createProject/projectCreationRequest");
export const projectCreationSuccess = createAction<ProjectCreationResponse>("createProject/projectCreationSuccess");
export const projectCreationFailure = createAction<string>("createProject/projectCreationFailure");
