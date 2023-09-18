import { combineReducers } from "@reduxjs/toolkit";
import  { loginSlice } from "./slice/auth-slice/AuthSlice";
import { forgotPwdSlice } from "./slice/auth-slice/ForgotPasswordSlice";
import { SSOSlice } from "./slice/auth-slice/SsoSlice";
import {changePwdSlice} from "./slice/auth-slice/ChangePwdSlice"
import { profileInfoSlice } from "./slice/setting-slice/profile-setting/ProfileSettingSlice";
import { profileEditSlice } from "./slice/setting-slice/profile-setting/EditProfileslice";
import { passwordUpdateSlice } from "./slice/setting-slice/profile-setting/UpdataPasswordSlice";
import { deleteAccountSlice } from "./slice/setting-slice/profile-setting/DeleteAccountslice";
import { termsAndConditionsSlice } from "./slice/cms-slice/TermsSlice";
import { profileImageSlice } from "./slice/setting-slice/profile-setting/ChangeProfileSlice";
import { profileEditWithoutSlice } from "./slice/setting-slice/profile-setting/EditWithoutProfileSlice";
import { getProjectSlice } from "./slice/project-slice/GetProjectSlice";
import { createProjectSlice } from "./slice/project-slice/CreateProjectSlice";
import { editProjectSlice } from "./slice/project-slice/EditProjectSlice";
import { deleteProjectSlice } from "./slice/project-slice/DeleteProjectSlice";
import { getProjectInfoSlice } from "./slice/project-slice/GetProjectInfoslice";
import { getProjectInfoInitSlice } from "./slice/project-slice/GetProjectInfoInitSlice";
import { createUserSlice } from "./slice/user-management-slice/CreateUserSlice";
import { getUserSlice } from "./slice/user-management-slice/GetUserSlice";
import { editUserSlice } from "./slice/user-management-slice/UpdateUserSlice";
import  { getManageUserSlice } from "./slice/user-management-slice/GetManageUserSlice";
import { getRoleProjectSlice } from "./slice/user-management-slice/GetRoleProjectSlice";
import { getRoleAppSlice } from "./slice/user-management-slice/GetRoleAppSlice";
import { getRoleWorkloadSlice } from "./slice/user-management-slice/GetRoleWorkloadSlice";
import { getRoleAccessSlice } from "./slice/user-management-slice/GetRoleAccessSlice";
import { getRoleSlice } from "./slice/user-management-slice/GetRoleSlice";
import { deleteUserSlice } from "./slice/user-management-slice/DeleteUserSlice";
import { updateUserStatusSlice } from "./slice/user-management-slice/UpdateUserStatusSlice";
import PwdExpirySlice, { pwdExpirySlice } from "./slice/auth-slice/PwdExpirySlice";
import { createAppSlice } from "./slice/app-slice/CreateProjectSlice";
import { appListSlice } from "./slice/app-slice/AppListSlice";
import { GetAppSlice } from "./slice/app-slice/GetAppInfoSlice";
import { updateAppSlice } from "./slice/app-slice/UpdateAppSlice";
import { deleteAppSlice } from "./slice/app-slice/DeleteAppSlice";
import { cloudCountSlice } from "./slice/discovery-slice/CloudCountSlice";
import { getCloudUserSlice } from "./slice/discovery-slice/CloudUserSlice";
import { discoverySlice } from "./slice/discovery-slice/DiscoverySlice";
import { cloudDiscoverSlice } from "./slice/discovery-slice/CloudDiscoverSlice";
import { postVerifyConnection } from "./slice/cloud-slice/PostVerifyConnectionSlice";
import { postCloudRegion } from "./slice/cloud-slice/PostCloudRegionSlice";
import { postSubscriptions } from "./slice/cloud-slice/PostSubscriptionsSlice";
import { postCloudAccountCreate } from "./slice/cloud-slice/PostCloudAccountCreateSlice";
import { putCloudAccountEdit } from "./slice/cloud-slice/PutCloudAccountEditSlice";
import { getCloudAccount } from "./slice/cloud-slice/GetCloudAccountSlice";
import { getWorkloadSlice } from "./slice/workload-slice/GetWorkloadSlice";
import { manageUser } from "./slice/user-management-slice/manageUserSlice";
import { getCloudPlatform } from "./slice/workload-slice/getCloudPlatformSlice";
import { getCloudCategory } from "./slice/workload-slice/getCloudCategorySlice";
import { getCloudResourceGroup } from "./slice/workload-slice/getCloudResourceGroupSlice";
import { createMapSlice } from "./slice/workload-slice/createMapSaga";
import { getCloudResource } from "./slice/workload-slice/getCloudResourceSlice";
import {getWorkloadInfoSlice} from "./slice/workload-slice/getWorkloadInfoSlice";
import { editMapSlice } from "./slice/workload-slice/editMapSlice";
import {viewWorkloadSlice} from "./slice/workload-slice/viewWorkloadSlice";
import { renameSlice } from "./slice/workload-slice/renameWorkloadSlice";
import { deleteWorkloadSlice } from "./slice/workload-slice/DeleteWorkloadSlice";

