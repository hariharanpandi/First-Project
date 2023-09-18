import { createAction } from "@reduxjs/toolkit";

import { AppDeleteResponse } from "../../@types/app-types/DeleteAppTypes";

/* Creating an action creator functions*/
export const deleteAppRequest = createAction<string>("deleteApp/deleteAppRequest");
export const deleteAppSuccess = createAction<AppDeleteResponse>("deleteApp/deleteAppSuccess");
export const deleteAppFailure= createAction<string>("deleteApp/deleteAppFailure");
