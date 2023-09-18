import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../axios";
import { endPoints } from "../../../api/EndPoints";
import { BASE_URL } from "../../../api/ApiPath";
import { TermsSerResponse } from "../../@types/cms-types/TermsTypes";
import {
  PrivacyPolycyRequest,
  PrivacyPolycyRequestFailure,
  PrivacyPolycyRequestSuccess,
} from "../../slice/cms-slice/PrivacySlice";
import { getQueryParam } from "../../../helper/SearchParams";

export function* handlePrivacySaga(payload:any) {
  const token = localStorage.getItem("token");
  const help = getQueryParam('help')
  const authToken = token?.replace(/"/g, "");
  try {
    const url_help = `${BASE_URL}${endPoints.common.help}`
    const response: TermsSerResponse = yield call(API, {
      method: "GET",
      url:payload.payload === 'help' ? url_help: `${BASE_URL}${endPoints.common.privacyPolicy}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response) {
      const { data } = response;

      yield put(PrivacyPolycyRequestSuccess(data));
    }
  } catch (err: any) {
    yield put(PrivacyPolycyRequestFailure(err.response.data));
  }
}

export function* watchprivacyPolicySaga() {
  yield takeLatest(PrivacyPolycyRequest.type, handlePrivacySaga);
}
