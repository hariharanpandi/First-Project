import { createAction } from "@reduxjs/toolkit";

import { UserProfile } from "../../../@types/setting-types/profile-setting/ProfileSettingTypes";

/* Creating an action creator functions*/
export const profileInfoRequest = createAction("profileInfo/profileInfoRequest");
export const profileInfoSuccess = createAction<UserProfile>("profileInfo/profileInfoSuccess");
export const profileInfoFailure = createAction<string>("profileInfo/profileInfoFailure");
