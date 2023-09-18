import { takeLatest, call, put } from "redux-saga/effects";
import EditProjectSlice, { editProjectRequest } from "../../slice/project-slice/EditProjectSlice";
import { editProjectSuccess,editProjectFailure } from "../../slice/project-slice/EditProjectSlice";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { ProjectEditResponse } from "../../@types/project-types/EditProjectTypes";
import { getQueryParam } from "../../../helper/SearchParams";
import { getProjectInfoRequest } from "../../action/project-action/GetProjectInfoAction";
import _ from "lodash";

function* handleEditProject(action: {
  type: string;
  payload: {name: string; description: string,project_id:string};
}) {
  const{
    payload: {name, description},
  } = action;
  const projectId = getQueryParam('projectId');
        
  const userId = localStorage.getItem("userId")?.replace(/"/g,"")

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    if ((!_.isNil(projectId) || !_.isNil(action?.payload?.project_id)) && !_.isNil(action?.payload?.name)) {
    const response:ProjectEditResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_PROJECT_URL}${endPoints.account.project.update}/${!_.isNil(projectId) ? projectId : action?.payload?.project_id}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        project_name: action.payload.name,
        description: action.payload.description,
      },
    });
    
    if(response) {

      const {data} = response;
      yield put(editProjectSuccess(data));
      yield put(getProjectInfoRequest(projectId!))
    } 
  } else {
    yield put(editProjectFailure(''));
  }
   

  } catch (err:any) {
  
    yield put(editProjectFailure(err));
  }
}


export function* watchEditProjectSaga() {
  yield takeLatest(editProjectRequest.type, handleEditProject);
}
