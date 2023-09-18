import { createAction } from "@reduxjs/toolkit";
import { User, LoginResponse ,Error} from "../../@types/auth-types/AuthTypes";

/* Creating an action creator functions*/
export const loginRequest = createAction<User>("auth/loginRequest");
export const loginSuccess = createAction<LoginResponse>("auth/loginSuccess");
export const loginFailure = createAction<string>("auth/loginFailure");
