import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { loginSlice } from "./slice/auth-slice/AuthSlice";
import { watchLoginSaga } from "./sagas/auth-saga/AuthSaga";
import { watchForgotPasswordSaga } from "./sagas/auth-saga/ForgotPwdSaga";
import { watchChangePwdSaga } from "./sagas/auth-saga/ChangePwdSaga";
import { forgotPwdSlice } from "./slice/auth-slice/ForgotPasswordSlice";
import { changePwdSlice } from "./slice/auth-slice/ChangePwdSlice";
import SsoSlice, { SSOSlice } from "./slice/auth-slice/SsoSlice";
import { watchSSOSaga } from "./sagas/auth-saga/SsoSaga";
import { profileInfoSlice } from "./slice/setting-slice/profile-setting/ProfileSettingSlice";
import { watchProfileInfoSaga } from "./sagas/auth-saga/setting-saga/profile-setting/ProfileSettingSaga";
import EditProfileslice, { profileEditSlice } from "./slice/setting-slice/profile-setting/EditProfileslice";
import { watchProfileEditSaga } from "./sagas/auth-saga/setting-saga/profile-setting/EditProfileSaga";
import { passwordUpdateSlice } from "./slice/setting-slice/profile-setting/UpdataPasswordSlice";
import { watchPasswordUpdateSaga } from "./sagas/auth-saga/setting-saga/profile-setting/UpdatePasswordSaga";
import { deleteAccountSlice } from "./slice/setting-slice/profile-setting/DeleteAccountslice";
import { watchDeleteAccountSaga } from "./sagas/auth-saga/setting-saga/profile-setting/DeleteAccount";
import { watchTermsAndConditionsSaga } from "./sagas/cms-sagas/TermsSaga";
import { watchprivacyPolicySaga } from "./sagas/cms-sagas/PrivacySaga";
import { profileImageSlice } from "./slice/setting-slice/profile-setting/ChangeProfileSlice";
import { watchProfileImageSaga } from "./sagas/auth-saga/setting-saga/profile-setting/ChangeProfileSaga";
import { profileEditWithoutSlice } from "./slice/setting-slice/profile-setting/EditWithoutProfileSlice";
import { watchProfileWithoutEditSaga } from "./sagas/auth-saga/setting-saga/profile-setting/EditWithoutProfileSaga";
import {watchGetProjectSaga} from "./sagas/project-saga/GetProjectSaga"
import { getProjectSlice } from "./slice/project-slice/GetProjectSlice";
import { createProjectSlice } from "./slice/project-slice/CreateProjectSlice";
import { watchCreateProjectSaga } from "./sagas/project-saga/CreateProjectSaga";
import EditProjectSlice, { editProjectSlice } from "./slice/project-slice/EditProjectSlice";
import { watchEditProjectSaga } from "./sagas/project-saga/EditProjectSaga";
import { deleteProjectSlice } from "./slice/project-slice/DeleteProjectSlice";
import { watchDeleteProjectSaga } from "./sagas/project-saga/DeleteProjectSaga";
import { getProjectInfoSlice } from "./slice/project-slice/GetProjectInfoslice";
import { watchGetProjectInfoSaga } from "./sagas/project-saga/GetProjectInfoSaga";
import { getProjectInfoInitSlice } from "./slice/project-slice/GetProjectInfoInitSlice";
import { watchGetProjectInfoInitSaga } from "./sagas/project-saga/GetProjectInfoInitSaga";
import { createUserSlice } from "./slice/user-management-slice/CreateUserSlice";
import { watchCreateUserSaga } from "./sagas/user-management-saga/CreateUserSaga";
import {getUserSlice} from "./slice/user-management-slice/GetUserSlice";
import { watchGetUserSaga } from "./sagas/user-management-saga/GetUserSaga";
import { watchEditUserSaga } from "./sagas/user-management-saga/UpdateUserSaga";
import { editUserSlice } from "./slice/user-management-slice/UpdateUserSlice";
import { watchGetManageUserSaga } from "./sagas/user-management-saga/GetManageUserSaga";
import { getManageUserSlice } from "./slice/user-management-slice/GetManageUserSlice";
import GetRoleProjectSlice, { getRoleProjectSlice } from "./slice/user-management-slice/GetRoleProjectSlice";
import { watchGetRoleProjectSaga } from "./sagas/user-management-saga/GetRoleProjectSaga";
import { getRoleAppSlice } from "./slice/user-management-slice/GetRoleAppSlice";
import { watchGetRoleAppSaga } from "./sagas/user-management-saga/GetRoleAppSaga";
import { getRoleWorkloadSlice } from "./slice/user-management-slice/GetRoleWorkloadSlice";
import { watchGetRoleWorkloadSaga } from "./sagas/user-management-saga/GetRoleWorkloadSaga";
import { getRoleAccessSlice } from "./slice/user-management-slice/GetRoleAccessSlice";
import { watchGetRoleAccessSaga } from "./sagas/user-management-saga/GetRoleAccessSaga";
import { getRoleSlice } from "./slice/user-management-slice/GetRoleSlice";
import { watchGetRoleSaga } from "./sagas/user-management-saga/GetRoleSaga";
import { deleteUserSlice } from "./slice/user-management-slice/DeleteUserSlice";
import { watchDeleteUserSaga } from "./sagas/user-management-saga/DeleteUserSaga";
import { getStatusSlice } from "./slice/user-management-slice/GetStatusSlice";
import { watchGetStatusSaga } from "./sagas/user-management-saga/GetStatusSaga";
import { updateUserStatusSlice } from "./slice/user-management-slice/UpdateUserStatusSlice";
import { watchupdateUserStatusSaga } from "./sagas/user-management-saga/UpdateUserStatusSaga";
import { pwdExpirySlice } from "./slice/auth-slice/PwdExpirySlice";
import { watchPwdExpiry } from "./sagas/auth-saga/PwdExpirySaga";
import { watchCreateAppSaga } from "./sagas/app-saga/CreateAppSaga";
import { createAppSlice } from "./slice/app-slice/CreateProjectSlice";
import { appListSlice } from "./slice/app-slice/AppListSlice";
import { watchAppListSaga } from "./sagas/app-saga/AppListSaga";
import { GetAppSlice } from "./slice/app-slice/GetAppInfoSlice";
import { watchGetAppSaga } from "./sagas/app-saga/GetAppInfoSaga";
import { updateAppSlice } from "./slice/app-slice/UpdateAppSlice";
import { watchUpdateAppSaga } from "./sagas/app-saga/UpdateAppSaga";
import { watchDeleteAppSaga } from "./sagas/app-saga/DeleteAppSaga";
import { cloudCountSlice } from "./slice/discovery-slice/CloudCountSlice";
import { watchCloudCountsSaga } from "./sagas/discovery-saga/CloudCoundSaga";
import CloudUserSlice from "./slice/discovery-slice/CloudUserSlice";
import { watchCloudUserSaga } from "./sagas/discovery-saga/CloudUserSaga";
import { getCloudUserSlice } from "./slice/discovery-slice/CloudUserSlice";
import { watchDiscoverySaga } from "./sagas/discovery-saga/DiscoverySaga";
import { discoverySlice } from "./slice/discovery-slice/DiscoverySlice";
import { cloudDiscoverSlice } from "./slice/discovery-slice/CloudDiscoverSlice";
import { watchCloudDiscoverSaga } from "./sagas/discovery-saga/CloudDiscoverSaga";
import { postVerifyConnection } from "./slice/cloud-slice/PostVerifyConnectionSlice";
import { watchHandleVerifyConnection } from "./sagas/cloud-saga/PostVerifyConnectionSaga";
import { postCloudRegion } from "./slice/cloud-slice/PostCloudRegionSlice";
import { watchHandleCloudRegion } from "./sagas/cloud-saga/PostCloudRegionSaga";
import { watchHandleSubscriptions } from "./sagas/cloud-saga/PostSubscriptionsSaga";
import { postSubscriptions } from "./slice/cloud-slice/PostSubscriptionsSlice";
import { postCloudAccountCreate } from "./slice/cloud-slice/PostCloudAccountCreateSlice";
import { watchHandleCloudAccountCreate } from "./sagas/cloud-saga/PostCloudAccountCreateSaga";
import { watchHandlePutCloudAccountEdit } from "./sagas/cloud-saga/PutCloudAccountEditSaga";
import { watchHandleGetCloudAccount } from "./sagas/cloud-saga/GetCloudAccountSaga";
import { putCloudAccountEdit } from "./slice/cloud-slice/PutCloudAccountEditSlice";
import { getCloudAccount } from "./slice/cloud-slice/GetCloudAccountSlice";
import { getWorkloadSlice } from "./slice/workload-slice/GetWorkloadSlice";
import { watchHandleGetWorkload } from "./sagas/workload-saga/GetWorkloadSaga";
import { watchHandleGetManageUser } from "./sagas/user-management-saga/manageUserSaga";
import { manageUser } from "./slice/user-management-slice/manageUserSlice";
import { watchHandleCloudPlatform } from "./sagas/workload-saga/getCloudPlatformSaga";
import { getCloudPlatform } from "./slice/workload-slice/getCloudPlatformSlice";
import { watchHandleCloudCategory } from "./sagas/workload-saga/getCloudCategorySaga";
import { getCloudCategory } from "./slice/workload-slice/getCloudCategorySlice";
import { getCloudResourceGroup } from "./slice/workload-slice/getCloudResourceGroupSlice";
import { watchHandleCloudResourceGroup } from "./sagas/workload-saga/getCloudResourceGroupSaga";
import { watchCreateMapSaga } from "./sagas/workload-saga/createMapSaga";
import { createMapSlice } from "./slice/workload-slice/createMapSaga";
import { watchHandleCloudResource } from "./sagas/workload-saga/getCloudResourceSaga";
import { getCloudResource } from "./slice/workload-slice/getCloudResourceSlice";
import {getWorkloadInfoSlice} from "./slice/workload-slice/getWorkloadInfoSlice";
import { watchHandleGetWorkloadInfo } from "./sagas/workload-saga/getWorkloadInfoSaga";
import { editMapSlice } from "./slice/workload-slice/editMapSlice";

