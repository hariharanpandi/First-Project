// import { endPoints } from "./EndPoints";
// import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
// import { getLoggedUser } from "../helper/auth";

// // Create our baseQuery instance
// const baseQuery = fetchBaseQuery({
// 	baseUrl: endPoints.baseUrl,
// 	prepareHeaders: headers => {
// 		// By default, if we have a token in the store, let's use that for authenticated requests
// 		const token = localStorage.getItem("sessionId");
// 		if (token) {
// 			headers.set("authorization", `Bearer ${token}`);
// 		}
// 		return headers;
// 	}
// });

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */

import React from 'react';

export const index = () => {
  return (
    <div>index</div>
  )
}


