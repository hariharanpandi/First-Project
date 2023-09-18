import { createAction } from "@reduxjs/toolkit";
import { UserEditType,UserEditResponse } from "../../@types/user-management-types/UpdateUser";
import { CloudDiscoveryResponse } from "../../@types/discovery-types/DiscoveryTypes";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";

/* Creating an action creator functions*/
export const discoveryRequest = createAction<any>("discovery/discoveryRequest");
export const discoverySuccess = createAction<any>("discovery/discoverySuccess");
export const discoveryFailure = createAction<string>("discovery/discoveryFailure");
