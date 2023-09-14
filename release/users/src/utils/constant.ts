export default class AppConstants {
  URL = {
    BASE_URL: "/projectx",
  };

  TOKEN = {
    PERFIX_TOKEN: "Bearer",
  };

  USER_LOGIN_TYPE = ['Basic', 'Sso']

  EMAIL_LINK_VALIDATE = "Link has been expired. Please generate a new link"
  EMAIL_SUBJECT = "Password Reset"

  USER_STATUS = {
    STATUS_CONFIRMED: 'confirmed',
    STATUS_PENDING: 'pending',
    STATUS_DELETED: 'deleted'
  }

  ORDER_BY = {
    ASCENDING: "asc",
    DESCENDING: "desc"
  }

  SCHEMA = {
    _CLS_USER: 'Owner.User',
    STATUS_ACTIVE: "Active",
    STATUS_INACTIVE: "Inactive",
    STATUS_DELETED: "Deleted",
    USERS_COLLECTION_NAME: "users",
    OWNER_COLLECTION: "owner",
    ADMIN_USER: "A",
    NORMAL_USER: "N",
    SUPER_ADMIN: "S",
    LOGIN_CMS_COLLECTION: "login_cms",
    TENANT_COLLECTION_NAME: "tenant",
    TENANT_GROUP_COLLECTION: "tenant_group",
    AUTH_TOKEN: "auth_token",
    TOKEN_EXPIRE_TIME: "20m",
    ISACTIVE: "Y",
    ISINACTIVE: "N",
    BASIC_USER: "Basic",
    SSO_USER: "Sso",
    ISTRUE: true,
    ISFALSE: false,
    ROLE_COLLECTION: "role",
    EIGHT_HRS_IN_SEC: "28800"
  };

  MESSAGES = {
    EMPTY_TOKEN:
      "Authentication token is missing. Please provide a valid token.",
    UNAUTHORIZED_USER:
      "Access denied. You are not authorized to perform this action.",
    INVALID_TOKEN:
      "Invalid token. Please provide a valid authentication token.",
    PORT_LISTEN: "Server is now running on port ",
    DELETE_USER: "User has been successfully deleted.",
    TENANT_DELETED: "Tenant has been successfully deleted.",
    EMPTY_SPACE: " ",
    PASSWORD: "Password",
    GET_TENANT: "Tenant data found and retrieved successfully.",
    IMAGE_UPLOAD: "Image Upload Failed",
    TENANT_CREATED: "Tenant created successfully",
    USER_INFO: "User Info Found",
    USER_CREATE: "User has been successfully created.",
    USER_UPDATE: "User has been successfully updated.",
    LOGOUT: "Successfully logged out.",
    PWD_NOT_EXPIRED: "Password generation link is not expired",
    PWD_EXPIRED: "Password generation link is expired",
    OLD_PWD_UPDATE: "Password is the same as the old one",
    NEW_PWD_UPDATE: "Password is different, updating it...",
    SUCCESS: "Success",
    FAILED: "Failed"
  };

  ROLE_TYPE = {
    PR_ADMIN: "Project_Admin",
    INFRA_ADMIN: "Infra_Admin",
    VIEW_ONLY: "View_Only"
  }

  PASSWORD = {
    LINK_GENERATED: "Password link Generated",
    UPDATED_PASSWORD: "Password has been updated",
    BASIC_USER: 'Set password',
    SSO_USER: "You're Invited!",
    SSO_TEMPLATE: "ssousercreateTemplate.html",
    BASIC_TEMPLATE: "userpasswordsettemplate.html"
  }

  DBCONNECTION = {
    SUCCESSFUL: "Connected to MongoDB",
    UNSUCCESSFUL: "MongoDB connection error",
    ERROR: "MongoDB connection error",
    RECONNECTED: "Reconnected to MongoDB",
    DISCONNECTED: "MongoDB disconnected. Reconnecting...",
  };

  ERROR_MESSAGES = {
    INVALID_EMAIL_OR_PASSWORD:
      "Invalid email or password. Please check your credentials and try again.",
    EXISTING_USER:
      "This user is already registered. Please choose a different email or sign in.",
    EXISTING_TENANT:
      "This tenant is already registered. Please enter a different name or update the existing tenant.",
      EXISTING_DOMAIN:
      "This tenant domain is already registered. Please enter a different domain.",
    MANDATORY_FIELD_MISSING: "Please fill out all required fields to proceed.",
    DUPLICATE: "Duplicate records found. Please ensure uniqueness of the data.",
    USER_INACTIVE:
      "This user account has expired. Please contact support for further assistance.",
    USER_DELETED:
      "User account has been deleted. Please contact support for assistance.",
    TENANT_INACTIVE:
      "This tenant account has expired. Please renew the subscription to continue using the service.",
    USER_NOT_FOUND:
      "User not found. Please verify the entered email or contact support for assistance.",
    TENANT_NOT_FOUND:
      "Tenant not found. Please check the entered name or contact support for assistance.",
    RECORD_NOT_FOUND:
      "Record not found. Please ensure the correct details are provided.",
    TENANT_UPDATE_FAILED:
      "Failed to update tenant. Please try again or contact support for assistance.",
    USER_UPDATE_FAILED:
      "Failed to update user. Please try again or contact support for assistance.",
    PASSWORD_UPDATE:
      "Failed to update password. Please try again or contact support for assistance.",
    PASSWORD_RESET: "User have requested for password reset. Please update your new password and try again",
    DUPLICATE_GROUP_NAME: "Duplicate tenant group name found",
    SSO_NOT_ENABLED: "Sso is not enabled for this particular organisation",
    DOMAIN_NOT_REGISTER: "Entered Domain is not registered",
    FORGET_PWD_ERR_MSG: "Entered email id is registered as Sso login type. Forget password cannot be initiated",
    SSO_DOMAIN_MISMATCH: "Domain validation failed. The entered domain does not match the expected domain.",
    USERS_NOT_FOUND:
      "Users not found. Please try again or contact support for assistance.",
    LOGOUT_FAILED: "Logout failed. Please try again or contact support for assistance.",
    INVALID_IMAGE: "Invalid image format",
    MISMATCH_EMAIL_DOMAIN: "Entered email domain doesnt match with the tenant registered domain",
    PWDEXPIERATION_FAILED: "Sorry,the link to reset your password has expired,Please request a new one to continue",
    MIST_TOKEN_FAILED: "MIST Auth token generation failed",
    RESETPWD_AS_OLD: "You cannot set the same password as your old one. Please choose a new password.",
    ALREADY_PWD_REQUESTED: "Password reset already requested. Check your email for the reset link"
  };

  DATE_FORMAT = {
    USER_DATE_FORMAT: 'MMM D, YYYY h:mm A',
    USER_INFO_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss'
  }

  LOGGER_MESSAGE = {
    USER_VALIDATION_UNSUCCESSFUL: 'User validation failed',
    USER_VALIDATION_SUCCESSFUL: 'User validation successful',
    USER_CREATE: 'User created successful',
    USER_CREATE_FAILED: 'User create failed',
    LOGIN_SUCCESSFUL: 'User logined successful',
    LOGIN_FAILED: 'User login failed',
    PASSWORD_GENERATION: 'Password generated successful',
    PASSWORD_GENERATION_FAILED: 'Password generated failed',
    PASSWORD_CHANGE: 'Password changed successful',
    PASSWORD_CHANGE_FAILED: 'Password change failed',
    TENANT_VALIDATION_UNSUCCESSFUL: 'Tenant validation failed',
    TENANT_VALIDATION_SUCCESSFUL: 'Tenant validation successful',
    TENANT_CREATE: 'Tenant created successful',
    TENANT_CREATE_FAILED: 'Tenant create failed',
    TENANT_DELETED: 'Tenant deleted successful',
    TENANT_DELETED_FAILED: 'Tenant deleted failed',
    TERMS_OF_SERVICE: 'Terms of service send successful',
    TERMS_OF_SERVICE_FAILED: 'Terms of service send failed',
    USER_INFO_GET: 'User info retrieval successful',
    USER_INFO_GET_FAILED: 'User info retrieval failed',
    USER_PASSWORD_UPDATE: 'User password updated successful',
    USER_PASSWORD_UPDATE_FAILED: 'User password updated failed',
    USER_DELETED: 'User deleted successful',
    USER_DELETED_FAILED: 'User deleted failed',
    USER_ROLE_MAPPING_UPDATE: 'User role mapping updated successful',
    USER_IMAGE_FAILED: 'User profile upload failed',
    USER_UPDATED: 'User updates successful',
    USER_UPDATED_FAILED: 'User updates failed',
    GET_ROLES: 'Roles retrieval successful',
    GET_ROLES_FAILED: 'Roles retrieval failed',
    CLOUD_USER_GET: 'getCloudUsers - Users retrieval successful',
    USER_GET: 'getAllUsers - Users retrieval successful',
    MANAGE_USER_GET: 'manageUserList - Users retrieval successful',
    USER_GET_FAILED: 'Users retrieval unsuccessful',
    PROJECT_USER_GET: 'Project wise user retrieval successful',
    PROJECT_USER_GET_FAILED: 'Project wise user retrieval failed',
    AUTHGURD_VALIDATEING: "validateToken - Token validation started",
    MISSING_TOKEN: "validateToken - Missing authorization header",
    VERIFICATION_FAILED: "validateToken - Token verification failed:",
    INVALID_FORMAT: "validateToken - Invalid token format",
    VALIDATION_FAILED: "validateToken - Error:",
    GET_DATA_TOKEN_FAILED: "getDataByToken - Error:",
    GET_DATA_TOKEN_INVALID: "getDataByToken - Invalid token",
    UPDATE_USER_ROLE_FAILED: "Update user role failed",
    GET_PROJECT_USER_FAILED: "Get user based project failed",
    USER_ALREADY: "User already mapped",
    REGISTER_USER: "Register user function initiated",
    REGISTER_USER_COMPLETED: "Register user function completed",
    LOGIN_USER: "Login user function initiated",
    USER_LOGIN: "Login user - ",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User status is inactive",
    FORGET_PASSWORD: "Forget password function initiated",
    PASSWORD: "Forget password",
    EMAIL_SEND: "Email send successful",
    EMAIL_SEND_FAILED: "Email send failed",
    FORGET_PASSWORD_COMPLETED: "Forget password function completed",
    FORGET_PASSWORD_FAILED: "Forget password failed",
    UPDATE_PASSWORD: "Update password function initiated",
    UPDATE_PASSWORD_COMPLETED: "Updated password function completed",
    UPDATE_PASSWORD_FAILED: "Updated password function failed",
    PASSWORD_UPDATE: "Password update - ",
    TENANT_REGISTER: "Tenant register function initiated",
    TENANT_REGISTER_COMPLETED: "Tenant register function completed",
    TENANT_REGISTER_FAILED: "Tenant register function failed",
    REGISTER_TENANT: "Tenant register - ",
    TENANT_DELETE: "Tenant Delete - ",
    DELETE_TENANT: "Tenant deleted function initiated",
    DELETE_TENANT_COMPLETED: "Tenant deleted function completed",
    DELETE_TENANT_FAILED: "Tenant deleted function failed",
    TERMS_OF: "Terms service function initiated",
    PRIVACY_POLICY: "Privacy Policy - ",
    TERMS_OF_SERVICE_COMPLETED: "Terms of service completed",
    USER_INFO: "User info function initiated",
    USER_INFO_COMPLETED: "User info function completed",
    USER_INFO_FAILED: "User info function failed",
    USER_GET_INFO: "User Info - ",
    USER_UPDATE_PASSWORD: "User password update function initiated",
    USER_UPDATE_PASSWORD_COMPLETED: "User password update function compeleted",
    USER_UPDATE_PASSWORD_FAILED: "User password update function failed",
    UPDATE_USER_PASSWORD: "User password - ",
    USER_DELETE: "User delete function initiated",
    USER_DELETE_COMPLETED: "User deleted function completed",
    UPDATED_USER_AND_IMAGE_UPLOAD: "User update function initiated",
    UPDATED_USER_AND_IMAGE_UPLOAD_COMPLETED: "User update function completed",
    UPDATED_USER_AND_IMAGE_UPLOAD_FAILED: "User update function failed",
    UPDATED_IMAGE_UPLOAD_AND_USER: "Update Image upload and user - ",
    USER_UPDATE: "User update - ",
    UPDATE_USER: "Update user function initiated",
    UPDATE_USER_COMPLETED: "Update user function completed",
    UPDATE_USER_FAILED: "Update user function failed",
    ROLE_GET: "Get role function initiated",
    ROLE_GET_COMPLETED: "Get role function completed",
    ROLE_GET_FAILED: "Get role function failed",
    GET_ALL_USERS: "Get all user function initiated",
    GET_ALL_USERS_COMPLETED: "Get all user function completed",
    GET_ALL_USERS_FAILED: "Get all user function failed",
    GET_ALL_PROJECT_USERS: "Get all user function initiated",
    GET_ALL_PROJECT_USERS_COMPLETED: "Get all user function completed",
    GET_ALL_PROJECT_USERS_FAILED: "Get all user function failed",
    LOGOUT_INITIATED: "Logout function initiated",
    INVALID_IMAGE: "Invalid image format",
    PWD_EXPIERATION_STARTED: "Password expieration function started",
    PWD_EXPIERATION_COMPLETED: "Password expieration function completed",
    PWD_EXPIERATION_FAILED: "Password expieration function failed",
    SERVICE: "Service - ",
    MIST_TOKEN_GENERATION: "MIST Token generation controller started",
    MIST_TOKEN_GENERATION_SERVICE: "MIST Token generation service started",
    MIST_TOKEN_BAD_RESPONSE: "MIST Token generation failed",
    MIST_TOKEN_OTHER_SERVICE_START: "MIST token generation service call started ",
    MIST_TOKEN_OTHER_SERVICE_COMPLETED: "MIST token generation service call completed ",
    MIST_API_CALL_START: "Mist API call started",
    MIST_API_CALL_ENDED: "MIST API call completed",
    CONTROLLER: "Controller - ",
    MANAGE_USERS_FAILED: "Manage user list function failed: ",
    CLOUD_USER_LIST: "Cloud user list function failed: ",
    IMAGE_DELETED_SUCCESSFULLY: "User Image deleted successfully",
    BLOB_NOT_EXIST: "Blob does not exists",
    BLOB_DELETED: "Blob deleted successfully",
    UNABLE_TO_REDIRECT: "Unable to perform redirection.",
    INTERNAL_SERVER_ERROR: "Internal Server Error"
  }
}
