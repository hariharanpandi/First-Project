import { createAction } from "@reduxjs/toolkit";
import { ProjectInfoData } from "../../@types/project-types/GetProjectInfoTypes";



/* Creating an action creator functions*/
export const getProjectInfoRequest = createAction<string>("getProjectInfo/getProjectInfoRequest");
export const getProjectInfoSuccess = createAction<ProjectInfoData>("getProjectInfo/getProjectInfoSuccess");
export const getProjectInfoFailure = createAction<string>("getProjectInfo/getProjectInfoFailure");

