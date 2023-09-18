import { takeLatest, call, put } from "redux-saga/effects";

import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL,BASE_PROJECT_URL } from "../../../api/ApiPath";


import { PayloadAction } from "@reduxjs/toolkit";
import { discoveryRequest,discoveryFailure,discoverySuccess } from "../../action/discovery-actions/DiscoveryAction";
import { Projects } from "../../@types/project-types/GetProjectTypes";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";

export function* handleDiscovery(action:any) {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
 


  try {
    const response: AppCreationResponse = yield call(API, {
      method: "GET",
      url: `${BASE_PROJECT_URL}${endPoints.cloud.discovery}/${action.payload}?discovery_refresh=true`,
    
      headers: {
         "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response) {
        const { data } = response;
        console.log(data,"data")

      yield put(discoverySuccess(data));
    }
  } catch (err: any) {
    console.log(err,"err")
   
    yield put(discoveryFailure(err?.response?.data));
  } 
}

export function* watchDiscoverySaga() {
  yield takeLatest(discoveryRequest.type, handleDiscovery);
}
