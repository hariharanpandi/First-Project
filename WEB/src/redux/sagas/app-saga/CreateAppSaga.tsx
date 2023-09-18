import { takeLatest, call, put } from "redux-saga/effects";
import { createAppRequest,createAppFailure,createAppSuccess } from "../../slice/app-slice/CreateProjectSlice";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";
import { AppCreationResponse } from "../../@types/app-types/CreateAppTypes";

// Define a variable to keep track of whether the API call is in progress
let isCreatingProject = false;

function* handleCreateApp(action:any) {
  // Check if another API call is already in progress
  if (isCreatingProject) {
    return; // Exit the function to prevent multiple calls
  }

  const {
    payload: { name, description },
  } = action;

  const userId = localStorage.getItem("userId")?.replace(/"/g, "");

  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");

  try {
    // Set the isCreatingProject flag to true to indicate that an API call is in progress
    isCreatingProject = true;

    const response: AppCreationResponse = yield call(API, {
      method: "POST",
      url: `${BASE_PROJECT_URL}${endPoints.application.create}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      data:action.payload
    });

    if (response) {
      const { data } = response;
      yield put(createAppSuccess(data));
    }
  } catch (err: any) {
   
    yield put(createAppFailure(err?.response?.data));
  } finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isCreatingProject = false;
  }
}

export function* watchCreateAppSaga() {
  yield takeLatest(createAppRequest.type, handleCreateApp);
}