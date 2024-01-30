import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS_CODES } from "../utils/httpStatusCodes";
import { LOGGER_MESSAGE } from "../utils/logConstant";
import { logger } from "../utils/logger";
import { getErrorMessage } from "../locales/translate";

import HandleResponse from "../helpers/handleResponse";

const RESPONSE = new HandleResponse();

export const headerVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorMessages: Record<string, string> = await getErrorMessage(req.headers["accept-language"]);
        const X_VERIFICATION_TOKEN: string | undefined = process.env["X_VERIFY_TOKEN"];
        const verificationToken = req.headers["x-verification-token"];
        if (!verificationToken || verificationToken === X_VERIFICATION_TOKEN) {
            RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, `${errorMessages["INVALID_X_VERIFY_TOKEN"]}`, res);
            return;
        }
        next();
    } catch (error: unknown) {
        logger.info(LOGGER_MESSAGE.VALIDATION_FAILED, error);
        if (error instanceof Error)
            RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
        else {
            const errorMessages: Record<string, string> = await getErrorMessage(req.headers["accept-language"]);
            RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, `${errorMessages["INTERNAL_SERVER_ERROR"]}`, res);
        }
    }
};
