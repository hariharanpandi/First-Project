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

function* handleEditUser(action: {
  type: string;
  payload: Record<string, any>;
}) {

  const userId= getQueryParam('id');
        
  

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response:UserEditResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_URL}${endPoints.user.manageUpdate}/${userId}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: action.payload,
    });
    
    if(response) {

      const {data} = response;
      yield put(editUserSuccess(data));
    } 
   

  } catch (err:any) {
    
    yield put(editUserFailure(err.message));
  }
}


export function* watchEditUserSaga() {
  yield takeLatest(editUserRequest.type, handleEditUser);
}
