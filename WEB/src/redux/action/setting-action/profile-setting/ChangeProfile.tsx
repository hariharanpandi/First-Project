import { createAction } from "@reduxjs/toolkit";

import { EditProfile} from "../../../@types/setting-types/profile-setting/EditProfileTypes";
import { ImageResponse, ProfileRequests } from "../../../@types/setting-types/profile-setting/ChangeProfileTypes";

/* Creating an action creator functions*/
export const profileImageRequest = createAction<any>("profileImage/profileImageRequest");
export const profileImageSuccess = createAction<ImageResponse>("profileImage/profileImageSuccess");
export const profileImageFailure = createAction<string>("profileImage/profileImageFailure");
