import { createAction } from "@reduxjs/toolkit";



/* Creating an action creator functions*/
export const getRoleRequest = createAction<any>("getRole/getRoleRequest");
export const getRoleSuccess = createAction<any>("getRole/getRoleSuccess");
export const getRoleFailure = createAction<string>("getRole/getRoleFailure");

