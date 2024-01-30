const MESSAGES = {
    PORT_LISTEN: "Server is now running on port ",
    USER_CREATE: "User has been successfully created.",
    USER_UPDATE: "User has been successfully updated.",
    EMAIL_VERIFICATION: "Email verification successful!",
    LOGIN_SUCCESSFUL: "You're now securely logged in.",
};

const ERROR_MESSAGES = {
    INVALID_EMAIL_OR_PASSWORD:
        "Invalid email or password. Please check your credentials and try again.",
    EXISTING_USER:
        "This email is already registered. Please choose a different email or sign in.",
    EMAIL_VERIFICATION_FAILED:
        "Email verification failed.",
    ALREADY_VERIFIED:
        "your account has already been verified",
    USER_NOT_FOUND:
        "User not found. Please verify the entered Id or contact support for assistance.",
    EMAIL_VERIFY_PENDING:
        "Your email verification is pending. Please check your inbox for instructions.",
    INVALID_MOBILE:
        "Invalid phone number. Please check your phone number and try again.",
    URL_NOT_FOUND:
        "The requested resource could not be found on the server.",
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
export { ERROR_MESSAGES, MESSAGES, DBCONNECTION, COLLECTION_NAMES, STATUS };