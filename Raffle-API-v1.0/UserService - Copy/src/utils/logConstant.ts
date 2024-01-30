const LOGGER_MESSAGES = {
    AUTHGURD_VALIDATEING:
        "validateToken - Token validation started",
    MISSING_TOKEN:
        "validateToken - Missing authorization header",
    VERIFICATION_FAILED:
        "validateToken - Token verification failed:",
    INVALID_FORMAT:
        "validateToken - Invalid token format",
    VALIDATION_FAILED:
        "validateToken - Error:",
    CONTROLLER:
        "Controller - ",
    SERVICE:
        "Service - ",
    USER_VALIDATION_UNSUCCESSFUL:
        "User validation failed",
    USER_VALIDATION_SUCCESSFUL:
        "User validation successful",
    REGISTER_USER:
        "Register user function initiated",
    REGISTER_USER_COMPLETED:
        "Register user function completed",
    REGISTER_USER_FAILED:
        "Register user function failed.",
    USER_CREATE:
        "User created successful",
    USER_CREATE_FAILED:
        "User create failed",
    LOGIN_USER:
        "User login function initiated",
    LOGIN_COMPLETED:
        "User login function completed.",
    LOGIN_FAILED:
        "User login function failed.",
    EMAIL_SEND:
        "Email send successful",
    EMAIL_SEND_FAILED:
        "Email send failed",
    INVALID_EMAIL_OR_PASSWORD:
        "Invalid email or password. Please check your credentials and try again.",
    EXISTING_USER:
        "This user is already registered. Please choose a different email or sign in.",
    EMAIL_VERIFICATION:
        "Email verification function initiated",
    EMAIL_VERIFICATION_COMPLETED:
        "Email verification function completed",
    EMAIL_VERIFICATION_FAILED:
        "Email verification function failed.",
    USER_NOT_FOUND:
        "User not found. Please verify the entered Id or contact support for assistance.",
    EMAIL_VERIFY_PENDING:
        "Your email verification is pending. Please check your inbox for instructions.",
};

export { LOGGER_MESSAGES };
