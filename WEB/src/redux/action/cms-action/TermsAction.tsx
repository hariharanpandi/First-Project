import { createAction } from "@reduxjs/toolkit";
import { TermsSerResponse } from "../../@types/cms-types/TermsTypes";

export const fetchTermsAndConditionsRequest = createAction("termsAndConditions/fetchTermsAndConditionsRequest");
export const fetchTermsAndConditionsSuccess = createAction<TermsSerResponse>("termsAndConditions/fetchTermsAndConditionsSuccess");
export const fetchTermsAndConditionsFailure = createAction<string>("termsAndConditions/fetchTermsAndConditionsFailure");