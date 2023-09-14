import { Request, Response } from 'express';
import WorkloadService from '../services/workloadservice';
import AppConstants from '../utils/constant';
import AuthGuard from "../middleware/authguard";
const logger = require('../helpers/logger');
import Validation from '../validators/Validation';
import formidable from 'formidable';
const IORedis = require('ioredis');

const authGuard = new AuthGuard();
const workloadService = new WorkloadService();
const appConstant = new AppConstants();
const validate = new Validation();

const redisClient = new IORedis({
    host: process.env.REDIS_SERVER_IP,
    port: process.env.REDIS_SERVER_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SERVER_DEFAULT_DB,
});
export default class WorkloadController {

    /**
     *  The below function is used for create new project
     */
    async projectUserMapCreate(req: Request, res: Response): Promise<void> {
        try {
            const data = JSON.parse(JSON.stringify(req.body));
            const tokenData = await authGuard.getDataByToken(req);
            const response = await workloadService.workloadUserMapCreate(data, tokenData);
            logger.info(appConstant.LOGGER_MESSAGE.PROJECT_USER_MAP_CREATE);
            res.status(200).send({
                message: appConstant.LOGGER_MESSAGE.WORKLOAD_CREATED,
                data: response
            });
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.PROJECT_USER_MAP_CREATE_FAILED);
            res.status(400).send(error.message);
        }
    }

    /** 
     * The below function is used for list all workloads from projects
     */
    async getAllWorkload(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const params = JSON.parse(JSON.stringify(req.params));
            // const application = await otherService.getApplicationInfo(req);
            const workloadRes = await workloadService.getWorkloadByUserId(tokenData, params._id, req);
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_COMPLETED);
            res.status(200).send(workloadRes);
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED);
            res.status(400).send(error.message);
        }
    }

    /** 
     * The below function is used for create a new workload
     */
    async workloadCreateAndUpdate(req: Request, res: Response): Promise<void> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.WORKLOAD_CREATE_UPDATE);
            const tokenData = await authGuard.getDataByToken(req);
            const workloadBody = JSON.parse(JSON.stringify(req.body));
            const { error, value }: any = await validate.workload.validateAsync({ workload_name: workloadBody.workload_name });
            if (error) {
                logger.error(`${appConstant.LOGGER_MESSAGE.VALIDATION_UNSUCCESSFUL} ${error.details[0].message}`);
                res.status(400).send(error.details[0].message);
            }
            const workloadResponse = await workloadService.workloadCreateAndUpdate(workloadBody, tokenData, req);
            res.status(workloadResponse.statusCode).send(workloadResponse.message);
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    }

    /** 
     * The below function is used to delete workload
     */
    async workloadDelete(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.WORKLOAD_DELETE);
            const tokenData = await authGuard.getDataByToken(req);
            const params = JSON.parse(JSON.stringify(req.params));
            const response = await workloadService.workloadDelete(params, tokenData);
            res.status(200).send(response);
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    }
    /**
     * The below function is used for get the particular workload
     */

    async getWorkload(req: Request, res: Response): Promise<void> {
        try {
            const tokenData = await authGuard.getDataByToken(req);
            const params = JSON.parse(JSON.stringify(req.params));
            const query = JSON.parse(JSON.stringify(req.query));
            const currentDate = new Date();
            const request = {
                email: "admin@example.com",
                name: tokenData.first_name + " " + currentDate,
                password: "",
                ttl: 0
            }
            const workload = await workloadService.getWorkload(params, tokenData, query, req, request);
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_COMPLETED);
            res.status(200).send(workload);
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_WORKLOAD_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * The below function is used to list all workloads in infinity scroll
     */
    async getAllWorkloadInfinityScroll(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GETALL_WORKLOAD_CONTROLLER_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const applicationId = req.query.application_id;
            const limit = req.query.limit;
            const count = req.query.count;
            const workloadListRes = await workloadService.getAllWorkloadList(tokenData, applicationId, req, limit, count);
            res.status(200).send(workloadListRes);
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to get the list of all active cloud service providers
     */
    async getAllCloudPlatform(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GETALL_CLOUD_PLATFORM_CONTROLLER_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const project_id = req.query.project_id;
            const finalResponse = await workloadService.getAllCloudPlatformsByApp(tokenData, project_id, req);
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GETALL_CLOUD_PLATFORM_SERVICE_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * This function is used to cretae the workload resorce grouping 
     */

    async workloadResourceGrpMaster(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_START);
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await workloadService.createWorkloadResourceGrpMaster(tokenData, req.body);
            logger.info(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_SERVICE_COMPLETED)
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_FAILED);
            res.status(400).send(error.message);
        }
    }

    async getCloudCategory(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_CONTROLLER_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const cloud_platform = req.query.cloud_platform;
            const finalResponse = await workloadService.getCategoryBasedOnCloud(tokenData, cloud_platform);
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_CONTROLLER_COMPLETED)
            res.status(200).send(finalResponse)
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * This function is used to get the list of all cloud resource group based on cloud category
     */
    async getAllCloudResourceGrp(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_CONTROLLER_START);
            const tokenData = await authGuard.getDataByToken(req);
            const cloud_catrgory_id = req.query.cloud_category_id;
            const finalResponse = await workloadService.getAllCloudResourceGrps(tokenData, cloud_catrgory_id);
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_CONTROLLER_COMPLETED)
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * This function is used to get the list of resources based on the resource group
     */
    async getAllResources(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCES_CONTROLLER_START);
            const tokenData = await authGuard.getDataByToken(req);
            const cloud_resource_grp = req.query.resource_grp_id;
            const request_type = req.query.type;
            const workload_id = req.query.workload_id;
            const project_id = req.query.project_id;
            const cloud_account = req.query.cloud_account;
            const finalResponse = await workloadService.getAllResoucesList(tokenData, cloud_resource_grp, request_type, workload_id, project_id, cloud_account);
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCES_CONTROLLER_COMPLETED);
            res.status(200).send({ finalResponse, cloud_account, cloud_resource_grp });
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_FAILED);
            res.status(400).send(error.message);
        }
    }


    async getResourceInfo(req: Request, res: Response) {
        try {
            const query = JSON.parse(JSON.stringify(req.query));
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await workloadService.getResourceInfo(query, tokenData, req);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_FAILED);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to change workload name
     */
    async workloadRename(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE);
            const data = JSON.parse(JSON.stringify(req.body));
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await workloadService.workloadRename(data, tokenData);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
     * This functionn is used to get the list of the cloud accounts name 
     */

    async getAllCloudAccountName(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_START);
            const project_id = req.query.project_id;
            const cloud_resource_grp = req.query.cloud_resource_grp;
            const tokenData = await authGuard.getDataByToken(req);
            const finalResponse = await workloadService.getAllCloudAccountNameList(tokenData, cloud_resource_grp, project_id, req);
            if (finalResponse && finalResponse.length > 0 && Array.isArray(finalResponse)) {
                finalResponse?.forEach((account: Record<string, string>) => {
                    account.cloud_resource_grp = (cloud_resource_grp as string)
                })
            }
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.GET_ALL_CLOUD_ACCOUNT_NAME_CONTROLLER_COMPLETED);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.ERROR_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to change workload name
     */
    async uploadImageToAzure(req: Request, res: Response) {
        try {
            const formData = formidable({ multiples: true });
            formData.parse(req, async function (err: any, fields: any, files: any) {
                if (err) {
                    res.status(400).send(err);
                }
                try {
                    const response = await workloadService.uploadImageToAzure(files);
                    res.status(201).send(response);
                } catch (err: any) {
                    res.status(400).send(err.message);
                }
            });
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
    * This below function is used to discover sync update
    */
    async discoverSyncUpdate(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.WORKLOAD_DISCOVERY_FLAG_UPDATE);
            const data = JSON.parse(JSON.stringify(req.body));
            const finalResponse = await workloadService.discoverSyncUpdate(data);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to get the all workloads based on project id
     */
    async getWorkloads(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const project_id = req.params._id;
            const finalResponse = await workloadService.getAllWorkloads(tokenData, project_id);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to get the all workloads based on project id
     */
    async getWorkloadMapList(req: Request, res: Response) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CONTROLLER + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_MAP_STARTED);
            const tokenData = await authGuard.getDataByToken(req);
            const project_id = req.params._id;
            const finalResponse = await workloadService.getWorkloadMapList(tokenData, project_id);
            res.status(200).send(finalResponse);
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_MAP_FAILED + error.message);
            res.status(400).send(error.message);
        }
    }

    /**
     * This below function is used to check workload name exist or not
     */
    async workloadNameExist(req: Request, res: Response) {
        try {
            const data = JSON.parse(JSON.stringify(req.body));
            const finalResponse = await workloadService.workloadNameExist(data);
            res.status(finalResponse.statusCode).send({ message: finalResponse.message, workload_name: finalResponse.workload_name });
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    }
}
