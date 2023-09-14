import { Request, Response } from 'express';
import Validation from '../validators/Validation';
const _ = require('lodash');
const logger = require('../helpers/logger');
import ProjectService from '../services/projectservice';
import AppConstants from '../utils/constant';
import AuthGuard from "../middleware/authguard";
import formidable from "formidable";
import OtherService from "../services/otherservices";
import { findAll } from '../models/cloudonboard';
const IORedis = require('ioredis');
import DateConvertor from '../helpers/date';

const authGuard = new AuthGuard();
const projectService = new ProjectService();
const validation = new Validation();
const appConstant = new AppConstants();
const otherService = new OtherService();
const dateConvert = new DateConvertor();

const redisClient = new IORedis({
    host: process.env.REDIS_SERVER_IP,
    port: process.env.REDIS_SERVER_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SERVER_DEFAULT_DB,
})
export default class ProjectController {

    /**
     * The below function is used for creating new project
     */
    async projectCreate(req: Request, res: Response): Promise<void> {
        try {
            const data = JSON.parse(JSON.stringify(req.body));
            const tokenData = await authGuard.getDataByToken(req);
            const { error, value } = await validation.project.validateAsync(data);
            if (error) {
                logger.error(`${appConstant.LOG_MESSAGES.VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
            }
            logger.info(appConstant.LOG_MESSAGES.VALIDATION_SUCCESSFUL);
            const projectRes = await projectService.createProject(data, tokenData);
            logger.info(appConstant.LOG_MESSAGES.PROJECT_CREATE);
            res.status(201).json({
                message: appConstant.MESSAGES.PROJECT_CREATED,
                data: projectRes
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.PROJECT_CREATE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /** 
     * The below function is used for list all project from DB
     */
    async getAllProject(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            if (req.query.userproject) {
                const user_id = req.query._id;
                let user: Record<string, any>;
                if (!_.isNil(user_id)) {
                    user = await otherService.getUser(req);
                    if(user?.error){
                        throw new Error(user.error); 
                    }
                }
                const allProject = await projectService.getAllProject(tokenData);
                const project = await projectService.getProjectByUserId(user_id ? user_id : tokenData._id);
                const projectRes = allProject.map((data) => {
                    const matchedProject = project.find((projectdata: { project_id: any; }) => projectdata.project_id.toString() === data._id.toString());
                    data = _.pick(data, ['_id', 'project_name', 'description'])
                    if (!_.isNil(matchedProject)) {
                        matchedProject._id = matchedProject.project_id;
                    }
                    return matchedProject !== undefined ? matchedProject : data
                });
                const allRoles:any = await otherService.getAllRole(req);
                if(allRoles?.error){
                    throw new Error(allRoles.error); 
                }
                await Promise.all(allRoles.map((role:any) => {
                    projectRes.map((project) => {
                        if (!_.isNil(project.users_mapping) && role._id === project.users_mapping.role_id.toString()) {
                            role = _.pick(role, ['_id', 'role_name', 'access_level']);
                            project.roledtl = role;
                            delete project.users_mapping;
                        }
                    })
                })).then(() => {
                    const responseObj = {
                        _id: user?.data?._id ?? tokenData._id,
                        first_name: user?.data?.first_name ?? tokenData.first_name,
                        last_name: user?.data?.last_name ?? tokenData.last_name,
                        email: user?.data?.email ?? tokenData.email,
                        tenant_id: user?.data?.tenant_id ?? tokenData.tenant_id,
                        tenant_group_id: user?.data?.tenant_group_id ?? tokenData.tenant_group_id,
                        user_type: user?.data?.user_type ?? tokenData.user_type,
                        projectDtl: projectRes
                    };
                    logger.info(appConstant.LOG_MESSAGES.GET_ALL_PROJECT);
                    const projectDetail: any = [];
                    if (responseObj.user_type == appConstant.SCHEMA.NORMAL_USER && req.query.mappedproject) {
                        responseObj.projectDtl.map((ele, index) => {
                            if (ele.roledtl != undefined) {
                                projectDetail.push(ele)
                            }
                            if (responseObj.projectDtl.length - 1 == index) {
                                responseObj.projectDtl = projectDetail;
                                res.status(200).send(responseObj);
                            }
                        })
                    } else if (req.query.project_id) {
                        responseObj.projectDtl.map((ele, index) => {
                            if (ele._id.toString() === req.query.project_id?.toString()) {
                                projectDetail.push(ele)
                            }
                            if (responseObj.projectDtl.length - 1 == index) {
                                responseObj.projectDtl = projectDetail;
                                res.status(200).send(responseObj);
                            }
                        })
                    } else {
                        res.status(200).send(responseObj);
                    }
                })
            } else {
                const projectRes = await projectService.getAllProject(tokenData);
                logger.info(appConstant.LOG_MESSAGES.GET_ALL_PROJECT);
                res.status(200).send(projectRes);
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_ALL_PROJECT_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for get project by _id 
     */
    async getProjectInfo(req: Request, res: Response) {
        try {
            const queryParams = JSON.parse(JSON.stringify(req.query));
            const tokenData = await authGuard.getDataByToken(req);
            const projectRes = await projectService.getProjectInfo(queryParams, tokenData);
            logger.info(appConstant.LOG_MESSAGES.GET_PROJECT_INFO);
            res.status(200).send(projectRes);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_PROJECT_INFO_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for update project by _id
     */
    async projectUpdate(req: Request, res: Response): Promise<void> {
        try {
            const body = JSON.parse(JSON.stringify(req.body));
            const params = JSON.parse(JSON.stringify(req.params));
            const tokenData = await authGuard.getDataByToken(req);
            const { error, value } = await validation.project.validateAsync(body);
            if (error) {
                logger.error(`${appConstant.LOG_MESSAGES.VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
                return;
            }
            logger.info(appConstant.LOG_MESSAGES.VALIDATION_SUCCESSFUL);
            const projectRes = await projectService.updateProject(params, body, tokenData);
            logger.info(appConstant.LOG_MESSAGES.PROJECT_UPDATE);
            res.status(200).json({
                message: appConstant.MESSAGES.PROJECT_UPDATED,
                data: projectRes
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.PROJECT_UPDATE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for delete project by _id
     */
    async projectDelete(req: Request, res: Response): Promise<void> {
        try {
            const params = JSON.parse(JSON.stringify(req.params));
            const tokenData = await authGuard.getDataByToken(req);
            const projectRes = await projectService.deleteProject(params, tokenData);
            logger.info(appConstant.LOG_MESSAGES.PROJECT_DELETE);
            res.status(200).send(projectRes);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.PROJECT_DELETE_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for create a application 
     */
    async applicationCreate(req: Request, res: Response): Promise<void> {
        const tokenData = await authGuard.getDataByToken(req);
        const formData = formidable({ multiples: true });
        formData.parse(req, async function (err: any, fields: any, imgFile: any) {
            if (err) {
                logger.error(`${appConstant.LOG_MESSAGES.JSON_PARSE_ERROR} ${err}`);
                res.status(400).send(err);
            }
            try {
                const appData = JSON.parse(fields.appData);
                const { error, value } = await validation.application.validateAsync(appData, { stripUnknown: true });
                if (error) {
                    logger.error(`${appConstant.LOG_MESSAGES.APP_VALIDATION_FAILED} ${error.details[0].message}`);
                    res.status(400).send(error.details[0].message);
                }
                const applicationRes = await projectService.applicationCreate(appData, imgFile, tokenData);
                logger.info(appConstant.LOG_MESSAGES.APP_CREATED);
                res.status(201).json({
                    message: appConstant.MESSAGES.APP_CREATED,
                    data: applicationRes
                });
            } catch (err: any) {
                logger.error(`${appConstant.LOG_MESSAGES.APP_CREATED_FAILED} ${err.message}`);
                res.status(400).send(err.message);
            }
        });
    }

    /**
     * The below function is used for update a application 
     */
    async applicationUpdate(req: Request, res: Response): Promise<void> {
        const _id = JSON.parse(JSON.stringify(req.params));
        const params = JSON.parse(JSON.stringify(req.params));
        const tokenData = await authGuard.getDataByToken(req);
        const query = JSON.parse(JSON.stringify(req.query));
        const formData = formidable({ multiples: true });
        formData.parse(req, async function (err: any, fields: any, imgFile: any) {
            if (err) {
                logger.error(`${appConstant.LOG_MESSAGES.JSON_PARSE_ERROR} ${err}`);
                res.status(400).send(err);
            }
            try {
                const appData = JSON.parse(fields.appData);
                const { error, value } = await validation.application.validateAsync(appData);
                if (error) {
                    logger.error(`${appConstant.LOG_MESSAGES.APP_VALIDATION_FAILED} ${error.details[0].message}`);
                    res.status(400).send(error.details[0].message);
                }
                const applicationRes = await projectService.applicationUpdate(_id, appData, imgFile, tokenData, query);
                logger.info(appConstant.LOG_MESSAGES.APP_UPDATED);
                res.status(201).json({
                    message: appConstant.MESSAGES.APP_UPDATED,
                    data: applicationRes
                });
            } catch (err: any) {
                logger.error(`${appConstant.LOG_MESSAGES.APP_UPDATED_FAILED} ${err.message}`);
                res.status(400).send(err.message);
            }
        });
    }

    /**
    * The below function is used for delete application by _id
    */
    async applicationDelete(req: Request, res: Response): Promise<void> {
        try {
            const params = JSON.parse(JSON.stringify(req.params));
            const tokenData = await authGuard.getDataByToken(req);
            const projectRes = await projectService.applicationDelete(params, tokenData);
            logger.info(appConstant.LOG_MESSAGES.APP_DELETE);
            res.status(200).send(projectRes);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.DELETE_APP_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /** 
    * The below function is used for list all application from projects
    */
    async getAllApplication(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const params = req.params;
            if (req.query.userapplication) {
                const application: any = await projectService.getAppByUserId(tokenData._id, params._id);
                if (tokenData.user_type === appConstant.SCHEMA.NORMAL_USER && req.query.workloadadmin) {
                    const allMappedWorkload = await otherService.getAllMappedWorkload(req, tokenData, params);
                    const allWorkload = await otherService.getAllWorkload(req, tokenData, params);
                    if(allMappedWorkload?.error){
                        throw new Error(allMappedWorkload.error); 
                    }
                    if(allWorkload?.error){
                        throw new Error(allWorkload.error); 
                    }
                    const activeWorkload = allWorkload.filter((item: any) => {
                        return allMappedWorkload.some((data: any) => {
                            return data.workload_id === item._id && item.status === appConstant.SCHEMA.STATUS_ACTIVE;
                        });
                    });
                      
                    let finalResponse: any[] = [];
                    let app_data: any[] = [];
                    await application.map((ele: any) => {
                        ele.application.forEach((item: Record<string, string>) => {
                            if (item.status === appConstant.SCHEMA.STATUS_ACTIVE) {
                                item.project_id = params._id;
                                const matchingWorkloads = activeWorkload.filter((workload: any) => item._id === workload.app_id);
                                item.count = matchingWorkloads ? matchingWorkloads.length : 0
                                app_data.push(item);
                            }
                        }); finalResponse = finalResponse.concat(app_data)
                    });
                    res.status(200).send(finalResponse);
                    return;
                }
                const allApplication = await projectService.getAllApplication(tokenData, { _id: params._id });
                let projectRes = allApplication.map((data: any) => {
                    const matchedApplication = application.find((applicationdata: { application: any; _id: any; }) => applicationdata.application._id === data._id);
                    data = _.pick(data, ['_id', 'app_name', 'description', 'app_img', 'project_id']);
                    return matchedApplication !== undefined ? matchedApplication : data;
                });
                const projectResponse: any[] = [];
                // if (projectRes.length <= 0) {
                //     projectRes = { 
                //         message: appConstant.MESSAGES.APPLICATION_NOT_FOUND,
                //         data: []
                //     }
                // }
                // if (tokenData.user_type === appConstant.SCHEMA.NORMAL_USER && req.query.workloadadmin) {
                //     const allWorkload = await otherService.getAllMappedWorkload(req, tokenData, params);
                //     const finalResponse: any[] = [];
                //     projectRes.map((applicationdata: any, index: number) => {
                //         if (applicationdata.application && applicationdata.project_user_map_id) {
                //             if (applicationdata.project_user_map_id) {
                //                 const matchingWorkloads = allWorkload.filter((workload: any) => applicationdata.application._id === workload.application_id);
                //                 finalResponse.push({
                //                     _id: applicationdata.application._id,
                //                     project_id: applicationdata.project_id,
                //                     app_name: applicationdata.application.app_name,
                //                     description: applicationdata.application.description,
                //                     app_img: applicationdata.application.app_img,
                //                     count: matchingWorkloads ? matchingWorkloads.length : 0
                //                 });
                //             } else {
                //                 const matchingWorkloads = allWorkload.filter((workload: any) => applicationdata._id === workload.application_id);
                //                 finalResponse.push({
                //                     _id: applicationdata._id,
                //                     project_id: applicationdata.project_id,
                //                     app_name: applicationdata.app_name,
                //                     description: applicationdata.description,
                //                     app_img: applicationdata.app_img,
                //                     count: matchingWorkloads ? matchingWorkloads.length : 0
                //                 });
                //             }
                //         }
                //         if (projectRes.length - 1 == index) {
                //             logger.info(appConstant.LOG_MESSAGES.GET_ALL_APP);
                //             projectRes = finalResponse;
                //             res.status(200).send(finalResponse);
                //         }
                //     })
                // } else 
                if (tokenData.user_type === appConstant.SCHEMA.NORMAL_USER) {
                    const allWorkload = await otherService.getAllMappedWorkload(req, tokenData, params);
                    if(allWorkload?.error){
                        throw new Error(allWorkload.error); 
                    }
                    const finalResponse: any[] = [];
                    projectRes.map((applicationData: any) => {
                        if (applicationData.project_user_map_id) {
                            const matchingWorkloads = allWorkload.filter((workload: any) => applicationData.application._id === workload.application_id);
                            finalResponse.push({
                                _id: applicationData.application._id,
                                project_id: applicationData.project_id,
                                app_name: applicationData.application.app_name,
                                description: applicationData.application.description,
                                app_img: applicationData.application.app_img,
                                count: matchingWorkloads ? matchingWorkloads.length : 0
                            });
                        } else {
                            const matchingWorkloads = allWorkload.filter((workload: any) => applicationData._id === workload.application_id);
                            finalResponse.push({
                                _id: applicationData._id,
                                project_id: applicationData.project_id,
                                app_name: applicationData.app_name,
                                description: applicationData.description,
                                app_img: applicationData.app_img,
                                count: matchingWorkloads ? matchingWorkloads.length : 0
                            });
                        }
                    })
                    logger.info(appConstant.LOG_MESSAGES.GET_ALL_APP);
                    res.status(200).send(finalResponse);
                } else {
                    const allWorkload = await otherService.getAllWorkload(req, tokenData, params);
                    if(allWorkload?.error){
                        throw new Error(allWorkload.error); 
                    }
                    const finalResponse: any[] = [];
                    projectRes.forEach((applicationData: any) => {
                        if (applicationData.project_user_map_id) {
                            const matchingWorkloads = allWorkload.filter((workload: any) => applicationData.application._id === workload.app_id);
                            finalResponse.push({
                                _id: applicationData.application._id,
                                project_id: applicationData.project_id,
                                app_name: applicationData.application.app_name,
                                description: applicationData.application.description,
                                app_img: applicationData.application.app_img,
                                count: matchingWorkloads ? matchingWorkloads.length : 0
                            });
                        } else {
                            const matchingWorkloads = allWorkload.filter((workload: any) => applicationData._id === workload.app_id);
                            finalResponse.push({
                                _id: applicationData._id,
                                project_id: applicationData.project_id,
                                app_name: applicationData.app_name,
                                description: applicationData.description,
                                app_img: applicationData.app_img,
                                count: matchingWorkloads ? matchingWorkloads.length : 0
                            });
                        }
                    });
                    logger.info(appConstant.LOG_MESSAGES.GET_ALL_APP);
                    res.status(200).send(finalResponse);
                }
            } else {
                let applicationRes = await projectService.getAllApplication(tokenData, params);
                const allWorkload = await otherService.getAllWorkload(req, tokenData, params);
                if(allWorkload?.error){
                    throw new Error(allWorkload.error); 
                }
                const finalResponse: any[] = [];
                applicationRes.forEach((application: any) => {
                    const matchingWorkloads = allWorkload.filter((workload: any) => application._id === workload.app_id);
                    finalResponse.push({
                        _id: application._id,
                        project_id: application.project_id,
                        app_name: application.app_name,
                        description: application.description,
                        app_img: application.app_img,
                        count: matchingWorkloads ? matchingWorkloads.length : 0
                    });
                });

                logger.info(appConstant.LOG_MESSAGES.GET_ALL_APP);
                res.status(200).send(finalResponse);
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_ALL_APP_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for get application by _id 
     */
    async getApplicationInfo(req: Request, res: Response) {
        try {
            const params = JSON.parse(JSON.stringify(req.params));
            const tokenData = await authGuard.getDataByToken(req);
            const applicationRes = await projectService.getApplicationInfo(params, tokenData, req);
            logger.info(appConstant.LOG_MESSAGES.GET_APP_INFO);
            res.send(applicationRes);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_APP_INFO_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for update  User role mapping
     */
    async projectUserRoleMapUpdate(req: Request, res: Response): Promise<void> {
        try {
            logger.info(appConstant.LOG_MESSAGES.USER_MAP_START);
            const tokenData = await authGuard.getDataByToken(req);
            const body = JSON.parse(JSON.stringify(req.body));
            const query = JSON.parse(JSON.stringify(req.query));
            await projectService.projectUserMapUpdate(body, tokenData, query, req).then(async (responseData) => {
                logger.info(appConstant.LOG_MESSAGES.USER_MAP);
                await res.status(200).send(appConstant.MESSAGES.USER_ROLE_MAP);
            })
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_MAP_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for get project user's
     */
    async getProjectUser(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_PROJECT_USER);
            const params = JSON.parse(JSON.stringify(req.params));
            const projectUsers = await projectService.getProjectUser(params);
            logger.info(appConstant.LOG_MESSAGES.GET_PROJECT_USER_SUCCESS);
            res.status(200).send(projectUsers);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_PROJECT_USER_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used for check user is role mapped or role unmapped
     */
    async checkUserRoleMap(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CHECK_USER_ROLE_MAP);
            const data = JSON.parse(JSON.stringify(req.body));
            const projectUsers = await projectService.checkUserRoleMap(data);
            logger.info(appConstant.LOG_MESSAGES.CHECK_USER_ROLE_MAP_SUCCESS);
            res.status(200).send(projectUsers);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CHECK_USER_ROLE_MAP_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }
    /**
     * This below function is used to get regions
     */
    async getRegions(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CONTROLLER + appConstant.LOG_MESSAGES.GET_REGION);
            const tokenData = await authGuard.getDataByToken(req);
            await projectService.getRegions(req, tokenData).then((regions) => {
                logger.info(appConstant.LOG_MESSAGES.GET_REGION_SUCCESS);
                res.status(200).send(regions);
            }).catch((error: any) => {
                logger.error(`${appConstant.LOG_MESSAGES.GET_REGIONS_FAILED} ${error.message}`);
                res.status(400).send(error.message)
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_REGIONS_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * Generate auth token For mist api call
     */
    async generateAuthTokenMist(req: Request, res: Response) {
        try {
            const requestDatas = req.body;
            logger.info(appConstant.LOG_MESSAGES.MIST_TOKEN_GENERATION);
            const tokenData = await authGuard.getDataByToken(req);
            const currentDate = new Date();
            const request = {
                email: "admin@example.com",
                name: tokenData.first_name + " " + currentDate,
                org: requestDatas.project_name,
                password: "",
                // ttl: appConstant.SCHEMA.EIGHT_HRS_IN_SEC,
                ttl: 0
            }
            const finalResponse = await projectService.generateAuthTokenMistApi(request, req, tokenData, requestDatas.project_id);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_GET_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * validating cloud credentials 
     */
    async verifyCloudCredntial(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const requestDatas = req.body;
            logger.info(appConstant.LOG_MESSAGES.MIST_CONNECTION_VALIDATE);
            redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, async (getError: any, currentData: any) => {
                if (getError) {
                    console.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                    throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                } else {
                    // Parse the current data from Redis into an array or initialize an empty array
                    const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
                    // Parse the current data from Redis into an array or initialize an empty array
                    const foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                        if (ele.user_id === tokenData._id && ele.project_id === requestDatas.project_id) {
                            if (ele.created_at) {
                                const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                                const diffMinutes = diffDuration.minutes();
                                const diffHours = diffDuration.hours();
                                const diffDays = diffDuration.days();
                                if (diffHours <= 7 && diffDays === 0) {
                                    return ele;
                                }
                            }
                        }
                    });
                    if (_.isNil(foundUserToken)) {
                        const currentDate = new Date();
                        const request = {
                            email: "admin@example.com",
                            name: tokenData.first_name + " " + currentDate,
                            org: requestDatas.project_name,
                            password: "",
                            ttl: 0
                        }
                        // throw new Error(appConstant.MESSAGES.MIST_AUTH_TOKEN_NOT_FOUND_USER)
                        const generateAuthToken = await projectService.checkMistTokenAvail(request, req, tokenData, req.body.project_id);
                        const foundUserToken: any = {};
                        foundUserToken.mistToken = generateAuthToken.token;
                        let requestbody: any;
                        if (requestDatas.provider == appConstant.CLOUD.AZURE) {
                            requestbody = {
                                provider: requestDatas.provider,
                                tenant_id: requestDatas.tenant_id,
                                key: requestDatas.key,
                                secret: requestDatas.secret
                            }
                        } if (requestDatas.provider == appConstant.CLOUD.AWS) {
                            requestbody = {
                                provider: requestDatas.provider,
                                apikey: requestDatas.apikey,
                                apisecret: requestDatas.apisecret
                            }
                        }

                        // service call for validate the mist token
                        await projectService.verifyCloudCredntial(requestbody, foundUserToken, tokenData).then((finalResponse) => {
                            res.status(200).send(finalResponse);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.CLOUD_CRED_FAILED)
                        })
                    } else {
                        let requestbody: any;
                        if (requestDatas.provider == appConstant.CLOUD.AZURE) {
                            requestbody = {
                                provider: requestDatas.provider,
                                tenant_id: requestDatas.tenant_id,
                                key: requestDatas.key,
                                secret: requestDatas.secret
                            }
                        } if (requestDatas.provider == appConstant.CLOUD.AWS) {
                            requestbody = {
                                provider: requestDatas.provider,
                                apikey: requestDatas.apikey,
                                apisecret: requestDatas.apisecret
                            }
                        }
                        // service call for validate the mist token
                        await projectService.verifyCloudCredntial(requestbody, foundUserToken, tokenData).then((finalResponse) => {
                            res.status(200).send(finalResponse);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.CLOUD_CRED_FAILED)
                        })
                    }
                }
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.MIST_CONNECTION_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * This function is used to count the number of cloud users
     */
    async cloudUsersCount(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CONTROLLER + appConstant.LOG_MESSAGES.CLOUD_COUNT_SERVICE);
            const tokenData = await authGuard.getDataByToken(req);
            const params = JSON.parse(JSON.stringify(req.params))
            const regions = await projectService.cloudUsersCount(params,tokenData);
            logger.info(appConstant.LOG_MESSAGES.CLOUD_USER_COUNT);
            res.status(200).send(regions);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_COUNT_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }
    /**
     * Create Cloud Account
     */
    async createCloudAccount(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_CONTROLLER_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            if (req.body._cls == appConstant.CLOUD.AWS) {
                req.body._cls = appConstant.CLOUD_PROVIDER.AWS
            } if (req.body._cls == appConstant.CLOUD.AZURE) {
                req.body._cls = appConstant.CLOUD_PROVIDER.AZURE
            }
            const finalResponse = await projectService.createCloudAccount(req.body, tokenData);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.MIST_CONNECTION_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * Edit Cloud Account
     */
    async editCloudAccount(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_CONTROLLER_EDIT_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await projectService.updateCloudAccount(req.body, tokenData);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.MIST_CONNECTION_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     *Get Subscriptions list
     */
    async getCloudSubscritions(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CLOUD_SUBSCRITPTIONS_LIST_CONTROLLER_START);
            const tokenData = await authGuard.getDataByToken(req);
            const requestDatas = req.body
            redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, async (getError: any, currentData: any) => {
                if (getError) {
                    console.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                    throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                } else {
                    // Parse the current data from Redis into an array or initialize an empty array
                    const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
                    // Parse the current data from Redis into an array or initialize an empty array
                    const foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                        if (ele.user_id === tokenData._id && ele.project_id === requestDatas.project_id) {
                            if (ele.created_at) {
                                const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                                const diffMinutes = diffDuration.minutes();
                                const diffHours = diffDuration.hours();
                                const diffDays = diffDuration.days();
                                if (diffHours <= 7 && diffDays === 0) {
                                    return ele;
                                }
                            }
                        }
                    });
                    if (_.isNil(foundUserToken)) {
                        const currentDate = new Date();
                        const request = {
                            email: "admin@example.com",
                            name: tokenData.first_name + " " + currentDate,
                            org: requestDatas.project_name,
                            password: "",
                            ttl: 0
                        }
                        // throw new Error(appConstant.MESSAGES.MIST_AUTH_TOKEN_NOT_FOUND_USER)
                        const generateAuthToken = await projectService.checkMistTokenAvail(request, req, tokenData, req.body.project_id);
                        const foundUserToken: any = {};
                        foundUserToken.mistToken = generateAuthToken.token;
                        // service call for validate the mist token
                        await projectService.getCloudSubscriptionsList(req.body, tokenData, foundUserToken).then((finalResponse) => {
                            res.status(200).send(finalResponse);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED)
                        })
                    } else {
                        await projectService.getCloudSubscriptionsList(req.body, tokenData, foundUserToken).then((finalResponse) => {
                            res.status(200).send(finalResponse);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED)
                        });
                    }
                }
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.MIST_CONNECTION_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }


    /**
     * Get Cloud details
     */
    async getCloudDetails(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_CLOUD_CONTROLLER_STARTED);
            const params = JSON.parse(JSON.stringify(req.params));
            const queryParams = JSON.parse(JSON.stringify(req.query));
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await projectService.getCloudDetails(params, tokenData, queryParams);
            logger.info(appConstant.LOG_MESSAGES.GET_CLOUD_CONTROLLER_COMPLETED);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * This function is used to get the cloud discovery
     */
    async getCloudDiscovery(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_STARTED);
            const body = JSON.parse(JSON.stringify(req.body));
            const tokenData = await authGuard.getDataByToken(req);
            const currentData: string = await new Promise((resolve, reject) => {
                redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, (getError: any, data: string) => {
                    if (getError) {
                        logger.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                        reject(new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED));
                    } else {
                        resolve(data);
                    }
                });
            });
            const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
            let foundUserToken: any;
            if (tokenDetailsArray && tokenDetailsArray.length > 0) {
                foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                    if (ele.user_id === tokenData._id && ele.project_id === body.project_id) {
                        if (ele.created_at) {
                            const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                            const diffMinutes = diffDuration.minutes();
                            const diffHours = diffDuration.hours();
                            const diffDays = diffDuration.days();
                            if (diffHours <= 7 && diffDays === 0) {
                                return ele;
                            }
                        }
                    }
                });
            }
            if (!foundUserToken) {
                const userData = {
                    email: "admin@example.com",
                    name: tokenData.first_name + " " + new Date(),
                    org: body.project_name,
                    password: "",
                    ttl: 0
                };
                const token = await new ProjectService().checkMistTokenAvail(userData, req, tokenData, body.project_id).catch((error: any) => { throw new Error(error) });
                foundUserToken = { mistToken: token.token };
            }
            const requestbody = {
                title: body.title,
                cid: body.cid,
                provider: body.provider,
                purpose: body.purpose
            };
            const params = {
                _id: body.cid
            }
            // service call for validate the mist token
            await projectService.getCloudDiscovery(requestbody, foundUserToken, tokenData, req).then((data) => {
                projectService.getCloudDetails(params, tokenData, req.query).then((finalResponse) => {
                    logger.info(appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_COMPLETED);
                    if (finalResponse === null) {
                        res.status(400).send(appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED)
                    } else {
                        const finalResponseObj = _.pick(finalResponse, ['_id', '_cls', 'apikey', 'cluster_count', 'container_enabled',
                            'created_by', 'dns_enabled', 'enabled', 'machine_count', 'object_storage_enabled', 'observation_logs_enabled', 'owned_by', 'owner', 'key',
                            , 'subscription_type', 'polling_interval', 'region', 'starred', 'title', 'unstarred', 'account_type', 'access_type', 'environment', 'authentication_protocol',
                            'bucket_name', 'cost_report_format_fields', 'discovery_status', 'discovery_progress_percentage', 'discovery_date', 'opted_regions', 'created_at']);
                        res.status(200).send(finalResponseObj);
                    }
                }).catch((error) => {
                    logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED}`);
                    res.status(400).send(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED}`);
                })
            }).catch((error) => {
                logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED}`);
                res.status(400).send(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED}`);
            })
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED}`);
            res.status(400).send(`${appConstant.LOG_MESSAGES.GET_CLOUD_DISCOVERY_FAILED} ${error.message}`);
        }
    }

    /**
     * This function is used to list cloud users
     */
    async cloudUserList(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CONTROLLER + appConstant.LOG_MESSAGES.CLOUD_USER_LIST);
            const tokenData = await authGuard.getDataByToken(req);
            const queryParams = JSON.parse(JSON.stringify(req.query))
            const userList = await projectService.cloudUserList(req, queryParams, tokenData);
            logger.info(appConstant.LOG_MESSAGES.CLOUD_USER_LIST_SUCCESS);
            res.status(200).send(userList);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * This function is used to get the progress percentage for Single cloud 
     */

    async getProgressCloud(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CONTROLLER + appConstant.LOG_MESSAGES.CLOUD_COUNT_SERVICE);
            const tokenData = await authGuard.getDataByToken(req);
            const requestDatas = req.body
            redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, async (getError: any, currentData: any) => {
                if (getError) {
                    console.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                    throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                } else {
                    // Parse the current data from Redis into an array or initialize an empty array
                    const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
                    // Parse the current data from Redis into an array or initialize an empty array
                    const foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                        if (ele.user_id === tokenData._id && ele.project_id === requestDatas.project_id) {
                            if (ele.created_at) {
                                const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                                const diffMinutes = diffDuration.minutes();
                                const diffHours = diffDuration.hours();
                                const diffDays = diffDuration.days();
                                if (diffHours <= 7 && diffDays === 0) {
                                    return ele;
                                }
                            }
                        }
                    });
                    if (_.isNil(foundUserToken)) {
                        const currentDate = new Date();
                        const request = {
                            email: "admin@example.com",
                            name: tokenData.first_name + " " + currentDate,
                            org: requestDatas.project_name,
                            password: "",
                            ttl: 0
                        }
                        // throw new Error(appConstant.MESSAGES.MIST_AUTH_TOKEN_NOT_FOUND_USER)
                        const generateAuthToken = await projectService.checkMistTokenAvail(request, req, tokenData, req.body.project_id);
                        const foundUserToken: any = {};
                        foundUserToken.mistToken = generateAuthToken.token;
                        // service call for validate the mist token
                        await projectService.getProgressCloud(req.body, tokenData, foundUserToken).then((finalResponse) => {
                            const finalResponseObj = _.pick(finalResponse, ['_id', '_cls', 'apikey', 'cluster_count', 'container_enabled',
                                'created_by', 'dns_enabled', 'enabled', 'machine_count', 'object_storage_enabled', 'observation_logs_enabled', 'owned_by', 'owner', 'key',
                                , 'subscription_type', 'polling_interval', 'region', 'starred', 'title', 'unstarred', 'account_type', 'access_type', 'environment', 'authentication_protocol',
                                'bucket_name', 'cost_report_format_fields', 'discovery_status', 'discovery_progress_percentage', 'discovery_date', 'opted_regions', 'created_at']);
                            res.status(200).send(finalResponseObj);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.FETCHING_PROGRESS_PERCENTAGE_MSG_FAILED)
                        })

                    } else {
                        // service call for validate the mist token
                        await projectService.getProgressCloud(req.body, tokenData, foundUserToken).then((finalResponse) => {
                            const finalResponseObj = _.pick(finalResponse, ['_id', '_cls', 'apikey', 'cluster_count', 'container_enabled',
                                'created_by', 'dns_enabled', 'enabled', 'machine_count', 'object_storage_enabled', 'observation_logs_enabled', 'owned_by', 'owner', 'key',
                                , 'subscription_type', 'polling_interval', 'region', 'starred', 'title', 'unstarred', 'account_type', 'access_type', 'environment', 'authentication_protocol',
                                'bucket_name', 'cost_report_format_fields', 'discovery_status', 'discovery_progress_percentage', 'discovery_date', 'opted_regions', 'created_at']);
                            res.status(200).send(finalResponseObj);
                        }).catch((error) => {
                            res.status(400).send(appConstant.ERROR_MESSAGES.FETCHING_PROGRESS_PERCENTAGE_MSG_FAILED)
                        })
                    }
                }
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_SINGLE_PROGRESS_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * This function is used to get all the active cloud platforms in the projects 
     */

    async getAllCloudplatforms(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_PLATFORMS_CONTROLLER_STARTED);
            const project_id = req.params.id;
            const finalResponse = await projectService.getAllCloudPlatformsByApp(project_id);
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    /**
     * This function used for get multiple application based on the array of application id
     */
    async getApplication(req: Request, res: Response) {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const body = req.body;
            const applications: any = await projectService.getApplication(body, tokenData);
            const finalResponse = await Promise.all(applications);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
            res.status(400).send(error.message);
        }
    }

    /**
     * This function is used to get the Cloud Account names 
     */

    async getAllCloudAccountnames(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_START);
            const data = req.body;
            const finalResponse = await projectService.getAllCloudAccountNames(data);
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_COMPLETED);
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }

    async autoRoleMap(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_START);
            const data = JSON.parse(JSON.stringify(req.query));
            const finalResponse = await projectService.autoRoleMap(data);
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_COMPLETED);
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
            res.status(400).send(error.message)
        }
    }
}