const MESSAGES = {
    PORT_LISTEN: "Server is now running on port "
};

const ERROR_MESSAGES = {
    INTERNAL_SERVER_ERROR:"Internal Server Error",
    VALIDATION_ERROR:"Validation error."
};

const COLLECTION_NAMES = {
    USER: "user",
    IDENTITY: "identity",
};

const STATUS = {
    ACTIVE: "active",
    INACTIVE: "inActive",
    PENDING: "pending",
};

const DBCONNECTION = {
    SUCCESSFUL: "Connected to MongoDB",
    UNSUCCESSFUL: "MongoDB connection error",
    ERROR: "MongoDB connection error",
    RECONNECTED: "Reconnected to MongoDB",
    DISCONNECTED: "MongoDB disconnected. Reconnecting...",
};

const TOKEN = {
    PERFIX_TOKEN: "Bearer",
};
export { ERROR_MESSAGES, MESSAGES, DBCONNECTION, COLLECTION_NAMES, STATUS, TOKEN };
