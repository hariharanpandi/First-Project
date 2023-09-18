import { takeLatest, call, put } from "redux-saga/effects";
import {
  fetchTermsAndConditionsFailure,
  fetchTermsAndConditionsRequest,
  fetchTermsAndConditionsSuccess,
} from "../../slice/cms-slice/TermsSlice";

import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";
import { TermsSerResponse } from "../../@types/cms-types/TermsTypes";

export function* handleTermsAndConditions() {
  const token = localStorage.getItem("token");
  const authToken = token?.replace(/"/g, "");
  try {
    const response: TermsSerResponse = yield call(API, {
      method: "GET",
      url: `${BASE_URL}${endPoints.common.termsAndConditions}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response) {
      const { data } = response;

      yield put(fetchTermsAndConditionsSuccess(data));
    }

  } catch (err: any) {
    yield put(fetchTermsAndConditionsFailure(err.response.data));
  }
}

export function* watchTermsAndConditionsSaga() {
  yield takeLatest(
    fetchTermsAndConditionsRequest.type,
    handleTermsAndConditions
  );
}
