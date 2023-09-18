import { takeLatest, call, put } from "redux-saga/effects";
import EditProjectSlice, { editProjectRequest } from "../../slice/project-slice/EditProjectSlice";
import { editProjectSuccess,editProjectFailure } from "../../slice/project-slice/EditProjectSlice";
import { BASE_PROJECT_URL ,BASE_URL} from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { ProjectEditResponse } from "../../@types/project-types/EditProjectTypes";
import { editUserRequest,editUserFailure,editUserSuccess } from "../../slice/user-management-slice/UpdateUserSlice";
import { getQueryParam } from "../../../helper/SearchParams";
import { UserEditResponse } from "../../@types/user-management-types/UpdateUser";
import { cloudDiscoverRequest,cloudDiscoverFailure,cloudDiscoverSuccess } from "../../action/discovery-actions/CloudDiscoverAction";
import { AppCreationResponse } from "../../@types/app-types/getAppInfoTypes";
function* handleCloudDiscovery(action:any) {
  const{
    payload: {username, status},
  } = action;
  const userId= getQueryParam('id');
        
  

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response :AppCreationResponse= yield call(API, {
      method: "PUT",
      url: `${BASE_PROJECT_URL}${endPoints.cloud.cloudDiscover}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
    });
    
    if(response) {
    
      const {data} = response;
      yield put(cloudDiscoverSuccess(data));
    } 
   

  } catch (err:any) {
    console.log(err)
    
    yield put(cloudDiscoverFailure(err?.response?.data));
  }
}


export function* watchCloudDiscoverSaga() {
  yield takeLatest(cloudDiscoverRequest.type, handleCloudDiscovery);
}


