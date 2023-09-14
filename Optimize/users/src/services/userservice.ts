import bcrypt from "bcrypt";
import { generateAuthToken, userCreate, findByUserId, updateUserByid, findByUserFields, findAll, userCount } from "../models/usermodel";
import { tenantCreate, findByTenantId, findByField, updateTenantById } from "../models/tenantmodel";
import { Request, Response } from 'express';
import AppConstants from "../utils/constant";
import _ from "lodash";
const nodemailer = require('nodemailer');
import path from "path";
const ejs = require('ejs');
const fs = require('fs');
import { findByLoginCmsFields } from "../models/logincmsmodel";
import ProjectService from "./projectservices";
import { findByGrpFields, pushTenantId, tenantGroupCreate } from "../models/tenantgroupmodel";
import { findByRoleId, getAllRoles } from "../models/rolesmodel";
const { BlobServiceClient } = require('@azure/storage-blob');
import DateConvertor from '../helpers/date';
import ApiFilters from "../helpers/apifilters";
import { removeAuthToken, findAndUpdateAuthToken, findAuthByAuthTokenFields } from "../models/authtokenmodel";
import moment from "moment-timezone";
import AzureImage from "../helpers/azureimage";
const dateconvertor = new DateConvertor();
const logger = require('../helpers/logger');

require('dotenv').config();


const projectService = new ProjectService();
const appConstant = new AppConstants();
const azureImage = new AzureImage();
export default class UserService {

