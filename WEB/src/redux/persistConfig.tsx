import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { combineReducers } from "redux";
import { getProjectSlice } from "./slice/project-slice/GetProjectSlice";
import { AwsPersistData } from "./slice/cloud-slice/awsPersistDataSlice";
import { AzurePersistData } from "./slice/cloud-slice/azurePersistDataSlice";
import { GcpPersistData } from "./slice/cloud-slice/gcpPersistDataSlice";
import { OciPersistData } from "./slice/cloud-slice/ociPersistDataSlice";

/**
 * Encrypt transform configuration for Redux persist - START.
 */
const encryption = encryptTransform({
    secretKey: "9v4Ena8yB#Y9J*qs",
    onError: (error) => console.error(error),
});

/**
 * Encrypt transform configuration for Redux persist - END.
 */

/**
 * Redux persist configuration for RBAC (Role-Based Access Control) reducer - START.
 */

const rbacPersistConfig = {
    key: "root",
    storage,
    transforms: [encryption],
};

const rbacReducer = combineReducers({
    getProject: getProjectSlice.reducer,
});

export const persistedRbacReducer = persistReducer(
    rbacPersistConfig,
    rbacReducer
);

/**
 * Redux persist configuration for RBAC (Role-Based Access Control) reducer - END.
 */

/**
 * Redux persist configuration for Cloud -- awsPersistData -- reducer - START.
 */

const cloudPersistDataPersistConfig = {
    key: "root_1",
    storage,
    transforms: [encryption],
};

const cloudPersistDataReducer = combineReducers({
    awsPersistData: AwsPersistData.reducer,
    azurePersistData: AzurePersistData.reducer,
    gcpPersistData: GcpPersistData.reducer,
    ociPersistData: OciPersistData.reducer,
});

export const persistedCloudPersistData = persistReducer(
    cloudPersistDataPersistConfig,
    cloudPersistDataReducer
);