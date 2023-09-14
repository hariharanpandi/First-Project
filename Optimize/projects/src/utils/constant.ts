export default class AppConstants {
  URL = {
    BASE_URL: "/projectx",
  };

  TOKEN = {
    PERFIX_TOKEN: "Bearer",
  };
  DATE_FORMAT = {
    USER_DATE_FORMAT: 'MMM D, YYYY h:mm A',
    USER_INFO_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss'
  }
  USER_STATUS = {
    STATUS_CONFIRMED: 'confirmed',
    STATUS_PENDING: 'pending',
    STATUS_DELETED: 'deleted'
  }
  SCHEMA = {
    STATUS_ACTIVE: "Active",
    STATUS_INACTIVE: "Inactive",
    TOKEN_EXPIRE_TIME: "20m",
    PROJECT_COLLECTION_NAME: "projects",
    APP_COLLECTION_NAME: "application",
    PROJECT_MAP: "project_user_mapping",
    APPLICATION_MAP: "user_application_mapping",
    WORKLOAD_COLLECTION_NAME: "workload",
    WORKLOAD_MAP: "user_workload_mapping",
    AUTH_TOKEN: "auth_token",
    ADMIN_USER: "A",
    NORMAL_USER: "N",
    OWNER_COLLECTION: "owner",
    OWNER_CLASS: "Owner.Organization",
    CLOUD_ONBOARD: "clouds",
    SUCCESS: "Success",
    AUDIT_TRAILS: "audit_trails"
  };

  CLOUD = {
    AWS: "ec2",
    AZURE: "azure_arm"
  }
  SORT = {
    ASCENDING: "asc",
    DESCENDING: "desc",
    DEFAULT_SORT: "-created_at"
  }
  CLOUD_PROVIDER = {
    AWS: "Cloud.AmazonCloud",
    AZURE: "Cloud.AzureArmCloud",
    GCP: "Cloud.GCP",
    OCI: "Cloud.OCI"
  }

  CLOUD_PLATFORMS = {
    AWS: "Aws",
    AZURE: "Azure",
    GCP: "GCP",
    OCI: "OCI"
  }
  CLOUD_REQUEST_AWS = {
    _cls: "Cloud.AmazonCloud",
    dns_enabled: true,
    object_storage_enabled: true
  }

  REDIS_MIST_TOKEN_KEYNAME = "Mist_tokenDetails"

  ROLES = ["Project_Admin", "Infra_Admin", "View_Only"]

  WORKLOAD_ADMIN = "Workload_Admin"

  ROLES_SPACE = {
    Project_Admin: "Project Admin",
    Infra_Admin: "Infra Admin",
    View_Only: "View Only",
    Workload_Admin: "Workload Admin"
  }

  AUDIT_TRAIL = {
    PROJECT_MAP_CREATED: "Project user mapping created",
    PROJECT_MAP_UPDATED: "Project user mapping updated",
    PROJECT_MAP_REMOVED: "Project user mapping removed",
    CREATE: "create",
  }

  DISCOVERY_STATUS = {
    INPROGRESS: "Inprogress",
    SUCCESS: "Success",
    FAILED: "Failed"
  }
  MESSAGES = {
    EMPTY_TOKEN:
      "Authentication token is missing. Please provide a valid token.",
    UNAUTHORIZED_USER:
      "Access denied. You are not authorized to perform this action.",
    INVALID_TOKEN: "Invalid token. Please provide a valid authentication token.",
    PORT_LISTEN: "Server is now running on port ",
    DELETE_PROJECT: "Project has been successfully deleted.",
    PROJECT_NOT_FOUND: "Project not found. Please verify the Project name or contact support for assistance.",
    PROJECT_CREATED: "Project has been successfully created.",
    PROJECT_UPDATED: "Project has been successfully updated.",
    APP_CREATED: "Application has been successfully created.",
    APP_UPDATED: "Application has been successfully updated.",
    USER_ROLE_MAP: "User role mapped successfully",
    APP_NOT_FOUND: "Application not found. Please verify the Application name or contact support for assistance.",
    DELETE_APP: "Application has been successfully deleted.",
    USER_PROJECT_MAP: "User and role mapping has been successfully updated.",
    APPLICATION_NOT_FOUND: "No application found for this project",
    MIST_AUTH_TOKEN_SAVED: "MIST Auth token saved in session",
    MIST_AUTH_TOKEN_FOUND: "This  user already has a  MIST Auth token saved in session",
    MIST_AUTH_TOKEN_NOT_FOUND_USER: "The user does not have the MIST Auth token saved in the session",
    MIST_AUTH_TOKEN_NOT_FOUND: "The session is empty please create the mist token",
    MIST_VERIFY_COMPLETED: "Verification Successful",
    TOEKN_DETAILS_STORED_SUCCESSFULLY: 'Token details stored successfully:',
    VERIFICATION_SUCCESSFULL: "verification Success",
    GET_CLOUD_SINGLE_PROGRESS_CONTROLLER: "Single Cloud progress percentage controller started",
    GET_CLOUD_SINGLE_PROGRESS_CONTROLLER_COMPLETE: "Single cloud progress percentage controller completed",
    GET_CLOUD_SINGLE_PROGRESS_SERVICE_STARTED: "Single cloud progress percentage service started",
    GET_CLOUD_SINGLE_PROGRESS_SERVICE_COMPLETED: "Single cloud progress percentage service Completed",
    PROJECT_NAME_NULL: "Project name must not be null.",
    APP_NAME_NULL: "Project name must not be null.",
    DISCOVERY_INITIATED: "Discovery successfully initiated"
  };

  DBCONNECTION = {
    SUCCESSFUL: "Connected to MongoDB",
    UNSUCCESSFUL: "MongoDB connection error",
    ERROR: "MongoDB connection error",
    RECONNECTED: "Reconnected to MongoDB",
    DISCONNECTED: "MongoDB disconnected. Reconnecting...",
  };

  REDIS_CONNECTION = {
    CONNECT: 'Connected to Redis',
    READY: 'Redis client is ready',
    END: 'Redis client connection ended',
    RECONNECTING: 'Redis client is reconnecting',
    CLOSE: 'Redis client is offline',
  }

  ERROR_MESSAGES = {
    DISCOVERY_LOCKED: "Please note that the discovery process for this cloud account is currently locked. It will be enabled again in 30 minutes.",
    MANDATORY_FIELD_MISSING: "Please fill out all required fields to proceed.",
    DUPLICATE: "Duplicate records found. Please ensure uniqueness of the data.",
    PROJECT_NOT_FOUND:
      "Project not found. Please verify the entered project id or contact support for assistance.",
    PROJECT_NAME_NOT_FOUND:
      "Project not found. Please verify the entered project name or contact support for assistance.",
    INVALID_IMAGE: "Invalid image format",
    MIST_TOKEN_FAILED: "MIST Auth token generation failed",
    MIST_CONNECTION_FAILED: "MIST Connection validate failed",
    CLOUD_ONBOARD_FAILED: "Cloud Onboard create failed",
    CLOUD_DUPLICATE_ACCOUNT: "Duplicate record found. Already a cloud account present on the same cloud account number ",
    ERROR_FETCHING_TOKEN_DETAILS: "Error fetching token details:",
    ERROR_STORING_TOKEN_DETAILS: 'Error storing token details:',
    FETCHING_PROGRESS_PERCENTAGE_MSG_FAILED: "Fetching progress percentage failed",
    GET_REGION_MIST_API_FAILED: "Get region failed ",
    GENERATE_AUTH_TOKEN_MIST_FAILED: "Generate auth token mist function failed",
    VERIFY_CLOUD_CREDNTIAL_FAILED: "Verify credential mist function failed",
    GET_CLOUD_DISCOVERY_FAILED: "Get cloud discovery mist function failed",
    GET_SUBSCRIPTION_FAILED: "Get Subscription mist function failed",
    GET_PROGRESS_FOR_SINGLE_CLOUD_FAILED: "Get Progress for Single Cloud mist function failed",
    CLOUD_CRED_FAILED: "Cloud account verification failed !",
  };

  LOG_MESSAGES = {
    PROJECT_DELETE: "projectDelete - Project deleted successfully",
    PROJECT_CREATE: "projectCreate - Project created successfully",
    PROJECT_UPDATE: "projectUpdate - Project updated successfully",
    GET_ALL_PROJECT: "getAllProject - Project's retrieval successful",
    GET_PROJECT_INFO: "getProjectInfo - Project retrieval successful",
    VALIDATION_SUCCESSFUL: "Project validation successful",
    VALIDATION_UNSUCCESSFUL: "Project validation failed:",
    APP_CREATED: "applicationCreate - Application created successfully",
    APP_UPDATED: "applicationUpdate - Application updated successfully",
    APP_DELETE: "applicationDelete - Application delete successfully",
    GET_ALL_APP: "getAllApplication - Application's retrieval successful",
    GET_APP_INFO: "getApplicationInfo - Application retrieval successful",
    GET_Workload_APP: "getAllWorkload - Workload's retrieval successful",
    GET_Workload_INFO: "getWorkloadInfo - Workload retrieval successful",
    APP_VALIDATION_FAILED: "applicationUpdate - Application data validation failed:",
    JSON_PARSE_ERROR: "applicationCreate - Failed to parse form data:",
    GET_PROJECT_INFO_FAILED: "getProjectInfo - Failed to get project info",
    GET_ALL_PROJECT_FAILED: "getAllProject - Failed to get all project",
    PROJECT_DELETE_FAILED: "projectDelete - Failed to delete project",
    PROJECT_CREATE_FAILED: "projectCreate - Failed to create project",
    PROJECT_UPDATE_FAILED: "projectUpdate - Failed to update project",
    APP_CREATED_FAILED: "applicationCreate - Failed to create application:",
    APP_UPDATED_FAILED: "applicationUpdate - Failed to update application:",
    DELETE_APP_FAILED: "applicationDelete - Failed to delete application:",
    GET_ALL_APP_FAILED: "getAllApplication - Failed to get all application's:",
    GET_APP_INFO_FAILED: "getApplicationInfo - Failed to get application info",
    GET_ALL_Workload_FAILED: "getAllWorkload - Failed to get all workload's:",
    GET_Workload_INFO_FAILED: "getWorkloadInfo - Failed to get workload info",
    AUTHGURD_VALIDATEING: "validateToken - Token validation started",
    MISSING_TOKEN: "validateToken - Missing authorization header",
    INVALID_FARMAT: "validateToken - Invalid token format",
    VALIDATION_FAILED: "validateToken - Error:",
    VERIFICATION_FAILED: "validateToken - Token verification failed:",
    GET_DATA_TOKEN_FAILED: "getDataByToken - Error:",
    GET_DATA_TOKEN_INVALID: "getDataByToken - Invalid token",
    SAVE_IMG: "saveImage - Image saved successfully in Azure",
    IMG_FAILED: "saveImage - Failed to save image in Azure:",
    PROJECT_INFO: "getProjectInfo - ",
    CREATE_PROJECT: "createProject - ",
    UPDATE_PROJECT: "updateProject - ",
    DELETE_PROJECT: "deleteProject - ",
    GET_PROJECTS: "getAllProject - ",
    CREATE_APP: "applicationCreate - ",
    UPDATE_APP: "applicationUpdate - ",
    DELETE_APP: "applicationDelete - ",
    GET_INFO_APP: "getApplicationInfo - ",
    USER_MAP_START: "projectUserMapCreate - Started processing for project user mapping",
    USER_MAP: "projectUserMapCreate - Project user mapped successfully",
    GET_PROJECT_USER_FAILED: "getProjectUser - Failed to get project users.",
    USER_MAP_FAILED: "projectUserMapCreate - Failed to mapping for project and user",
    CHECK_USER_ROLE_MAP_FAILED: "checkUserRoleMap - Failed to check user role map or not.",
    USER_MAP_WORKLOAD_CALLED: "projectUserMap - Workload service call is being initiated",
    USER_MAP_APP_COMPLETED: "userRoleMap - Application mapping completed",
    FAILED: "Failed",
    INVALID_IMAGE: "Invalid image format",
    APPLICATION_USER_MAP: "applicationCreate - Application user map started.",
    GET_REGIONS_FAILED: "getRegion - Failed to get region.",
    CLOUD_USER_COUNT_FAILED: "cloudUsersCount - Failed to get region.",
    CLOUD_USER_COUNT: "cloudUsersCount - Cloud count retrieval successful.",
    CLOUD_USER_LIST_SUCCESS: "cloudUserList - Cloud users list retrieval successful.",
    CLOUD_USER_LIST_FAILED: "cloudUserList - Cloud users list retrieval unsuccessful.",
    MIST_API_SUCCESS: "Mist API call completed.",
    MIST_API_FAILED: "Mist API call failed:",
    CHECK_USER_ROLE_MAP: "checkUserRoleMap - check user role map or not function is started.",
    GET_REGION: "getRegion - get region function is started.",
    GET_PROJECT_USER: "getProjectUser - get project user's function is started.",
    CHECK_USER_ROLE_MAP_SUCCESS: "checkUserRoleMap - check user role map or not successfully completed.",
    GET_REGION_SUCCESS: "getRegion - get region retrieval successful.",
    GET_PROJECT_USER_SUCCESS: "getProjectUser - get project user's retrieval successful.",
    MIST_TOKEN_GENERATION: "MIST Token generation controller started",
    MIST_TOKEN_GENERATION_SERVICE: "MIST Token generation service started",
    MIST_TOKEN_BAD_RESPONSE: "MIST Token generation failed",
    MIST_TOKEN_OTHER_SERVICE_START: "MIST token generation service call started ",
    MIST_TOKEN_OTHER_SERVICE_COMPLETED: "MIST token generation service call completed ",
    MIST_API_CALL_START: "Mist API call started",
    MIST_API_CALL_ENDED: "MIST API call completed", 
    USER_GET_FAILED: 'Users retrieval unsuccessful',
    MIST_CONNECTION_VALIDATE: "MIST Connection validate function started",
    MIST_CONNECTION_COMPLETED: "MIST Connection validate function completed",
    MIST_CONNECTION_FAILED: "MIST Connection validate function failed",
    SERVICE: "Service - ",
    CONTROLLER: "Controller - ",
    CLOUD_COUNT_SERVICE: "cloud users count -function started",
    CLOUD_USER_LIST: "cloud users list -function started",
    CLOUD_ONBOARD_CONTROLLER_STARTED: "Cloud Onboard controller started",
    CLOUD_ONBOARD_SERVICE_STARTED: "Cloud Onboard service started",
    CLOUD_ONBOARD_SERVICE_COMPLETED: "Cloud Onboard service completed",
    GET_CLOUD_CONTROLLER_STARTED: "Get Cloud Functaion controller Started",
    GET_CLOUD_CONTROLLER_COMPLETED: "Get Cloud Functaion controler completed",
    GET_CLOUD_FAILED: "Get Cloud Functaion failed",
    GET_CLOUD_SERVICE_STARTED: "Get Cloud Functaion service Started",
    GET_CLOUD_SERVICE_COMPLETED: "Get Cloud Functaion service completed",
    CLOUD_ONBOARD_CONTROLLER_EDIT_STARTED: "Cloud Onboard edit controller started",
    CLOUD_ONBOARD_EDIT_SERVICE_STARTED: "Cloud Onboard edit service started",
    CLOUD_ONBOARD_EDIT_SERVICE_COMPLETED: "Cloud Onboard edit service completed",
    CLOUD_ONBOARD_CONTROLLER_EDIT_COMPLETED: "Cloud Onboard edit controller completed",
    CLOUD_SUBSCRITPTIONS_LIST_CONTROLLER_START: "Cloud Subscription List controller started",
    CLOUD_SUBSCRITPTIONS_LIST_CONTROLLER_COMPLETE: "Cloud Subscription List controller completed",
    CLOUD_SUBSCRITPTIONS_LIST_SERVICE_COMPLETE: "Cloud Subscription List service completed",
    CLOUD_SUBSCRITPTIONS_LIST_SERVICE_START: "Cloud Subscription List service start",
    CLOUD_SUBSCRIPTION_LIST_SERVICE_STARTED: "Cloud subscription list service started",
    GET_CLOUD_DISCOVERY_STARTED: "Get Cloud discovery Functaion controller Started",
    GET_CLOUD_DISCOVERY_COMPLETED: "Get Cloud discovery Functaion controler completed",
    GET_CLOUD_DISCOVERY_FAILED: "Get Cloud discovery Functaion failed",
    GET_CLOUD_DISCOVERY_SERVICE_STARTED: "Get Cloud discovery Functaion service Started",
    GET_CLOUD_DISCOVERY_SERVICE_COMPLETED: "Get Cloud discovery Functaion service completed",
    GET_CLOUD_SINGLE_PROGRESS_FAILED: "Get Cloud progress percentage for Single cloud failed",
    GET_ALL_CLOUD_PLATFORMS_CONTROLLER_STARTED: "Get all cloud platforms controller started",
    GET_ALL_CLOUD_PLATFORMS_CONTROLLER_COMPLETED: "Get all cloud platforms controller completed",
    GET_ALL_CLOUD_PLATFORMS_SERVICE_STARTED: "Get All cloud platforms service started",
    GET_CLOUD_PLATFORMS_SERVICE_COMPLETED: "Get all Cloud platforms service completed",
    BLOB_NOT_EXIST: "Blob does not exists",
    BLOB_DELETED: "Blob deleted successfully",
    GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_START: "Get all cloud account name controller started",
    GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_COMPLETED: "Get all cloud account name controller completed",
    GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_START: "Get all cloud account name service started",
    GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_COMPLETED: "Get all cloud account name service completed",
    GET_ALL_CLOUD_ACCOUNT_NAME_FAILED: "Get all cloud account name function failed"
  }
}