import {viewWorkloadSlice} from "./slice/workload-slice/viewWorkloadSlice";
import { watchHandleViewWorkload } from "./sagas/workload-saga/viewWorkloadSaga";
import { watchEditMapSaga } from "./sagas/workload-saga/editMapSaga";
import { watchRenameSaga } from "./sagas/workload-saga/renameWorkloadSaga";
import { renameSlice } from "./slice/workload-slice/renameWorkloadSlice";
import { deleteWorkloadSlice } from "./slice/workload-slice/DeleteWorkloadSlice";
import { watchDeleteWorkloadSaga } from "./sagas/workload-saga/DeleteWorkloadSaga";
import {getWorkloadPriceTaggerSlice} from "./slice/workload-slice/getWorkloadPriceTaggerSlice";
import { watchHandleGetWorkloadPriceTagger } from "./sagas/workload-saga/getWorkloadPriceTaggerSaga";
import { getCloudAccountNameSlice } from "./slice/workload-slice/getCloudAccountNameSlice";
import { watchHandleGetCloudAccountName } from "./sagas/workload-saga/getCloudAccountNameSaga";
import {newWorkloadSlice} from "./slice/workload-slice/newWorkloadSlice";
import { watchNewWorkloadSaga } from "./sagas/workload-saga/newWorkloadSaga";



