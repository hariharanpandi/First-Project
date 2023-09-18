import { takeLatest, call, put } from "redux-saga/effects";
import {
  createProjectFailure,
  createProjectRequest,
  createProjectSuccess,
} from "../../slice/project-slice/CreateProjectSlice";
import { BASE_PROJECT_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints";
import { ProjectCreationResponse } from "../../@types/project-types/CreateProjectTypes";
import API from "../../axios";

// Define a variable to keep track of whether the API call is in progress
let isCreatingProject = false;

function* handleCreateProject(action: {
  type: string;
  payload: { name: string; description: string };
}) {
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

    const response: ProjectCreationResponse = yield call(API, {
      method: "POST",
      url: `${BASE_PROJECT_URL}${endPoints.account.project.create}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        project_name: action.payload.name,
        description: action.payload.description,
      },
    });

    if (response) {
      const { data } = response;
      yield put(createProjectSuccess(data));
    }
  } catch (err: any) {

    yield put(createProjectFailure(err?.response?.data));
  } finally {
    // Set the isCreatingProject flag to false to indicate that the API call has completed
    isCreatingProject = false;
  }
}

export function* watchCreateProjectSaga() {
  yield takeLatest(createProjectRequest.type, handleCreateProject);
}