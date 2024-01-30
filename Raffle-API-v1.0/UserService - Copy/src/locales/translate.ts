import { CLIENT_ERROR_MESSAGES, CLIENT_MESSAGES } from "../locales/langConstant";

const getErrorMessage = async (acceptLanguage: string | undefined): Promise<Record<string, string>> => {
    const language: string = acceptLanguage || "en";
    return await CLIENT_ERROR_MESSAGES[language] || CLIENT_ERROR_MESSAGES["en"];
};

const getMessage = async (acceptLanguage: string | undefined): Promise<Record<string, string>> => {
    const language: string = acceptLanguage || "en";
    return await CLIENT_MESSAGES[language] || CLIENT_MESSAGES["en"];
};

export { getErrorMessage, getMessage };