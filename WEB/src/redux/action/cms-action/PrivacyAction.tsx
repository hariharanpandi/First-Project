import { createAction } from "@reduxjs/toolkit";
import { PrivacyPolResponse } from "../../@types/cms-types/PrivacyTypes";

export const PrivacyPolycyRequest = createAction("privacyPolicy/PrivacyPolycyRequest");
export const PrivacyPolycySuccess = createAction<PrivacyPolResponse>("privacyPolicy/PrivacyPolycySuccess");
export const PrivacyPolycyFailure = createAction<string>("privacyPolicy/PrivacyPolycyFailure");