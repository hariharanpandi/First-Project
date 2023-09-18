import { createAction } from "@reduxjs/toolkit";

import { ProjectDeleteResponse } from "../../@types/project-types/DeleteProjectTypes";
import { ProjectRequest } from "../../@types/project-types/DeleteProjectTypes";

/* Creating an action creator functions*/
export const deleteUserRequest = createAction<string>("deleteUser/deleteUserRequest");
export const deleteUserSuccess = createAction<ProjectDeleteResponse>("deleteUser/deleteUserSuccess");
export const deleteUserFailure= createAction<string>("deleteUser/deleteUserFailure");
