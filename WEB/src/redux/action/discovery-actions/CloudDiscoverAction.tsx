import { createAction } from "@reduxjs/toolkit";
import { UserEditType,UserEditResponse } from "../../@types/user-management-types/UpdateUser";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";
/* Creating an action creator functions*/
export const cloudDiscoverRequest = createAction<any>("cloudDiscover/cloudDiscoverRequest");
export const cloudDiscoverSuccess = createAction<any>("cloudDiscover/cloudDiscoverSuccess");
export const cloudDiscoverFailure = createAction<string>("cloudDiscover/cloudDiscoverFailure");