export const rootReducer = combineReducers({
  login: loginSlice.reducer,
  forgotPassword: forgotPwdSlice.reducer,
  sso: SSOSlice.reducer,
  changePwd: changePwdSlice.reducer,
  profileInfo: profileInfoSlice.reducer,
  profileEdit: profileEditSlice.reducer,
  passwordUpdate: passwordUpdateSlice.reducer,
  deleteAccount: deleteAccountSlice.reducer,
  profileImage: profileImageSlice.reducer,
  profileEditWithout:profileEditWithoutSlice.reducer,
  getProject:getProjectSlice.reducer,
  createProject: createProjectSlice.reducer,
  editProject:editProjectSlice.reducer,
  deleteProject:deleteProjectSlice.reducer,
  getProjectInfo: getProjectInfoSlice.reducer,
  getProjectInfoInit: getProjectInfoInitSlice.reducer,
  createUser:createUserSlice.reducer,
  getUser:getUserSlice.reducer,
  editUser:editUserSlice.reducer,
  getManageUser:getManageUserSlice.reducer,
  getRoleProject:getRoleProjectSlice.reducer,
  getRoleApp:getRoleAppSlice.reducer,
  getRoleWorkload:getRoleWorkloadSlice.reducer,
  getRoleAccess :getRoleAccessSlice.reducer,
  getRole:getRoleSlice.reducer,
  deleteUser:deleteUserSlice.reducer,
  getStatus:getStatusSlice.reducer,
  updateUserStatus: updateUserStatusSlice.reducer,
  pwdExpiry:pwdExpirySlice.reducer,
  createApp:createAppSlice.reducer,
  appList:appListSlice.reducer,
  GetApp:GetAppSlice.reducer,
  updateApp:updateAppSlice.reducer,
  
  cloudcounts:cloudCountSlice.reducer,
  getCloudUser:getCloudUserSlice.reducer,
  discovery:discoverySlice.reducer,
  cloudDiscover:cloudDiscoverSlice.reducer,
  
  postVerifyConnection: postVerifyConnection.reducer,
  postCloudRegion: postCloudRegion.reducer,
  postSubscriptions: postSubscriptions.reducer,
  postCloudAccountCreate: postCloudAccountCreate.reducer,
  putCloudAccountEdit: putCloudAccountEdit.reducer,
  getCloudAccount: getCloudAccount.reducer,
  getWorkload: getWorkloadSlice.reducer,
  getWorkloadInfo: getWorkloadInfoSlice.reducer,
  viewWorkload: viewWorkloadSlice.reducer,
  getWorkloadPriceTagger: getWorkloadPriceTaggerSlice.reducer,
  manageUser: manageUser.reducer,
  getCloudPlatform: getCloudPlatform.reducer,
  getCloudCategory: getCloudCategory.reducer,
  getCloudResourceGroup: getCloudResourceGroup.reducer,
  createMap:createMapSlice.reducer,
  getCloudResource: getCloudResource.reducer,
  editMap:editMapSlice.reducer,
  rename:renameSlice.reducer,
  deleteWorkload: deleteWorkloadSlice.reducer,
  getCloudAccountName: getCloudAccountNameSlice.reducer,
  newWorkload:newWorkloadSlice.reducer
});

