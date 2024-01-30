import { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES, TOKEN } from "../utils/appConstant";
import { HTTP_STATUS_CODES } from "../utils/httpStatusCodes";
import { LOGGER_MESSAGES } from "../utils/logConstant";
import { logger } from "../utils/logger";
import { getErrorMessage } from "../locales/translate";

import HandleResponse from "../helpers/handleResponse";


export default class AuthGuard {

    private RESPONSE = new HandleResponse();
    /**
     * Verify auth token
     */
    async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info(LOGGER_MESSAGES.AUTHGURD_VALIDATEING);
            const errorMessages: Record<string, string> = await getErrorMessage(req.headers["accept-language"]);
            const authHeader: string | undefined = req.headers.authorization;
            if (!authHeader) {
                logger.error(LOGGER_MESSAGES.MISSING_TOKEN);
                this.RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, `${errorMessages["EMPTY_TOKEN"]}`, res);
                return;
            }
            if (authHeader && authHeader.startsWith(TOKEN.PERFIX_TOKEN)) {
                const token = authHeader.split(" ")[1];
                const findToken = { token: "hari" }; // = await findAuthByAuthTokenFields({ email: decodedToken.email });
                if (findToken?.token === token) {
                    next();
                } else {
                    logger.error(LOGGER_MESSAGES.VERIFICATION_FAILED);
                    this.RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, `${errorMessages["INVALID_TOKEN"]}`, res);
                    return;
                }
            } else {
                logger.error(LOGGER_MESSAGES.INVALID_FORMAT);
                this.RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, `${errorMessages["INVALID_TOKEN"]}`, res);
                return;
            }
        } catch (error: unknown) {
            logger.info(LOGGER_MESSAGES.VALIDATION_FAILED, error);
            if (error instanceof Error)
                this.RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
            else
                this.RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, res);
        }
    }
}