    /**
     * User registration
     */
    async registerUser(userData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.REGISTER_USER);
            const { user_name, email } = userData;
            const email_address = (email as string).toLowerCase();
            const domain = email_address.split("@")[1];
            const isDomainMatch = await findByField({ domain_name: domain, _id: tokenData.tenant_id });
            if (isDomainMatch == null) {
                throw new Error(appConstant.ERROR_MESSAGES.MISMATCH_EMAIL_DOMAIN);
            }
            const userExist = await findByUserFields({ _cls: appConstant.SCHEMA._CLS_USER, email: email_address, status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED, appConstant.USER_STATUS.STATUS_PENDING] } });
            if (userExist) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_ALREADY);
                throw new Error(appConstant.ERROR_MESSAGES.EXISTING_USER);
            }
            const nameParts = user_name.split(" ");
            const last_name = nameParts.find((namepart: string | any[]) => namepart.length === 1 || namepart.length === 2);
            const index = nameParts.indexOf(last_name);
            if (index !== -1) {
                nameParts.splice(index, 1);
            }
            const first_name = nameParts.join(' ');
            const tenant = await findByTenantId(tokenData.tenant_id);
            const login_type = tenant?.sso_enabled == appConstant.SCHEMA.ISACTIVE ? appConstant.SCHEMA.SSO_USER : appConstant.SCHEMA.BASIC_USER;
            const currentDate = new Date();
            const expireDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            const user = await userCreate({
                _cls: appConstant.SCHEMA._CLS_USER,
                tenant_id: tokenData.tenant_id,
                tenant_group_id: tokenData.tenant_group_id,
                first_name: first_name?.trim(),
                last_name,
                email: email_address.toLowerCase(),
                login_type,
                created_by_user_id: tokenData._id,
                pwd_expiration_time: tenant?.sso_enabled == appConstant.SCHEMA.ISACTIVE ? null : expireDate,
                forget_pwd: tenant?.sso_enabled == appConstant.SCHEMA.ISACTIVE ? appConstant.SCHEMA.ISINACTIVE : appConstant.SCHEMA.ISACTIVE
            });
            const fileName = user.login_type === appConstant.SCHEMA.SSO_USER ? appConstant.PASSWORD.SSO_TEMPLATE : appConstant.PASSWORD.BASIC_TEMPLATE;
            const templatePath = path.join(__dirname, '..', 'utils', 'templates', fileName);
            const templateFile = fs.readFileSync(templatePath, 'utf8');
            const templateData = {
                user_name,
                redirecturl: user.login_type === appConstant.SCHEMA.BASIC_USER ? process.env.RESET_PASSWORD_REDIRECT_URL : process.env.SSO_USER_REDIRECT_URL,
                _id: user._id,
            };
            const renderedTemplate = ejs.render(templateFile, templateData);
            const transportmail = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: appConstant.SCHEMA.ISFALSE,
                auth: {
                    user: process.env.EMAIL_AUTH_USER,
                    pass: process.env.EMAIL_AUTH_PASSWORD
                }
            });
            const mailOption = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: appConstant.PASSWORD.SSO_USER,
                html: renderedTemplate
            };
            const info = await transportmail.sendMail(mailOption);
            console.log('Email sent: ' + info.response);
            logger.info(appConstant.LOGGER_MESSAGE.REGISTER_USER_COMPLETED)
            return {
                message: appConstant.MESSAGES.USER_CREATE,
                data: user
            };
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    /**
     * Login the user and verify the tenant is active, then only allow the user to login and generate a token.
     */
    async loginUser(userData: Record<string, any>): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.LOGIN_USER)
            let { email, password } = userData;
            email = (email as string).toLowerCase();
            const user = await findByUserFields({ _cls: appConstant.SCHEMA._CLS_USER, email, status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED, appConstant.USER_STATUS.STATUS_PENDING] } });
            if (!user) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            if (user.status === appConstant.USER_STATUS.STATUS_PENDING) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.USER_INACTIVE);
                throw new Error(appConstant.ERROR_MESSAGES.USER_INACTIVE);
            }
            const tenant = await findByTenantId(user.tenant_id);
            if (!tenant) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND);
            }
            if (tenant.status === appConstant.USER_STATUS.STATUS_PENDING) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.TENANT_INACTIVE);
                throw new Error(appConstant.ERROR_MESSAGES.TENANT_INACTIVE);
            }
            if (user.forget_pwd != undefined && user.forget_pwd == appConstant.SCHEMA.ISACTIVE) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.PASSWORD_RESET);
                throw new Error(appConstant.ERROR_MESSAGES.PASSWORD_RESET)
            }
            if (user && await bcrypt.compare(password, user.password)) {
                const accessToken = generateAuthToken(user, tenant);
                const dynamicFields = {
                    last_login_at: new Date()
                };
                await updateUserByid(user._cls, user._id, dynamicFields);
                const values = {
                    user_id: user._id,
                    email,
                    token: accessToken,
                    tenant_id: user.tenant_id,
                    tenant_group_id: user.tenant_group_id,
                    created_at: new Date()
                }
                await findAndUpdateAuthToken({ email }, values);
                return {
                    authDetails: {
                        accessToken,
                    },
                    userDetails: {
                        _cls: user._cls,
                        id: user.id,
                        name: user.first_name + appConstant.MESSAGES.EMPTY_SPACE + user.last_name,
                        email: user.email,
                        user_type: user.user_type,
                        status: user.status,
                    }
                }
            } else {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
                throw new Error(appConstant.ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
            }
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.LOGIN_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     *for Foget password scenario need to verify the user and generate an email to the give email id 
    */
    async forgetPassword(email: string): Promise<void> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.FORGET_PASSWORD)
            const dynamicFields = { _cls: appConstant.SCHEMA._CLS_USER, email }
            const user = await findByUserFields(dynamicFields);
            if (!user) {
                logger.error(appConstant.LOGGER_MESSAGE.PASSWORD + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            const tenant = await findByTenantId(user.tenant_id);
            if (!tenant) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND);
            }
            if (tenant.status === appConstant.USER_STATUS.STATUS_PENDING) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_LOGIN + appConstant.ERROR_MESSAGES.TENANT_INACTIVE);
                throw new Error(appConstant.ERROR_MESSAGES.TENANT_INACTIVE);
            }
            if (user.login_type === appConstant.USER_LOGIN_TYPE[1]) {
                logger.error(appConstant.LOGGER_MESSAGE.PASSWORD + appConstant.ERROR_MESSAGES.FORGET_PWD_ERR_MSG);
                throw new Error(appConstant.ERROR_MESSAGES.FORGET_PWD_ERR_MSG)
            }
            else {
                if (user.forget_pwd == appConstant.SCHEMA.ISACTIVE) {
                    const expirationTime = user.pwd_expiration_time;
                    const currentTime = moment();
                    // Convert the specified date and time to a moment object
                    const targetTime = moment(expirationTime);
                    if (currentTime.isBefore(targetTime)) {
                        throw new Error(appConstant.ERROR_MESSAGES.ALREADY_PWD_REQUESTED);
                    }
                }
                const templateFilePath = path.join(__dirname, '..', 'utils', 'templates', 'forgetpasswordtemplate.html');
                const templateFile = fs.readFileSync(templateFilePath, 'utf8');
                const templateData = {
                    username: user.first_name,
                    userid: user._id,
                    redirecturl: process.env.RESET_PASSWORD_REDIRECT_URL
                };
                // Render the template with the updated data
                const renderedTemplate = ejs.render(templateFile, templateData);

                const currentDate = new Date();
                const expireDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                const updateobj = {
                    forget_pwd: appConstant.SCHEMA.ISACTIVE,
                    pwd_expiration_time: expireDate
                }
                const userForgetPwdUpdate = await updateUserByid(user._cls, user._id, updateobj);
                // Create a transporter object
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: process.env.EMAIL_PORT,
                    secure: appConstant.SCHEMA.ISFALSE,
                    auth: {
                        user: process.env.EMAIL_AUTH_USER,
                        pass: process.env.EMAIL_AUTH_PASSWORD
                    }
                });
                // Prepare the email options
                const mailOptions = {
                    from: process.env.FROM_EMAIL,
                    to: email,
                    subject: appConstant.EMAIL_SUBJECT,
                    html: renderedTemplate
                };
                // Send the email
                transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
                    if (error) {
                        logger.error(appConstant.LOGGER_MESSAGE.EMAIL_SEND_FAILED)
                        console.log(error);
                    } else {
                        logger.error(appConstant.LOGGER_MESSAGE.EMAIL_SEND)
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            logger.error(appConstant.LOGGER_MESSAGE.FORGET_PASSWORD_COMPLETED)
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.FORGET_PASSWORD_FAILED)
            throw new Error(error.message);
        }
    }

    /**
     *for reset password scenario need to update the new password based on the user id 
    */
    async updatePassword(userid: string, password: string, req: Request, res: Response): Promise<string> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_PASSWORD);
            const getUser: any = await findByUserId(appConstant.SCHEMA._CLS_USER, userid);
            if (!getUser) {
                logger.error(appConstant.LOGGER_MESSAGE.PASSWORD_UPDATE + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            } else {
                const currentDate = new Date();
                const expireDate = new Date(getUser.pwd_expiration_time.toString());
                if (currentDate.getTime() > expireDate.getTime()) {
                    logger.error(appConstant.LOGGER_MESSAGE.PASSWORD_UPDATE + appConstant.EMAIL_LINK_VALIDATE);
                    throw new Error(appConstant.EMAIL_LINK_VALIDATE);
                } else {
                    let result = false;
                    if (!_.isNil(getUser.password)) {
                        result = await bcrypt.compare(password, getUser.password);
                    }
                    if (result) {
                        // Password is the same as the old one
                        logger.info(appConstant.MESSAGES.OLD_PWD_UPDATE);
                        return appConstant.MESSAGES.FAILED;
                    } else {
                        // Password is different, update it
                        logger.info(appConstant.MESSAGES.NEW_PWD_UPDATE);

                        const updateobj = {
                            forget_pwd: appConstant.SCHEMA.ISINACTIVE,
                            pwd_expiration_time: null,
                            password: await bcrypt.hash(password, 10),
                            last_pwd_changed_at: new Date(),
                        }
                        const passwordUpdate = await updateUserByid(appConstant.SCHEMA._CLS_USER, userid, updateobj);
                        return appConstant.MESSAGES.SUCCESS;
                    }
                }
            }
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_PASSWORD_FAILED);
            throw new Error(error.message);
        }
    }

    /**
    * Tenant and tenant_user creation
    */
    async tenantRegister(tenantData: Record<string, any>): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_PASSWORD);
            let {
                contact_name,
                contact_info,
                sso_enabled,
                expiry_on,
                domain_name,
                user_name,
                email,
                password,
                org_name,
                user_type,
                login_type,
                time_zone
            } = tenantData
            email = (email as string).toLowerCase();
            const [tenantExist, tenantDomainExist] = await Promise.all([
                findByField({ email, status: appConstant.USER_STATUS.STATUS_CONFIRMED }),
                findByField({ domain_name }),
            ]);
            if (!_.isNil(tenantExist)) {
                logger.error(appConstant.LOGGER_MESSAGE.REGISTER_TENANT + appConstant.ERROR_MESSAGES.EXISTING_TENANT);
                throw new Error(appConstant.ERROR_MESSAGES.EXISTING_TENANT);
            } else if (!_.isNil(tenantDomainExist)) {
                throw new Error(appConstant.ERROR_MESSAGES.EXISTING_DOMAIN);
            } else {
                //tenant creation logic 
                const tenant: any = await tenantCreate({
                    org_name,
                    domain_name,
                    contact_name,
                    email,
                    contact_info,
                    sso_enabled,
                    expiry_on,
                    time_zone
                });
                //Need to check if tenant group already exist

                const tenant_domain = { tenant_domain: tenantData.domain_name }
                const isTenantGrpExist = await findByGrpFields(tenant_domain);

                let tenantGroup;
                if (!_.isNil(isTenantGrpExist)) {
                    const tenant_domain = tenantData.domain_name;
                    const tenantid = tenant._id;
                    const updateTenantId = await pushTenantId(tenant_domain, tenantid);
                } else {

                    tenantGroup = await tenantGroupCreate({
                        tenant_map: [tenant._id],
                        tenant_domain: tenant.domain_name,
                    })
                }
                const nameParts = user_name.split(" ");
                const last_name = nameParts.find((namepart: string | any[]) => namepart.length === 1 || namepart.length === 2);
                const index = nameParts.indexOf(last_name);
                if (index !== -1) {
                    nameParts.splice(index, 1);
                }
                const first_name = nameParts.join(' ');
                const user = await userCreate({
                    _cls: appConstant.SCHEMA._CLS_USER,
                    tenant_id: tenant._id,
                    tenant_group_id: tenantGroup != undefined ? tenantGroup._id : isTenantGrpExist?._id,
                    first_name: first_name?.trim(),
                    last_name,
                    email: email.toLowerCase(),
                    password: bcrypt.hashSync(password, 10),
                    user_type,
                    login_type
                });
                logger.info(appConstant.LOGGER_MESSAGE.TENANT_REGISTER_COMPLETED);
                return { msg: appConstant.MESSAGES.TENANT_CREATED };
            }
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.TENANT_REGISTER_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * Tenant and tenant_user soft delete
     */
    async tenantDelete(params: Record<string, any>): Promise<void> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.DELETE_TENANT);
            const { tenant_id } = params;
            const tenant: any = await findByTenantId(tenant_id);
            const dynamicFields = { _cls: appConstant.SCHEMA._CLS_USER, email: tenant?.email }
            const user = await findByUserFields(dynamicFields);
            // const user = await findByEmail(tenant?.email)
            if (!tenant) {
                logger.error(appConstant.LOGGER_MESSAGE.TENANT_DELETE + appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND)
                throw new Error(appConstant.ERROR_MESSAGES.TENANT_NOT_FOUND);
            }
            const updateStatus = {
                status: appConstant.USER_STATUS.STATUS_DELETED
            }
            logger.info(appConstant.LOGGER_MESSAGE.DELETE_TENANT_COMPLETED);
            await updateUserByid(appConstant.SCHEMA._CLS_USER, user?._id.toString(), updateStatus);
            await updateTenantById(tenant_id, updateStatus);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.DELETE_TENANT_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * Get Terms-of-service or Privacy-policy
     */
    async TermsofservicePrivacyPolicy(params: Record<string, any>): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.TERMS_OF)
            const { page_url } = params;
            const data = await findByLoginCmsFields({ page_url });
            if (!data) {
                logger.error(appConstant.LOGGER_MESSAGE.PRIVACY_POLICY + appConstant.ERROR_MESSAGES.RECORD_NOT_FOUND)
                throw new Error(appConstant.ERROR_MESSAGES.RECORD_NOT_FOUND);
            }
            logger.info(appConstant.LOGGER_MESSAGE.TERMS_OF_SERVICE_COMPLETED);
            return data;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.TERMS_OF_SERVICE_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * Get Tenant data
     */
    async userInfoget(params: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.USER_INFO_GET);
            const { _id } = params;
            const user = await findByUserId(appConstant.SCHEMA._CLS_USER, _id);
            if (!user) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_GET_INFO + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            let tenantDtl: any = await findByTenantId(user.tenant_id.toString());
            user.user_name = _.isNil(user.last_name) ? user.first_name : `${user.first_name} ${user.last_name}`;
            const userRes: any = _.pick(user, ['_id', 'domain_name', 'user_name', 'first_name', 'last_name', 'email', 'last_active', 'last_pwd_changed_at', 'status', 'created_by_user_id', 'user_img', 'org_name', 'login_type']);
            if (user.user_type === appConstant.SCHEMA.ADMIN_USER) {
                userRes.org_name = tenantDtl?.org_name;
            }
            if (userRes.last_pwd_changed_at) {
                const dateConvert = await dateconvertor.dateConvertor(userRes.last_pwd_changed_at, tenantDtl, appConstant.DATE_FORMAT.USER_DATE_FORMAT)
                userRes.last_pwd_changed_at = dateConvert;
            }
            logger.info(appConstant.LOGGER_MESSAGE.USER_INFO_COMPLETED);
            return userRes;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.USER_INFO_FAILED);
            throw new Error(error.message)
        }
    }

    /**
     * The below function is used for Update the User Password in the profile info screen.
     */
    async userPasswordUpdate(userData: Record<string, any>, userid: string): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATE_PASSWORD);
            const verifyUser = await findByUserId(appConstant.SCHEMA._CLS_USER, userid);
            if (!verifyUser) {
                logger.error(appConstant.LOGGER_MESSAGE.UPDATE_USER_PASSWORD + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            if (verifyUser.status === appConstant.SCHEMA.STATUS_INACTIVE) {
                logger.error(appConstant.LOGGER_MESSAGE.UPDATE_USER_PASSWORD + appConstant.ERROR_MESSAGES.USER_INACTIVE);
                throw new Error(appConstant.ERROR_MESSAGES.USER_INACTIVE);
            }
            if (verifyUser.status === appConstant.SCHEMA.STATUS_DELETED) {
                logger.error(appConstant.LOGGER_MESSAGE.UPDATE_USER_PASSWORD + appConstant.ERROR_MESSAGES.USER_DELETED);
                throw new Error(appConstant.ERROR_MESSAGES.USER_DELETED);
            }
            else {
                const updateAtt = {
                    password: bcrypt.hashSync(userData.password, 5),
                    last_pwd_changed_at: new Date()
                }
                const updateEmail = await updateUserByid(appConstant.SCHEMA._CLS_USER, userid, updateAtt);
                if (_.isNil(updateEmail)) {
                    logger.error(appConstant.LOGGER_MESSAGE.UPDATE_USER_PASSWORD + appConstant.ERROR_MESSAGES.PASSWORD_UPDATE);
                    throw new Error(appConstant.ERROR_MESSAGES.PASSWORD_UPDATE);
                } else {
                    let tenantDtl: any = await findByTenantId(updateEmail.tenant_id.toString());
                    const userRes: any = _.pick(updateEmail, ['_id', 'tenant_id', 'tenant_group_id', 'first_name', 'last_name', 'email', 'status', 'last_pwd_changed_at', 'created_by_user_id']);
                    if (userRes.created_at) {
                        const dateConvert = await dateconvertor.dateConvertor(userRes.last_pwd_changed_at, tenantDtl, appConstant.DATE_FORMAT.USER_DATE_FORMAT)
                        userRes.last_pwd_changed_at = dateConvert;
                    }
                    logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATE_PASSWORD_COMPLETED);
                    return userRes
                }
            }
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.USER_UPDATE_PASSWORD_FAILED);
            throw new Error(error.message)
        }
    }

    /**
     * The below function is used to soft-delete the user
     */
    async userDelete(params: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.USER_DELETE);
            const { _id } = params;
            const user = await findByUserId(appConstant.SCHEMA._CLS_USER, _id);
            if (!user) {
                logger.error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND)
            }
            const updateStatus = {
                status: appConstant.USER_STATUS.STATUS_DELETED,
            }
            await updateUserByid(appConstant.SCHEMA._CLS_USER, _id, updateStatus);
            logger.info(appConstant.LOGGER_MESSAGE.USER_DELETE_COMPLETED);
            return appConstant.MESSAGES.DELETE_USER;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.USER_DELETED_FAILED + error.message);
            throw new Error(error.message)
        }
    }

    /**
     * This function is used to upload the image
     */
    async updateUserAndimgUpload(id: Record<string, any>, files: any, userData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD);
            const { _id } = id;
            const blobName = Date.now().toString() + '-' + files.originalFilename;
            // Image upload function called
            const blobUrl = await azureImage.saveImage(files, blobName);
            const { user_name } = userData;
            logger.info(appConstant.LOGGER_MESSAGE.IMAGE_DELETED_SUCCESSFULLY);
            let first_name;
            let last_name;
            if (user_name) {
                const nameParts = user_name.split(" ");
                if (nameParts.length > 1) {
                    last_name = nameParts.pop();
                }
                first_name = nameParts.join(" ");
            }
            const dynamicFileds = {
                first_name: first_name ? first_name?.trim() : userData.first_name?.trim(),
                last_name: last_name ? last_name : userData.last_name ? userData.last_name : null,
                user_img: blobUrl,
                blob_Name: blobName
            };
            const user: any = await updateUserByid(appConstant.SCHEMA._CLS_USER, _id, dynamicFileds);
            user.user_name = _.isNil(user.last_name) ? user?.first_name : `${user?.first_name} ${user.last_name}`;
            const userRes: any = _.pick(user, ['_id', 'tenant_id', 'tenant_group_id', 'user_name', 'first_name', 'last_name', 'email', 'status', 'last_pwd_changed_at', 'created_by_user_id', 'user_img', 'last_login_at']);
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_COMPLETED);
            return userRes;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_FAILED + error);
            throw new Error(error)
        }
    }

    /**
     * This function is used to remove the image
     */
    async updateUserAndimgRemove(id: Record<string, any>, userData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD);
            const { _id } = id;
            const data = await findByUserFields({ _cls: appConstant.SCHEMA._CLS_USER, _id: _id })
            if (!_.isNil(data.blob_Name)) {
                await azureImage.deleteImage(data);
            }
            const { user_name } = userData
            logger.info(appConstant.LOGGER_MESSAGE.IMAGE_DELETED_SUCCESSFULLY);
            let first_name;
            let last_name;
            if (user_name) {
                const nameParts = user_name.split(" ");
                if (nameParts.length > 1) {
                    last_name = nameParts.pop();
                }
                first_name = nameParts.join(" ");
            }
            const dynamicFileds = {
                user_img: null,
                first_name: first_name ? first_name?.trim() : userData?.first_name?.trim(),
                last_name: last_name ? last_name : userData.last_name ? userData.last_name : null,
                blob_Name: null
            }
            const user: any = await updateUserByid(appConstant.SCHEMA._CLS_USER, _id, dynamicFileds);
            user.user_name = _.isNil(user.last_name) ? user.first_name : `${user.first_name} ${user.last_name}`;
            const userRes: any = _.pick(user, ['_id', 'tenant_id', 'tenant_group_id', 'user_name', 'first_name', 'last_name', 'email', 'status', 'last_pwd_changed_at', 'created_by_user_id', 'user_img', 'last_login_at']);
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_COMPLETED);
            return userRes;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_FAILED + error.message);
            throw new error(`${appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_FAILED} ${`${appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_FAILED} ${error.message}`}`)
        }
    }

    /**
     * This function is used to update the user role mapping in project, app and workload wise
     */
    async userUpdate(params: Record<string, any>, userData: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_USER);
            let { user_name, status } = userData;
            if (status && status === appConstant.SCHEMA.STATUS_ACTIVE || status === true) {
                status = appConstant.USER_STATUS.STATUS_CONFIRMED
            } else if (status && status === appConstant.SCHEMA.STATUS_INACTIVE || status === false) {
                status = appConstant.USER_STATUS.STATUS_PENDING
            }
            const verifyUser = await findByUserId(appConstant.SCHEMA._CLS_USER, params._id);
            if (!verifyUser) {
                logger.error(appConstant.LOGGER_MESSAGE.USER_UPDATE + appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            let first_name;
            let last_name;
            if (user_name) {
                const nameParts = user_name.split(" ");
                if (nameParts.length > 1) {
                    last_name = nameParts.pop();
                }
                first_name = nameParts.join(" ");
            }
            const user = await updateUserByid(appConstant.SCHEMA._CLS_USER, params._id, {
                first_name: first_name ? first_name?.trim() : userData?.first_name?.trim(),
                last_name: last_name ? last_name : userData?.last_name ? userData.last_name : null,
                status
            });
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_USER_COMPLETED);
            user.user_name = _.isNil(user.last_name) ? user.first_name : `${user.first_name} ${user.last_name}`;
            const userRes = _.pick(user, ['_id', 'domain_name', 'user_name', 'first_name', 'last_name', 'email', 'last_active', 'last_pwd_changed_at', 'status', 'created_by_user_id', 'user_img', 'org_name', 'login_type'])
            return { message: appConstant.MESSAGES.USER_UPDATE, userRes };
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.UPDATE_USER_FAILED);
            throw new Error(error.message);
        }
    }

    /**
    * This function is used to get all role with access level
    */
    async getRoles(tokenData: Record<string, any>): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.ROLE_GET);
            const find = {
                status: appConstant.SCHEMA.STATUS_ACTIVE
            }
            const roleList = await getAllRoles(find);
            logger.info(appConstant.LOGGER_MESSAGE.ROLE_GET_COMPLETED);
            return roleList;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.ROLE_GET_FAILED);
            throw new error(error.message)
        }
    }

    /**
    * This function is used to get all users based on tenant
    */
    async getAllUsers(tokenData: Record<string, any>, req: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_USERS);
            const { page, limit } = req.query;
            let filter: any = {
                _cls: appConstant.SCHEMA._CLS_USER,
                tenant_id: tokenData.tenant_id,
                status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED, appConstant.USER_STATUS.STATUS_PENDING] }
            }
            let count: number = await userCount(filter);
            const apiFilters = new ApiFilters(findAll(filter), req.query)
                .filter()
                .sort()
                .pagination()
                .searchByQuery();
            var userList = await apiFilters.query;
            if (req.query.search) {
                count = userList.length
            }
            if (req.query.search && !_.isNil(limit) && !_.isNil(page)) {
                const startIndex = (page - 1) * limit;
                const endIndex: number = Number(startIndex) + Number(limit);
                userList = userList.slice(startIndex, Math.min(endIndex, userList.length));
            }
            const roleMapped = await projectService.checkUsersRoleMap(req, userList).catch((error: any) => { throw new Error(error) });
            if(roleMapped?.error){
                throw new Error(roleMapped.error); 
            }
            const tenant: any = await findByTenantId(tokenData.tenant_id);
            const modifiedUserList = await Promise.all(
                userList.map(async (user: { _id: any; first_name: any; last_name: any; email: any; user_img: any; created_at: any; last_login_at: any; status: any; user_type: any; }, index: string | number) => {
                    const { _id, first_name, last_name, email, user_img, created_at, last_login_at, status, user_type } = user;
                    const modifiedUser: any = {
                        _id,
                        user_name: `${first_name ?? ''} ${last_name ?? ''}`,
                        email,
                        user_img,
                        created_at,
                        last_login_at,
                        status,
                        user_type,
                        role_unmapped: roleMapped[index]
                    };
                    if (created_at) {
                        modifiedUser.created_at = await dateconvertor.dateConvertor(created_at, tenant, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                    }
                    if (last_login_at) {
                        modifiedUser.last_login_at = await dateconvertor.dateConvertor(last_login_at, tenant, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                    }
                    return modifiedUser;
                })
            );
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_USERS_COMPLETED);
            return { total_users: count, user_list: modifiedUserList }; 
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_USERS_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used for list users based on the projects wise
     */
    async getAllProjectUsers(req: Record<string, any>, tokenData: Record<string, any>) {
        try {
            let { limit, page, sort, search, orderBy } = req.query;
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_PROJECT_USERS);
            let usersRole = await projectService.getProjectUsers(req).catch((error) => { throw new Error(error.message) });
            if(usersRole?.error){
                throw new Error(usersRole.error); 
            }
            let total_users = usersRole.length;
            if (usersRole) {
                if (_.isNil(search) && _.isNil(sort) && !_.isNil(limit) && !_.isNil(page)) {
                    const startIndex: number = (page - 1) * limit;
                    const endIndex: number = Number(startIndex) + Number(limit);
                    usersRole = usersRole.slice(startIndex, endIndex);
                }
                const roleIds = await Promise.all([...new Set(usersRole.map(({ role_id }: { role_id: string }) => role_id))]);
                const userIds = await Promise.all([...new Set(usersRole.map(({ user_id }: { user_id: string }) => user_id))]);
                const filter: any = {
                    _cls: appConstant.SCHEMA._CLS_USER,
                    _id: { $in: userIds },
                    status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED] }
                }
                const users = await findAll(filter);
                const roles = await getAllRoles({ _id: roleIds });
                const tenant: any = await findByTenantId(tokenData.tenant_id);
                const mergeUserRole = await Promise.all(
                    usersRole.map(async ({ user_id, role_id }: { user_id: string, role_id: string }) => {
                        const user = await users.find((user: any) => { return user._id == user_id });
                        const role = await roles.find((role: any) => { return role._id == role_id });
                        if (_.isNil(user) || _.isNil(role)) {
                            return null;
                        }
                        const { _id, last_name, first_name, email, user_img, user_type, created_at, last_login_at, status } = user;
                        const modifiedUser = {
                            _id,
                            user_name: _.isNil(last_name) ? first_name : `${first_name} ${last_name}`,
                            email: email,
                            user_img: user_img,
                            role_name: role?.role_name.replace('_', " "),
                            role_id: role?._id,
                            user_type: user_type,
                            created_at: created_at,
                            last_login_at: last_login_at,
                            status: status
                        };
                        if (user?.created_at) {
                            modifiedUser.created_at = await dateconvertor.dateConvertor(user?.created_at, tenant, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                        }
                        if (user?.last_login_at) {
                            modifiedUser.last_login_at = await dateconvertor.dateConvertor(user?.last_login_at, tenant, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                        }
                        // Check if the search query matches the firstname, lastname, or role
                        const isMatchingFirstname = search && modifiedUser?.user_name?.toLowerCase().includes(search.toLowerCase());
                        const isMatchingLastname = search && modifiedUser?.email?.toLowerCase().includes(search.toLowerCase());
                        const isMatchingRole = search && modifiedUser?.role_name?.toLowerCase().includes(search.toLowerCase());
                        const isMatchingStatus = search && modifiedUser?.status?.toLowerCase().includes(search.toLowerCase());
                        // Filter the user based on the search query
                        if (search && !isMatchingFirstname && !isMatchingLastname && !isMatchingRole && !isMatchingStatus) {
                            return null; // Return null if the user does not match the search query
                        }
                        return modifiedUser;
                    })
                );
                // Remove null values from the result
                const filteredUserList = mergeUserRole.filter(Boolean);
                sort = orderBy && orderBy == appConstant.ORDER_BY.DESCENDING ? `-${sort}` : sort;
                let sortedList = await this.sortFilteredUserList(filteredUserList, sort).catch((error: any) => { throw new Error(error) });;
                total_users = search ? filteredUserList.length : total_users;
                if ((search || sort) && !_.isNil(limit) && !_.isNil(page)) {
                    const startIndex = (page - 1) * limit;
                    const endIndex = Number(startIndex) + Number(limit);
                    sortedList = sortedList.slice(startIndex, endIndex);
                }
                logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_PROJECT_USERS_COMPLETED);
                return { total_users, user_list: sortedList };
            } else {
                logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_PROJECT_USERS_COMPLETED);
                return { total_users: usersRole.length, user_list: [] }
            }
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_PROJECT_USERS_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * Sort Filtered User List Function 
     */
    async sortFilteredUserList(filteredUserList: any[], sort: string) {
        const sortMap: Record<string, (a: any, b: any) => number> = {
            "-created_at": (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            "created_at": (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            "user_name": (a, b) => a.user_name.localeCompare(b.user_name, undefined, { sensitivity: "case" }),
            "-user_name": (a, b) => b.user_name.localeCompare(a.user_name, undefined, { sensitivity: "case" }),
            "-last_login_at": (a, b) => new Date(b.last_login_at).getTime() - new Date(a.last_login_at).getTime(),
            "last_login_at": (a, b) => new Date(a.last_login_at).getTime() - new Date(b.last_login_at).getTime(),
            "role_name": (a, b) => a.role_name.localeCompare(b.role_name, undefined, { sensitivity: "case" }),
            "-role_name": (a, b) => b.role_name.localeCompare(a.role_name, undefined, { sensitivity: "case" })
        };

        return !_.isNil(sort) && sortMap.hasOwnProperty(sort)
            ? filteredUserList.sort(sortMap[sort])
            : filteredUserList;
    }

    /**
     * Logout - Token remove from db
     */
    async logout(tokenData: Record<string, any>): Promise<string> {
        try {
            await removeAuthToken({ email: tokenData.email });
            return appConstant.MESSAGES.LOGOUT
        } catch (error: any) {
            throw new Error(appConstant.ERROR_MESSAGES.LOGOUT_FAILED);
        }
    }

    /**
     * Password expiration check
     */
    async pwdExpirationCheck(_id: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_STARTED)
            const user = await findByUserId(appConstant.SCHEMA._CLS_USER, _id);
            if (user.status == appConstant.USER_STATUS.STATUS_DELETED) {
                logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.ERROR_MESSAGES.USER_DELETED);
                throw new Error(appConstant.ERROR_MESSAGES.USER_DELETED);
            }
            if (user.login_type === appConstant.SCHEMA.BASIC_USER && user.pwd_expiration_time >= new Date() && user.forget_pwd === appConstant.SCHEMA.ISACTIVE) {
                logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_COMPLETED);
                const userRes: any = _.pick(user, ['_id', 'domain_name', 'first_name', 'last_name', 'email', 'last_active', 'last_pwd_changed_at', 'status', 'created_by_user_id', 'user_img', 'org_name', 'login_type']);
                return {
                    message: appConstant.MESSAGES.PWD_NOT_EXPIRED,
                    data: userRes
                }
            } else if (user.login_type === appConstant.SCHEMA.SSO_USER) {
                const userRes: any = _.pick(user, ['_id', 'domain_name', 'first_name', 'last_name', 'email', 'last_active', 'last_pwd_changed_at', 'status', 'created_by_user_id', 'user_img', 'org_name', 'login_type']);
                return {
                    message: appConstant.MESSAGES.PWD_NOT_EXPIRED,
                    data: userRes
                }
            }
            else {
                logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_COMPLETED);
                throw new Error(appConstant.MESSAGES.PWD_EXPIRED);
            }
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PWD_EXPIERATION_FAILED);
            throw new Error(error.message);
        }
    }
    /**
     * Logout - Token remove from db
     */
    async getCloudUsers(userIds: any): Promise<Record<string, any>> {
        try {
            let filter: any = {
                _cls: appConstant.SCHEMA._CLS_USER,
                _id: { $in: userIds },
                // status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED, appConstant.USER_STATUS.STATUS_PENDING] }
            }
            const userList = await findAll(filter);
            return userList;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.CLOUD_USER_LIST + error.message);
            throw new Error(appConstant.ERROR_MESSAGES.LOGOUT_FAILED);
        }
    }

    async manageUserList(req: any, tokenData: Record<string, any>) {
        try {
            let projectUsers: any = await projectService.getProjectUsers(req).catch((error) => { throw new Error(error.message) });
            if(projectUsers?.error){
                throw new Error(projectUsers.error); 
            }
            let mappedUsers;
            if (projectUsers && projectUsers.length > 0) {
                mappedUsers = projectUsers.map(({ user_id }: { user_id: string }) => { return user_id });
            }
            let filter: any = {
                _cls: appConstant.SCHEMA._CLS_USER,
                _id: { $nin: mappedUsers },
                user_type: appConstant.SCHEMA.NORMAL_USER,
                tenant_id: tokenData.tenant_id,
                tenant_group_id: tokenData.tenant_group_id,
                status: { $in: [appConstant.USER_STATUS.STATUS_CONFIRMED] }
            }
            const manageUserList = await findAll(filter);
            const userList = await Promise.all(manageUserList.map((user: any) => {
                const { _id, last_name, first_name, email, user_img, user_type, status } = user;
                const modifyUser = {
                    _id,
                    user_name: _.isNil(last_name) ? first_name : `${first_name} ${last_name}`,
                    email: email,
                    user_img: user_img,
                    user_type: user_type,
                    status: status
                }
                return modifyUser
            }));
            return userList;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.MANAGE_USERS_FAILED + error.message);
            throw new Error(error.message);
        }
    }
}
