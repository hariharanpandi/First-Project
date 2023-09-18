import { takeLatest, call, put } from "redux-saga/effects";

import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { CreateMapResponse } from "../../@types/workload-types/workloadTypes";
import { getQueryParam } from "../../../helper/SearchParams";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { editMapSuccess,editMapRequest,editMapFailure } from "../../slice/workload-slice/editMapSlice";

function* handleEditMap(action:any) {
 

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response:CreateMapResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_WORKLOAD_URL}${endPoints.workload.editMapping}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: action.payload
    });
    
    if(response) {

      const {data} = response;
      yield put(editMapSuccess(data));
    } 
   

  } catch (err:any) {
  
    yield put(editMapFailure(err?.response?.data));
  }
}


export function* watchEditMapSaga() {
  yield takeLatest(editMapRequest.type, handleEditMap);
}
