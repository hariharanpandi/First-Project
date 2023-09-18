import { createAction } from "@reduxjs/toolkit";

import { EditProfile } from "../../../@types/setting-types/profile-setting/EditProfileTypes";

/* Creating an action creator functions*/
export const profileEditRequest = createAction<any>("profileEdit/profileEditRequest");
export const profileEditSuccess = createAction<EditProfile>("profileEdit/profileEditSuccess");
export const profileEditFailure = createAction<string>("profileEdit/profileEditFailure");
