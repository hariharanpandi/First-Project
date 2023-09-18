import { takeLatest, call, put } from "redux-saga/effects";
import { endPoints } from "../../../api/EndPoints"
import API from "../../axios";
import { UserEditResponse } from "../../@types/user-management-types/UpdateUser";
import { BASE_URL } from "../../../api/ApiPath";
import { updateUserStatusFailure, updateUserStatusRequest, updateUserStatusSuccess } from "../../slice/user-management-slice/UpdateUserStatusSlice";

function* handleupdateUserStatus(action: {
  type: string;
  payload: {
    queryparams: string,
    id: string,
    user_name: string,
    status: string,
  };
}) {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response:UserEditResponse = yield call(API, {
      method: "PUT",
      url: `${BASE_URL}${endPoints.user.statusupdate}/${action.payload.id}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        user_name: action.payload.user_name,
        status: action.payload.status,
      },
    });
    
    if(response) {

      const {data} = response;
      yield put(updateUserStatusSuccess(data));
    } 
   

  } catch (err:any) {
 
    yield put(updateUserStatusFailure(err));
  }
}


export function* watchupdateUserStatusSaga() {
  yield takeLatest(updateUserStatusRequest.type, handleupdateUserStatus);
}
