import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../utils/httpStatusCodes";
import { LOGGER_MESSAGES } from "../utils/logConstant";
import { logger } from "../utils/logger";

import HandleResponse from "../helpers/handleResponse.js";
import UserService from "../services/userService";
import Validation from "../validators/joiValidation";
import CustomError from "../helpers/customError";
import { CLIENT_MESSAGES } from "../locales/langConstant";

const userService = new UserService();
const validation = new Validation();
const response = new HandleResponse();

export default class UserController {

    /**
     * User registration
     */
    async registerUser(req: Request, res: Response) {
        try {
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER);
            const userData = JSON.parse(JSON.stringify(req.body));
            const { error } = validation.userRegister.validate(userData);
            if (error) {
                logger.info(`${LOGGER_MESSAGES.USER_VALIDATION_UNSUCCESSFUL} ${error?.details?.[0]?.message ?? "Validation error"}`);
                response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error?.details?.[0]?.message ?? "Validation error", res);
                return;
            }
            const DATA = await userService.registerUser(userData);
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_COMPLETED);
            const language: string = req.headers["accept-language"] || "en";
            const messages = CLIENT_MESSAGES[language] || CLIENT_MESSAGES["en"];
            response.handleSuccessResponse(HTTP_STATUS_CODES.CREATED, messages["USER_CREATE"], DATA, res);
        } catch (error: unknown) {
            logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_FAILED);
            if (error instanceof CustomError)
                response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
        }
    }

    // /**
    //  * Function to verify the email
    //  */
    // async verifyEmail(req, res) {
    //     try {
    //         logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION);
    //         const USER_DATA = JSON.parse(JSON.stringify(req.params));
    //         const DATA = await userService.verifyEmail(USER_DATA);
    //         logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION_COMPLETED);
    //         response.handleSuccessResponse(HTTP_STATUS_CODES.ok, appConstant.MESSAGES.EMAIL_VERIFICATION, DATA, res);
    //     } catch (error) {
    //         logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION_FAILED);
    //         response.handleErrorResponse(HTTP_STATUS_CODES.bad_request, error.message, res);
    //     }
    // }

    // /**
    //  *  Function to handle user login
    //  */
    // async login(req, res) {
    //     try {
    //         logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_USER);
    //         const USER_DATA = JSON.parse(JSON.stringify(req.body));
    //         const DATA = await userService.login(USER_DATA);
    //         logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_COMPLETED);
    //         response.handleSuccessResponse(HTTP_STATUS_CODES.ok, appConstant.MESSAGES.LOGIN_SUCCESSFUL, DATA, res);
    //     } catch (error) {
    //         logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_FAILED);
    //         response.handleErrorResponse(HTTP_STATUS_CODES.bad_request, error.message, res);
    //     }
    // }

    // /**
    //  *  This function used to get all ui style
    //  */
    // async style(req, res) {
    //     try {
    //         const DATA = await userService.style();
    //         response.handleSuccessResponse(HTTP_STATUS_CODES.ok, 'Style', DATA, res);
    //     } catch (error) {
    //         response.handleErrorResponse(HTTP_STATUS_CODES.bad_request, error.message, res);
    //     }
    // }
}