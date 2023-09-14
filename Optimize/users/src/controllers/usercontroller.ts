import UserService from "../services/userservice";
import { Request, Response } from 'express';
import Validation from "../validators/validators";
import AppConstants from "../utils/constant";
import formidable from "formidable";
import _ from "lodash";
import AuthGuard from "../middleware/authguard";
const logger = require('../helpers/logger');

const userService = new UserService();
const validation = new Validation();
const appConstant = new AppConstants();
const authGuard = new AuthGuard()

export default class UserController {

    /**
      * The below function is used for create new user
      */
    async userRegister(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const userData = JSON.parse(JSON.stringify(req.body));
            const { error, values } = validation.userRegister.validate(userData);
            if (error) {
                logger.error(`${appConstant.LOGGER_MESSAGE.USER_VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
                return;
            }
            logger.info(appConstant.LOGGER_MESSAGE.USER_VALIDATION_SUCCESSFUL);
            const user = await userService.registerUser(userData, tokenData);
            logger.info(`${appConstant.LOGGER_MESSAGE.USER_CREATE}`)
            res.status(200).send(user);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_CREATE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for login functionality
     */
    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            let { email, password } = req.body;
            email = (email as string).toLowerCase();
            const userData = {
                email,
                password,
            };

            await userService.loginUser(userData).then((data) => {
                logger.info(appConstant.LOGGER_MESSAGE.LOGIN_SUCCESSFUL);
                res.status(200).json(data);
            })
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.LOGIN_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for forget password functionality
     */
    async forgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const email_address = (email as string).toLowerCase();
            await userService.forgetPassword(email_address).then((data) => {
                logger.info(appConstant.LOGGER_MESSAGE.PASSWORD_GENERATION);
                res.status(200).json(appConstant.PASSWORD.LINK_GENERATED);
            })
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.PASSWORD_GENERATION_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used to change the password if the user forgets
     */
    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const userid = req.body.userid;
            const password = req.body.password;
            const { error, values } = validation.password.validateAsync({ password: password });
            if (error) {
                logger.error(`${appConstant.LOGGER_MESSAGE.USER_VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
                return;
            }
            logger.info(appConstant.LOGGER_MESSAGE.USER_VALIDATION_SUCCESSFUL);
            const finalResponse: any = await userService.updatePassword(userid, password, req, res);
            logger.info(appConstant.LOGGER_MESSAGE.PASSWORD_CHANGE);
            if(finalResponse == appConstant.MESSAGES.FAILED){
                res.status(400).json(appConstant.ERROR_MESSAGES.RESETPWD_AS_OLD);
            }else{
                res.status(200).json(appConstant.PASSWORD.UPDATED_PASSWORD);
            } 
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.PASSWORD_CHANGE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The function below is used for the Tenant and Tenant_User register functionality
     */
    async tenantRegister(req: Request, res: Response): Promise<void> {
        try {
            const tenantData = req.body;
            const validateObj = {
                email: tenantData.email,
                org_name: tenantData.org_name,
                domain_name: tenantData.domain_name,
                login_type: tenantData.login_type,
                user_type: tenantData.user_type,
                status: tenantData.status,
                password: tenantData.password,
                contact_name: tenantData.contact_name,
                contact_info: tenantData.contact_info,
                sso_enabled: tenantData.sso_enabled
            }
            const { error, values } = validation.tenantRegister.validate(validateObj);
            if (error) {
                logger.error(`${appConstant.LOGGER_MESSAGE.TENANT_VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
                return;
            }
            logger.info(appConstant.LOGGER_MESSAGE.TENANT_VALIDATION_SUCCESSFUL);
            const teantUser = await userService.tenantRegister(tenantData);
            logger.info(appConstant.LOGGER_MESSAGE.TENANT_CREATE);
            res.status(200).send(teantUser);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.TENANT_CREATE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for deleting Tenant functionality
     */
    async tenantDelete(req: Request, res: Response): Promise<void> {
        try {
            const query = JSON.parse(JSON.stringify(req.query));
            await userService.tenantDelete(query);
            logger.info(appConstant.LOGGER_MESSAGE.TENANT_DELETED);
            res.status(200).send(appConstant.MESSAGES.TENANT_DELETED);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.TENANT_DELETED_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The function below is used for the get Terms of service or Privacy Policy
     */
    async TermsofservicePrivacyPolicy(req: Request, res: Response): Promise<void> {
        try {
            const query = JSON.parse(JSON.stringify(req.query));
            const responseData = await userService.TermsofservicePrivacyPolicy(query);
            logger.info(appConstant.LOGGER_MESSAGE.TERMS_OF_SERVICE);
            res.status(200).send(responseData);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.TERMS_OF_SERVICE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for Get Tenant Data functionality
     */
    async userInfoget(req: Request, res: Response): Promise<void> {
        try {
            const query = JSON.parse(JSON.stringify(req.params));
            const userinfoData = await userService.userInfoget(query);
            if (!_.isNil(userinfoData)) {
                const responseObj = {
                    message: appConstant.MESSAGES.USER_INFO,
                    data: userinfoData
                }
                logger.info(appConstant.LOGGER_MESSAGE.USER_INFO_GET)
                res.status(200).send(responseObj)
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_INFO_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * The below function is used for Update the User Password
     */
    async userPasswordUpdate(req: Request, res: Response): Promise<void> {
        try {
            const userData = JSON.parse(JSON.stringify(req.body));
            const userId = req.params._id;
            const { error, value } = await validation.validateUserName({ password: userData.password });
            if (error) {
                logger.error(`${appConstant.LOGGER_MESSAGE.USER_VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
                return;
            }
            logger.info(appConstant.LOGGER_MESSAGE.USER_VALIDATION_SUCCESSFUL);
            const passwordUpdate = await userService.userPasswordUpdate(userData, userId);
            if (passwordUpdate) {
                logger.info(appConstant.LOGGER_MESSAGE.USER_PASSWORD_UPDATE);
                res.status(200).send(passwordUpdate);
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_PASSWORD_UPDATE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * User Soft delete
     */
    async userDelete(req: Request, res: Response): Promise<void> {
        try {
            const query = JSON.parse(JSON.stringify(req.params));
            const user = await userService.userDelete(query);
            logger.info(appConstant.LOGGER_MESSAGE.USER_DELETED);
            res.status(200).send(user);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_DELETED_FAILED} ${error.message}`)
            res.status(400).send(error.message);
        }
    }


    /**
     * Profile info user update
     */
    async userUpdate(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const form = formidable({ multiples: true });
            const params = JSON.parse(JSON.stringify(req.params));
            const query = JSON.parse(JSON.stringify(req.query));
            form.parse(req, async function (err: any, fields: any, files: any) {
                const userData = JSON.parse(fields['data']);
                if (query.imageupload == "true") {
                    const { error, value } = await validation.validateUserName({ first_name: userData.first_name, last_name: userData.last_name });
                    if (error) {
                        logger.error(`${appConstant.LOGGER_MESSAGE.USER_VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                        res.status(400).send(error.details[0].message);
                        return;
                    }
                    logger.info(appConstant.LOGGER_MESSAGE.USER_VALIDATION_SUCCESSFUL);
                    if (err) {
                        logger.error(`${appConstant.LOGGER_MESSAGE.USER_IMAGE_FAILED}`);
                        res.status(400).send(appConstant.MESSAGES.IMAGE_UPLOAD)
                    }
                    if (files.File !== undefined) {
                        files = files.File;
                        files.tempFilePath = files.filepath;
                        if (files.mimetype === 'image/jpeg' || files.mimetype === 'image/jpg') {
                            await userService.updateUserAndimgUpload(params, files, userData, tokenData).then((imageUpload) => {
                                const responseObj = {
                                    message: appConstant.MESSAGES.USER_UPDATE,
                                    data: imageUpload
                                }
                                logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATED);
                                res.status(200).send(responseObj);
                            }).catch((error) => {
                                logger.error(`${appConstant.LOGGER_MESSAGE.USER_UPDATED_FAILED} ${error.message}`);
                                res.status(400).send(error.message);
                            });
                        }
                        else {
                            logger.info(appConstant.LOGGER_MESSAGE.INVALID_IMAGE);
                            res.status(400).send(appConstant.ERROR_MESSAGES.INVALID_IMAGE);
                        }
                    } else {
                        if(userData.status === appConstant.SCHEMA.STATUS_INACTIVE) {
                            userData.status = appConstant.USER_STATUS.STATUS_PENDING
                        } else if (userData.status === appConstant.SCHEMA.STATUS_ACTIVE) {
                            userData.status = appConstant.USER_STATUS.STATUS_CONFIRMED
                        }
                        await userService.userUpdate(params, userData).then((userUpdate) => {
                            logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATED);
                            res.status(200).send(userUpdate);
                        }).catch((error) => {
                            logger.error(`${appConstant.LOGGER_MESSAGE.USER_UPDATED_FAILED} ${error.message}`);
                            res.status(400).send(error.message);
                        })
                    }

                } else if (query.imageupload == "false") {
                    await userService.updateUserAndimgRemove(params, userData, tokenData).then((imageremove)=> {
                        const responseObj = {
                            message: appConstant.MESSAGES.USER_UPDATE,
                            data: imageremove
                        }
                        logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATED);
                        res.status(200).send(responseObj);
                    }).catch((error)=> {
                        logger.error(`${appConstant.LOGGER_MESSAGE.USER_UPDATED_FAILED} ${error.message}`);
                        res.status(400).send(error.message);
                    })
                } else {
                    if(userData.status === appConstant.SCHEMA.STATUS_INACTIVE) {
                        userData.status = appConstant.USER_STATUS.STATUS_PENDING
                    } else if (userData.status === appConstant.SCHEMA.STATUS_ACTIVE) {
                        userData.status = appConstant.USER_STATUS.STATUS_CONFIRMED
                    }
                    await userService.userUpdate(params, userData).then((userUpdate)=> {
                        const responseObj = {
                            message: appConstant.MESSAGES.USER_UPDATE,
                            data: userUpdate
                        }
                        logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATED);
                        res.status(200).send(responseObj);
                    }).catch((error)=> {
                        logger.error(`${appConstant.LOGGER_MESSAGE.USER_UPDATED_FAILED} ${error.message}`);
                        res.status(400).send(error.message);
                    })
                }
            })
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_UPDATED_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    async getRoles(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const rolesList = await userService.getRoles(tokenData);
            logger.info(appConstant.LOGGER_MESSAGE.GET_ROLES);
            res.status(200).send(rolesList);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.GET_ROLES_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function used for Get - all users
     */
    async getAllUsers(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            logger.info(appConstant.LOGGER_MESSAGE.USER_GET);
            const usersList = await userService.getAllUsers(tokenData, req);
            res.status(200).send(usersList)
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
    * This below function used for Get - all role with access level
    */
    async getAllProjectUsers(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const usersList = await userService.getAllProjectUsers(req, tokenData);
            logger.info(appConstant.LOGGER_MESSAGE.PROJECT_USER_GET);
            res.status(200).send(usersList);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }
    async UpdateUser(req: Request, res: Response): Promise<void> {
        try {
            const params = JSON.parse(JSON.stringify(req.params));
            let data = JSON.parse(JSON.stringify(req.body));
            if(data.status === false) {
                data.status = appConstant.USER_STATUS.STATUS_PENDING
            } else if (data.status === true) {
                data.status = appConstant.USER_STATUS.STATUS_CONFIRMED
            }
            const responseData = await userService.userUpdate(params, data);
            res.status(200).send(responseData);
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * Logut user
     */
    async logoutUser(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const logout = await userService.logout(tokenData);
            res.status(200).send(logout);
        }
        catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * Password expiration check
     */

    async passwordExpirationCheck(req: Request, res: Response) {
        try {
            const pwdExpirationCheck = await userService.pwdExpirationCheck(req.params._id);
            res.status(200).send(pwdExpirationCheck);
            logger.info(appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_COMPLETED);
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_FAILED);
            res.status(400).send(error.message)
        }
    }

    /**
     * Get cloud user list
     */
    async getCloudUsers(req: Request, res: Response) {
        try {
            const userIds = JSON.parse(JSON.stringify(req.body.userIds));
            const usersList = await userService.getCloudUsers(userIds);
            logger.info(appConstant.LOGGER_MESSAGE.CLOUD_USER_GET);
            res.status(200).send(usersList)
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to get all users except specific project users
     */
    async manageUserList(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const userList = await userService.manageUserList(req, tokenData);
            logger.info(appConstant.LOGGER_MESSAGE.MANAGE_USER_GET);
            res.status(200).send(userList);
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.MANAGE_USERS_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }
        
        
}