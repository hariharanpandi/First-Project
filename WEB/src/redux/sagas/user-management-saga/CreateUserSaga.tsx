import { takeLatest, call, put } from "redux-saga/effects";
import { createUserSuccess,createUserRequest,createUserFailure } from "../../slice/user-management-slice/CreateUserSlice";
import { BASE_PROJECT_URL,BASE_URL  } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { UserCreationResponse } from "../../@types/user-management-types/CreateUser";
import API from "../../axios";

function* handleCreateUser(action: {
  type: string;
  payload: {name: string; email: string};
}) {
  const{
    payload: {name, email},
  } = action;
        
  const userId = localStorage.getItem("userId")?.replace(/"/g,"");

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  
  try {
    const response : UserCreationResponse = yield call(API, {
      method: "POST",
      url: `${BASE_URL }${endPoints.user.create}`,
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        user_name: action.payload.name,
        email: action.payload.email,
      },
    });
    
    if(response) {

      const {data} = response;
      yield put(createUserSuccess(response?.data?.data));
    } 
   

  } catch (err:any) {
   
    yield put(createUserFailure(err?.response?.data));
  }
}


export function* watchCreateUserSaga() {
  yield takeLatest(createUserRequest.type, handleCreateUser);
}
