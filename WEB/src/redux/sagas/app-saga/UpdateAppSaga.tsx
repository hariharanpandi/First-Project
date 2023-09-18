import { takeLatest, call, put } from "redux-saga/effects";


import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";

import { getQueryParam } from "../../../helper/SearchParams";
import { ProjectEditResponse } from "../../@types/app-types/UpdateApptypes";
import { updateAppFailure, updateAppRequest, updateAppSuccess } from "../../slice/app-slice/UpdateAppSlice";

function* handleUpdateApp(action:any) {
  
  const appId = getQueryParam('app_id');
        
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response:ProjectEditResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_PROJECT_URL}${endPoints.application.update}/${appId}`,      
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
    });
    
    if(response) {

      const {data} = response;
      yield put(updateAppSuccess(data));
    } 
   

  } catch (err:any) {
    
    yield put(updateAppFailure(err?.response?.data));
  }
}


export function* watchUpdateAppSaga() {
  yield takeLatest(updateAppRequest.type, handleUpdateApp);
}
