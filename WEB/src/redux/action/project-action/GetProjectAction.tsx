import { createAction } from "@reduxjs/toolkit";
import { Projects } from "../../@types/project-types/GetProjectTypes";



/* Creating an action creator functions*/
export const getProjectRequest = createAction("getProject/getProjectRequest");
export const getProjectSuccess = createAction<Projects>("getProject/getProjectSuccess");
export const getProjectFailure = createAction<string>("getProject/getProjectFailure");

