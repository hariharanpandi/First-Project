import { createAction } from "@reduxjs/toolkit";
import { CloudCountResponse } from "../../@types/discovery-types/CloudCountType";



/* Creating an action creator functions*/
export const fetchCloudCountRequest = createAction("cloudcounts/fetchCloudCountRequest");
export const fetchClodCountSuccess = createAction<CloudCountResponse>("cloudcounts/fetchClodCountSuccess");
export const fetchCloudCountFailure = createAction<string>("cloudcounts/fetchCloudCountFailure");



