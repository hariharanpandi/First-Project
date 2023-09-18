import { createAction } from "@reduxjs/toolkit";
import { UserCreationType,UserCreationResponse } from "../../@types/user-management-types/CreateUser";

/* Creating an action creator functions*/
export const createUserRequest = createAction<UserCreationType>("createUser/createUserRequest");
export const createUserSuccess = createAction<UserCreationResponse>("createUser/createUserSuccess");
export const createUserFailure = createAction<string>("createUser/createUserFailure");
export const createUserReset = createAction("createUser/createUserReset");
