import API from "../../axios";
import { takeLatest, call, put } from "redux-saga/effects";
import { BASE_WORKLOAD_URL } from "../../../api/ApiPath";
import { endPoints } from "../../../api/EndPoints"
import { AxiosResponse } from "axios";
import { getWorkloadPriceTaggerFailure, getWorkloadPriceTaggerRequest, getWorkloadPriceTaggerSuccess } from "../../slice/workload-slice/getWorkloadPriceTaggerSlice";


function* handleGetWorkloadPriceTagger({ payload }: { type: string; payload: any }) {

    // let url = `${BASE_WORKLOAD_URL}${endPoints.workload.getWorkloadPriceTagger}?resource_group_id=${'64bf9f7d8780909e8ed85388'}&resource_id=${'i-05c18d2f75277707f'}`;     
    let url = `${BASE_WORKLOAD_URL}${endPoints.workload.viewWorkload}/64bfe7edab846864d30a1dc8?pricetagger=true&start_date=2023-07-27&end_date=2023-07-31&project_id=64b4da99dda0e44922f25535`;     
    const authToken = localStorage.getItem("token")?.replace(/"/g, "") || "";

    try {
        const response: AxiosResponse<string> = yield call(API, {
            method: "GET",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response) {
            yield put(getWorkloadPriceTaggerSuccess(response.data));
        }
    } catch (error: any) {
        console.log('Error occurred in GetWorkloadSaga', error?.message);
        yield put(getWorkloadPriceTaggerFailure(error?.message));
    }
}

export function* watchHandleGetWorkloadPriceTagger() {
    yield takeLatest(getWorkloadPriceTaggerRequest.type, handleGetWorkloadPriceTagger);
}
