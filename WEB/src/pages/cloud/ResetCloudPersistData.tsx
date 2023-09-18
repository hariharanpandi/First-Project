
import { Dispatch } from "redux";
import { resetAwsPersistData } from "../../redux/slice/cloud-slice/awsPersistDataSlice";
import { resetAzurePersistData } from "../../redux/slice/cloud-slice/azurePersistDataSlice";
import { resetGcpPersistData } from "../../redux/slice/cloud-slice/gcpPersistDataSlice";
import { resetOciPersistData } from "../../redux/slice/cloud-slice/ociPersistDataSlice";

export const resetCloudPersistData = (dispatch: Dispatch) => {
    dispatch(resetAwsPersistData());
    dispatch(resetAzurePersistData());
    dispatch(resetGcpPersistData());
    dispatch(resetOciPersistData());   
};
  