import { createAction } from "@reduxjs/toolkit";

import { PasswordRequest,PasswordProfile } from "../../../@types/setting-types/profile-setting/UpdatePassword";

/* Creating an action creator functions*/
export const passwordUpdateRequest = createAction<PasswordRequest>("passwordUpdate/passwordUpdateRequest");
export const passwordUpdateSuccess = createAction<PasswordProfile>("passwordUpdate/passwordUpdateSuccess");
export const passwordUpdateFailure= createAction<string>("passwordUpdate/passwordUpdateFailure");
