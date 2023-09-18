import { createAction } from "@reduxjs/toolkit";
import { CloudUserData } from "../../@types/discovery-types/CloudUserTypes";

interface payLoad {
    id?: string,
    queryparams: string,
}

/* Creating an action creator functions*/
export const getCloudUserRequest = createAction<payLoad>("getCloudUser/getCloudUserRequest");
export const getCloudUserSuccess = createAction<CloudUserData>("getCloudUser/getCloudUserSuccess");
export const getCloudUserFailure = createAction<string>("getCloudUser/getCloudUserFailure");