import {getWorkloadPriceTaggerSlice} from "./slice/workload-slice/getWorkloadPriceTaggerSlice";
import { getCloudAccountNameSlice } from "./slice/workload-slice/getCloudAccountNameSlice";
import {newWorkloadSlice} from "./slice/workload-slice/newWorkloadSlice";


export const rootReducer = combineReducers({
  auth: loginSlice.reducer,
  forgotPwd:forgotPwdSlice.reducer,
  sso:SSOSlice.reducer,
  changePwd:changePwdSlice.reducer,
  profileInfo:profileInfoSlice.reducer,
  profileEdit:profileEditSlice.reducer,
  passwordUpdate:passwordUpdateSlice.reducer,
  deleteAccount:deleteAccountSlice.reducer,
  termsAndConditions: termsAndConditionsSlice.reducer,
  privacyPolicy: loginSlice.reducer,
  profileImage: profileImageSlice.reducer,
  createProject: createProjectSlice.reducer,
  profileEditWithout:profileEditWithoutSlice.reducer,
  getProject:getProjectSlice.reducer,
  editProject:editProjectSlice.reducer,
  deleteProject:deleteProjectSlice.reducer,
  getProjectInfo:getProjectInfoSlice.reducer,
  getProjectInfoInit:getProjectInfoInitSlice.reducer,
  createUser:createUserSlice.reducer,
  getUser:getUserSlice.reducer,
  editUser:editUserSlice.reducer,
  getManageUser:getManageUserSlice.reducer,
  getRoleProject:getRoleProjectSlice.reducer,
  getRoleApp:getRoleAppSlice.reducer,
  getRoleWorkload:getRoleWorkloadSlice.reducer,
  getRoleAccessSlice:getRoleAccessSlice.reducer,
  getRole:getRoleSlice.reducer,
  deleteUser:deleteUserSlice.reducer,
  updateUserStatus: updateUserStatusSlice.reducer,
  pwdExpiry:pwdExpirySlice.reducer,
  createApp:createAppSlice.reducer,
  appList:appListSlice.reducer,
  GetApp:GetAppSlice.reducer,
  updateApp:updateAppSlice.reducer,
  deleteApp:deleteAppSlice.reducer,
  cloudcounts:cloudCountSlice.reducer,
  getCloudUser:getCloudUserSlice.reducer,
  discovery:discoverySlice.reducer,
  cloudDiscover:cloudDiscoverSlice.reducer,
  getWorkload: getWorkloadSlice.reducer,
  getWorkloadInfo: getWorkloadInfoSlice.reducer,
  viewWorkload: viewWorkloadSlice.reducer,
  deleteWorkload: deleteWorkloadSlice.reducer,
  getWorkloadPriceTagger: getWorkloadPriceTaggerSlice.reducer,
 
  postVerifyConnection: postVerifyConnection.reducer,
  postCloudRegion: postCloudRegion.reducer,
  postSubscriptions: postSubscriptions.reducer,
  postCloudAccountCreate: postCloudAccountCreate.reducer,
  putCloudAccountEdit: putCloudAccountEdit.reducer,
  getCloudAccount: getCloudAccount.reducer,
  manageUser: manageUser.reducer,
  getCloudPlatform: getCloudPlatform.reducer,
  getCloudCategory: getCloudCategory.reducer,
  getCloudResourceGroup: getCloudResourceGroup.reducer,
  createMap:createMapSlice.reducer,
  getCloudResource: getCloudResource.reducer,
  editMap:editMapSlice.reducer,
  rename:renameSlice.reducer,
  getCloudAccountName: getCloudAccountNameSlice.reducer,
  newWorkload:newWorkloadSlice.reducer

  // add more reducers here
});
