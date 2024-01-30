import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../utils/httpStatusCodes";
import { LOGGER_MESSAGES } from "../utils/logConstant";
import { logger } from "../utils/logger";

import HandleResponse from "../helpers/handleResponse";
import UserService from "../services/userService";
import Validation from "../validators/joiValidation";

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
                logger.info(`${LOGGER_MESSAGES.USER_VALIDATION_UNSUCCESSFUL} ${error?.details?.[0]?.message}`);
                response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, `${error?.details?.[0]?.message}`, res);
                return;
            }
            const responseData = await userService.registerUser(userData, req);
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_COMPLETED);
            response.handleSuccessResponse(HTTP_STATUS_CODES.CREATED, responseData["message"], responseData["data"], res);
        } catch (error: any) {
            logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.REGISTER_USER_FAILED);
            response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
        }
    }

    /**
     * Function to verify the email
     */
    async verifyEmail(req: Request, res: Response) {
        try {
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION);
            const userData = JSON.parse(JSON.stringify(req.params));
            const responseData = await userService.verifyEmail(userData, req);
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION_COMPLETED);
            response.handleSuccessResponse(HTTP_STATUS_CODES.OK, responseData["message"], responseData["data"], res);
        } catch (error: any) {
            logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.EMAIL_VERIFICATION_FAILED);
            response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
        }
    }

    /**
     *  Function to handle user login
     */
    async login(req: Request, res: Response) {
        try {
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_USER);
            const userData = JSON.parse(JSON.stringify(req.body));
            const { error } = validation.login.validate(userData);
            if (error) {
                logger.info(`${LOGGER_MESSAGES.USER_VALIDATION_UNSUCCESSFUL} ${error?.details?.[0]?.message}`);
                response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, `${error?.details?.[0]?.message}`, res);
                return;
            }
            const responseData = await userService.login(userData, req);
            logger.info(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_COMPLETED);
            response.handleSuccessResponse(HTTP_STATUS_CODES.OK, responseData.message, responseData.data, res);
        } catch (error: any) {
            logger.error(LOGGER_MESSAGES.CONTROLLER + LOGGER_MESSAGES.LOGIN_FAILED);
            response.handleErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, res);
        }
    }

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