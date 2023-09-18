import { takeLatest, call, put } from "redux-saga/effects";
import EditProjectSlice, { editProjectRequest } from "../../slice/project-slice/EditProjectSlice";
import { editProjectSuccess,editProjectFailure } from "../../slice/project-slice/EditProjectSlice";
import { BASE_PROJECT_URL ,BASE_URL} from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { ProjectEditResponse } from "../../@types/project-types/EditProjectTypes";
import { getStatusRequest,getStatusFailure,getStatusSuccess } from "../../slice/user-management-slice/GetStatusSlice";
import { getQueryParam } from "../../../helper/SearchParams";
import { UserEditResponse } from "../../@types/user-management-types/UpdateUser";

function* handleUserStatus(action: {
  type: string;
  payload: {username: string; status: string};
}) {
  const{
    payload: {username, status},
  } = action;
  const userId= getQueryParam('id');
        
  

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response:UserEditResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_URL}${endPoints.user.statusupdate}/${userId}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        user_name: action.payload.username,
        status: action.payload.status,
      },
    });
    
    if(response) {

      const {data} = response;
      yield put(getStatusSuccess(data));
    } 
   

  } catch (err:any) {
   
    yield put(getStatusFailure(err));
  }
}


export function* watchGetStatusSaga() {
  yield takeLatest(getStatusRequest.type, handleUserStatus);
}
