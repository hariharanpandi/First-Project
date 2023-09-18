import { createAction } from "@reduxjs/toolkit";
import { ProjectInfoInitData } from "../../@types/project-types/GetProjectInfoInitTypes";

/* Creating an action creator functions*/
export const getProjectInfoInitRequest = createAction("getProjectInfoInit/getProjectInfoInitRequest");
export const getProjectInfoInitSuccess = createAction<ProjectInfoInitData>("getProjectInfoInit/getProjectInfoInitSuccess");
export const getProjectInfoInitFailure = createAction<string>("getProjectInfoInit/getProjectInfoInitFailure");

