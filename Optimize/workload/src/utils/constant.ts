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
  
  ROLES_SPACE = {
    Project_Admin: "Project Admin",
    Infra_Admin: "Infra Admin",
    View_Only: "View Only",
    Workload_Admin: "Workload Admin"
  }

  SCHEMA = {
    ISTRUE: true,
    ISFALSE: false,
    ADMIN_USER: "A",
    NORMAL_USER: "N",
    STATUS_ACTIVE: "Active",
    STATUS_INACTIVE: "Inactive",
    WORKLOAD_USERS_COLLEECTION_NAME: "user_workload_mapping",
    WORKLOAD_COLLECTION: "workload",
    AUTH_TOKEN: "auth_token",
    WORKLOAD_RESOURCE_GROUPING: "workload_resource_grouping",
    META_SERVICE: "meta_services"
  };

  MESSAGES = {
    EMPTY_TOKEN: "Authentication token is missing. Please provide a valid token.",
    UNAUTHORIZED_USER: "Access denied. You are not authorized to perform this action.",
    INVALID_TOKEN: "Invalid token. Please provide a valid authentication token.",
    PORT_LISTEN: "Server is now running on port ",
    WORKLOAD_CREATED: "Workload has been created successfully.",
    WORKLOAD_UPDATED: "Workload has been updated successfully.",
    WORKLOAD_NAME_UPDATED: "Workload name has been updated successfully.",
    WORKLOAD_DELETED: "Workload has been deleted successfully.",
    APPLICATION_MESSAGE: "The resource has been already used in",
    WORKLOAD_DISCOVERY_FLAG_UPDATE:"Workload discovery flag has been updated successfully.",
    APPLICATION_MESSAGE_NOT_FOUND: "The resource is not used in any applications.",
    ERROR_STORING_TOKEN_DETAILS: 'Error storing token details:',
    TOEKN_DETAILS_STORED_SUCCESSFULLY: 'Token details stored successfully:',
    WORKLOAD_NAME_DUPLICATE:"Duplicate records found. Please ensure uniqueness of the workload name.",
    WORKLOAD_NAME:"Proceed to the next step if the name of the workload does not match any records.",
  };

  REQUEST_TYPES = {
    CREATE: "create",
    EDIT: "edit"
  }

  ROLES = ["Project_Admin", "Infra_Admin", "View_Only"];

  WORKLOAD_ADMIN = 'Workload_Admin';

  DBCONNECTION = {
    SUCCESSFUL: "Connected to MongoDB",
    UNSUCCESSFUL: "MongoDB connection error",
    ERROR: "MongoDB connection error",
    RECONNECTED: "Reconnected to MongoDB",
    DISCONNECTED: "MongoDB disconnected. Reconnecting...",
    
  };

  ERROR_MESSAGES = {
    MANDATORY_FIELD_MISSING: "All fields are mandatory!",
    DUPLICATE: "Duplicate records found. Please ensure uniqueness of the data.",
    WORKLOAD_NOT_FOUND:
      "Workload not found. Please verify the entered workload id or contact support for assistance.",
    WORKLOAD_NAME_NULL: "Workload name must not be null.",
    NODES_NULL: "It is necessary to have at least one resource.",
    RESOURCE_ID_NOT_MATCHED: "Resource group id did not match with any records",
    RESOURCES_NOT_FOUND: "Resource not found",
    CLOUD_RESOURCE_GROUP_NOT_MATCHED: "Cloud resource group not matched with any records",
    LOOKUPKEYS_UNDEFINED: "Lookup keys are not defined.",
    APPLICATIONS_NOT_FOUND: 'Applications are not found for workload',
    MACHINE_DATA_NOT_FOUND: "Data not found for this collection",
    ERROR_FETCHING_TOKEN_DETAILS: "Error fetching token details:",
    ERROR_STORING_TOKEN_DETAILS: 'Error storing token details:',
    FETCHING_PROGRESS_PERCENTAGE_MSG_FAILED: "Fetching progress percentage failed",
    MIST_TOKEN_FAILED: "MIST Auth token generation failed",
    GET_ALL_CLOUD_ACCOUNT_NAME_FAILED: "Get all cloud account name function failed",
    RESOURCE_NOT_FOUND: "Resource is not found for the resource group id",
    DUPLICATE_RECORD_FOUND: "Unexpected errror occurred, Duplicate records found",
    PRICE_TAGGER_EMPTY_VALUE: "Price tagger returns empty value",
  };

  REDIS_MIST_TOKEN_KEYNAME = "Mist_tokenDetails"

  REDIS_CONNECTION = {
    CONNECT: 'Connected to Redis',
    READY: 'Redis client is ready',
    END: 'Redis client connection ended',
    RECONNECTING: 'Redis client is reconnecting',
    CLOSE: 'Redis client is offline',
  }

  LOGGER_MESSAGE = {
    VERIFICATION_FAILED: "validateToken - Token verification failed:",
    PROJECT_USER_MAP_CREATE: 'Project user map create completed', 
    PROJECT_USER_MAP_CREATE_FAILED: 'Project user map create failed',
    GET_ALL_WORKLOAD_COMPLETED: 'Get all workload retrieval successful',
    GET_ALL_WORKLOAD_FAILED: 'Get all workload retrieval failed',
    SERVICE: "Service - ",
    PROJECT_USER_MAP_CREATE_INITIATED: "Project user map create function initiated",
    GET_ALL_WORKLOAD_INITIATED: "Get all workload retrieval function initiated",
    REMOVE_USER_WORKLOAD_FAILED: "Remove user workload failed",
    CONTROLLER: "Controller - ",
    WORKLOAD_CREATE_UPDATE: "workloadCreateAndUpdate - function initiated",
    WORKLOAD_DELETE: "workloadDelete - function initiated",
    WORKLOAD_NAME_CHANGE: "workloadNameChange - function initiated",
    WORKLOAD_DISCOVERY_FLAG_UPDATE: "discoverSyncUpdate - function initiated",
    WORKLOAD_CREATED_SUCCESSFUL: "Workload created successfully",
    VALIDATION_UNSUCCESSFUL: "Project validation failed:",
    GETALL_WORKLOAD_CONTROLLER_STARTED: "Get all workload controller started",
    GETALL_WORKLOAD_CONTROLLER_COMPLETED: "Get all workload controller Completed",
    GETALL_WORKLOAD_SERVICE_STARTED: "Get all workload service started",
    GETALL_WORKLOAD_SERVICE_COMPLETED: "Get all workload service completed",
    GETALL_CLOUD_PLATFORM_CONTROLLER_STARTED: "Get all cloud patform controller started ",
    GETALL_CLOUD_PLATFORM_CONTROLLER_COMPLETED: "Get all cloud patform controller completed",
    GETALL_CLOUD_PLATFORM_SERVICE_STARTED: "Get all cloud platform service started",
    GETALL_CLOUD_PLATFORM_SERVCIE_COMPLETED: "Get all cloud platform service completed",
    GETALL_CLOUD_PLATFORM_SERVICE_FAILED: "Get all cloud platform service failed",
    WORKLOAD_NAME_CHANGE_FAILED: "Workload name change function failed: ",
    CLOUD_RESOURCE_GRP_MASTER_CREATE_START: "Cloud resource group master controller create started",
    CLOUD_RESOURCE_GRP_MASTER_CREATE_COMPLETED: "Cloud resource group master controller create completed",
    CLOUD_RESOURCE_GRP_MASTER_CREATE_SERVICE_START: "Cloud resource group master service create started",
    CLOUD_RESOURCE_GRP_MASTER_CREATE_SERVICE_COMPLETED: "Cloud resource group master service create completed",
    CLOUD_RESOURCE_GRP_MASTER_CREATE_FAILED: "Cloud resource group master create failed",
    GET_CLOUD_CATEGORY_CONTROLLER_STARTED: "Get Cloud Category controller started",
    GET_CLOUD_CATEGORY_CONTROLLER_COMPLETED: "Get Cloud Category controller completed",
    GET_CLOUD_CATEGORY_SERVICE_STARTED: "Get Cloud Category service started",
    GET_CLOUD_CATEGORY_SERVICE_COMPLETED: "Get Cloud Category service completed",
    GET_CLOUD_CATEGORY_FAILED: "Get Cloud Category failed",
    GET_WORKLOAD_FAILED: "Get Workload retrieval failed",
    GET_CLOUD_RESOURCE_GROUP_CONTROLLER_START: "Get cloud resource group controller started",
    GET_CLOUD_RESOURCE_GROUP_CONTROLLER_COMPLETED: "Get cloud resource group controller completed",
    GET_CLOUD_RESOURCE_GROUP_SERVICE_START: "Get cloud resource group service started",
    GET_CLOUD_RESOURCE_GROUP_SERVICE_COMPLETED: "Get cloud resource group service completed",
    GET_CLOUD_RESOURCE_GROUP_FAILED: "Get cloud resource group function failed",
    GET_RESOURCE_INFO_STARTED: "Get Resource info function started",
    GET_RESOURCE_INFO_FAILED: "Get Resource info function failed",
    FETCH_RESOURCE_INFO_STARTED: "Fetch Resource info function started",
    FETCH_RESOURCE_INFO_FAILED: "Fetch Resource info function failed",
    FETCH_USED_APPLICATIONS_INFO_STARTED: "Fetch Used Applications info function started",
    FETCH_USED_APPLICATIONS_INFO_FAILED: "Fetch Used Applications info function failed",
    COLLECTION_MISMATCHED: "Given Collection name is not found in Data base",
    GET_CLOUD_RESOURCES_CONTROLLER_START: "Get all cloud resources started",
    GET_CLOUD_RESOURCES_CONTROLLER_COMPLETED: "Get all cloud resources completed",
    GET_CLOUD_RESOURCES_SERVICES_START: "Get all cloud services started",
    GET_CLOUD_RESOURCES_SERVICES_COMPLETED: "Get all cloud services completed",
    GET_CLOUD_RESOURCE_FAILED: "Get cloud resources function failed",
    DYNAMIC_KEY_VALUE_MAPPING_START: "Dynamic key value mapping started",
    DYNAMIC_KEY_VALUE_MAPPING_COMPLETED: "Dynamic key value mapping completed",
    DYNAMIC_KEY_VALUE_MAPPING_FAILED: "Dynamic key value mapping failed",
    BLOB_NOT_EXIST: "Blob does not exists",
    BLOB_DELETED: "Blob deleted successfully",
    SAVE_IMG: "saveImage - Image saved successfully in Azure",
    IMG_FAILED: "saveImage - Failed to save image in Azure:",
    MIST_TOKEN_GENERATION_SERVICE: "MIST Token generation service started",
    MIST_TOKEN_OTHER_SERVICE_COMPLETED: "MIST token generation service call completed ",
    GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_START: "Get all cloud account name controller started",
    GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_COMPLETED: "Get all cloud account name controller completed",
    GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_START: "Get all cloud account name service started",
    GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_COMPLETED: "Get all cloud account name service completed",
    GET_ALL_WORKLOAD_STARTED: "Get all workload function started",
    GET_ALL_WORKLOAD_MAP_STARTED: "Get all workload map function started",
    GET_ALL_WORKLOAD_MAP_FAILED: "Get all workload map function failed",
    GET_PRICE_TAGGER_STARTED: "Get price tagger started",
    GET_PRICE_TAGGER_COMPLETED: "Get price tagger completed",
    GET_PRICE_TAGGER_FAILED: "Price details not found",
    VIEW_WORKLOAD_STARTED: "View workload started",
    VIEW_WORKLOAD_COMPLETED: "View workload completed",
    VIEW_WORKLOAD_FAILED: "View workload failed",
    GET_WORKLOAD_FUNCTION_STARTED: "Get workload function started",
    GET_WORKLOAD_FUNCTION_COMPLETED: "Get workload function completed",
    GET_PROJECT_FUNCTION_STARTED: "Get project function started",
    GET_PROJECT_FUNCTION_COMPLETED: "Get project function completed",
    GET_PROJECT_FUNCTION_FAILED: "Get project function failed",
    GET_PRICE_TAGGER_SERVICE_CALL_STARTED: "Get price service call started",
    GET_PRICE_TAGGER_SERVICE_CALL_FAILED: "Get price service call failed",
    GET_PRICE_TAGGER_SERVICE_CALL_COMPLETED: "Get price service call completed",
    GET_WROKLOAD_RESOURCE_FUNCTION_STARTED: "Get workload resource retrivel started",
    GET_WROKLOAD_RESOURCE_FUNCTION_COMPLETED: "Get workload resource function completed",
    RESOURCE_NOT_FOUND: "Resource is not found for the resource group id",
    BLANK_PICTURE: "The picture should not be blank.",
    WORKLOAD_NOT_FOUND: "Workload not found",
    WORKLOAD_CREATED: "workload created successfully"
  }

}