import { createAction } from "@reduxjs/toolkit";

import { EditWithoutProfile } from "../../../@types/setting-types/profile-setting/EditWithoutProfileTypes";

/* Creating an action creator functions*/
export const profileEditWithoutRequest = createAction<any>("profileEditWithout/profileEditWithoutRequest");
export const profileEditWithoutSuccess = createAction<EditWithoutProfile>("profileEditWithout/profileEditWithoutSuccess");
export const profileEditWithoutFailure = createAction<string>("profileEditWithout/profileEditWithoutFailure");
