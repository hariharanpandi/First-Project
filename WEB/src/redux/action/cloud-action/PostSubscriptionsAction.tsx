import { createAction } from "@reduxjs/toolkit";
import { Subscriptions } from "../../@types/cloud-types/PostSubscriptionsTypes";

export const postSubscriptionsRequest = createAction<Subscriptions>("postSubscriptions/postSubscriptionsRequest");
export const postSubscriptionsSuccess = createAction("postSubscriptions/postSubscriptionsSuccess");
export const postSubscriptionsFailure = createAction("postSubscriptions/postSubscriptionsFailure");