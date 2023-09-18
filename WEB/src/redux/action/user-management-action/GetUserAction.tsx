import { createAction } from "@reduxjs/toolkit";
import { UserInfoData } from "../../@types/user-management-types/GetUser";

interface payLoad {
    id?: string,
    queryparams: string,
}

/* Creating an action creator functions*/
export const getUserRequest = createAction<payLoad>("getUser/getUserRequest");
export const getUserSuccess = createAction<UserInfoData>("getUser/getUserSuccess");
export const getUserFailure = createAction<string>("getUser/getUserFailure");

