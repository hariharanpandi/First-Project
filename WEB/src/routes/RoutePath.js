export const LOGIN = "/";
export const FORGOT_PASSWORD = "/forgot-password";
export const LOGIN_SSO = "/login-sso";
export const CHANGE_PASSWORD = "/api/resetpassword"
export const SETTINGS = "/settings"
export const SETTINGS_PROFILE = "/settings/account";
export const TEMPLATE = "/overview"
export const SETTINGS_OVERVIEW = "/overview/settings"
export const PROJECT_LANDING = "/project-landing";

export const USER_MANAGEMENT="overview/user-management";
export const MANAGE_USER = "/overview/manage-user";
export const PASSWORD_EXPIRY = "/reset-link-expired";
export const APPLICATION_LANDING="/overview/application-landing"

// ** Cloud paths start */

const cloudInitialPath = '/overview/discovery';

export const CLOUD = {
  PLATFORM: `${cloudInitialPath}/:project_id/cloud-platform/:select_cloud_platform`,
  ONBOARDING: `${cloudInitialPath}/cloud-platform/:select_cloud_platform/onboarding`,
  AUTHENTICATION_DETAILS: `${cloudInitialPath}/cloud-platform/:select_cloud_platform/onboarding/authentication-details`,
  ACCOUNT: `${cloudInitialPath}/cloud-platform/:select_cloud_platform/onboarding/authentication-details/cloud-account`,
  EDIT_CLOUD: `${cloudInitialPath}/:project_id/cloud-platform/:select_cloud_platform/:select_cloud_platform_id`,
};

// ** Cloud paths end */


// FORGOT_PASSWORD="/auth/forgot-password"