export function* rootSaga() {
  yield all([
    watchLoginSaga(),
    watchForgotPasswordSaga(),
    watchSSOSaga(),
    watchChangePwdSaga(),
    watchProfileInfoSaga(),
    watchProfileEditSaga(),
    watchPasswordUpdateSaga(),
    watchDeleteAccountSaga(),
    watchTermsAndConditionsSaga(),
    watchprivacyPolicySaga(),
    watchProfileImageSaga(),
    watchProfileWithoutEditSaga(),
    watchGetProjectSaga(),
    watchCreateProjectSaga(),
    watchEditProjectSaga(),
    watchDeleteProjectSaga(),
    watchGetProjectInfoSaga(),
    watchGetProjectInfoInitSaga(),
    watchCreateProjectSaga(),
    watchCreateUserSaga(),
    watchGetUserSaga(),
    watchEditUserSaga(),
    watchGetManageUserSaga(),
    watchGetRoleProjectSaga(),
    watchGetRoleAppSaga(),
    watchGetRoleWorkloadSaga(),
    watchGetRoleAccessSaga(),
    watchGetRoleSaga(),
    watchDeleteUserSaga(),
    watchGetStatusSaga(),
    watchupdateUserStatusSaga(),
    watchPwdExpiry(),
    watchCreateAppSaga(),
    watchAppListSaga(),
    watchGetAppSaga(),
    watchUpdateAppSaga(),
    watchDeleteAppSaga(),
    watchCloudCountsSaga(),
    watchCloudUserSaga(),
    watchDiscoverySaga(),
    watchCloudDiscoverSaga(),
    watchHandleVerifyConnection(),
    watchHandleCloudRegion(),
    watchHandleSubscriptions(),
    watchHandleCloudAccountCreate(),
    watchHandlePutCloudAccountEdit(),
    watchHandleGetCloudAccount(),
    watchHandleGetWorkload(),
    watchHandleGetManageUser(),
    watchHandleCloudPlatform(),
    watchHandleCloudCategory(),
    watchHandleCloudResourceGroup(),
    watchCreateMapSaga(),
    watchHandleCloudResource(),
    watchHandleGetWorkloadInfo(),
    watchHandleViewWorkload(),
    watchEditMapSaga(),
    watchRenameSaga(),
    watchDeleteWorkloadSaga(),
    watchHandleGetWorkloadPriceTagger(),
    watchHandleGetCloudAccountName(),
    watchNewWorkloadSaga()

  ]);
}
