import {  findByWorkloadUserMapFields, removeAndupdateWorkload, workloadBulkWrite, workloadUserCreate } from '../models/workloadusermapping';
import AppConstants from '../utils/constant';
import { findAllWorkload, findByWorkloadName, workloadCreate, updateWorkload, findByWorkloadFields, findByArrayOfValue, discoverSyncUpdateMany } from '../models/workloadmodel';
import _ from 'lodash';
const logger = require('../helpers/logger');
import OtherService from './otherservice';
import { Request } from 'express';
import { GetAllWorkloadResource, GetWorkloadResourceById, findAll, findByResourceGrp, workloadResourceGroupingMasterCreate } from '../models/cloud_resource_master';
import DateConvertor from "../helpers/date";
import mongoose from 'mongoose';
const moment = require('moment');
import AzureImage from "../helpers/azureimage";
const IORedis = require('ioredis');
import CurrencySymbolConvert from "../utils/currencytype";

const appConstant = new AppConstants();
const otherService = new OtherService();
const dateConvert = new DateConvertor();
const azureImage = new AzureImage();
const currencySymbolConvert = new CurrencySymbolConvert();

const redisClient = new IORedis({
    host: process.env.REDIS_SERVER_IP,
    port: process.env.REDIS_SERVER_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SERVER_DEFAULT_DB,
});

export default class WorkloadService {

    /**
     * This function is used to create the mapping of user in the workload
     */
    async workloadUserMapCreate(data: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PROJECT_USER_MAP_CREATE_INITIATED)
            const { projectData } = data;
            const { user_id, projectdtl } = projectData;
            const workloadBulkWriteValues: any[] = [];
            let appIndex = 0;
            const projectIsActive: any[] = [];
            let workloads: any = [];
            const projectIds: any[] = [];
            for (const project of projectdtl) {
                let { project_id, appdtl, role_id, role_name, isActive } = project;
                role_name = {
                    [appConstant.ROLES_SPACE.Project_Admin]: appConstant.ROLES[0],
                    [appConstant.ROLES_SPACE.Infra_Admin]: appConstant.ROLES[1],
                    [appConstant.ROLES_SPACE.View_Only]: appConstant.ROLES[2],
                    [appConstant.ROLES_SPACE.Workload_Admin]: appConstant.WORKLOAD_ADMIN
                }[role_name] || role_name;
                if (!projectIds.includes(project_id)) {
                    const appWorkload: any = await findByWorkloadUserMapFields({ project_id, status: appConstant.SCHEMA.STATUS_ACTIVE })
                    workloads = workloads.concat(appWorkload);
                    projectIds.push(project_id);
                }
                for (const app of appdtl) {
                    if (role_id != undefined) {
                        if (appConstant.ROLES.includes(role_name) || app.workloaddtl === undefined) {
                            const workloadsid: any = [];
                            if (app.workloaddtl !== undefined && role_name == appConstant.ROLES[1] && app.workloaddtl.length > 0) {
                                app.workloaddtl.map((ele: any) => {
                                    workloadsid.push(ele.workload_id)
                                })
                            }
                            if (appConstant.ROLES.includes(role_name) || app.workloaddtl == undefined) {
                                app.workloaddtl = [];
                            }
                            const conditions = {
                                app_id: app.application_id,
                                status: appConstant.SCHEMA.STATUS_ACTIVE
                            }
                            const allWorkloads = await findAllWorkload(conditions);
                            allWorkloads.map((ele) => {
                                if (!workloadsid.includes(ele._id.toString())) {
                                    app.workloaddtl.push({ workload_id: ele._id, isActive: isActive })
                                }
                            });
                        }
                    }
                    const { workloaddtl, application_id } = app;
                    for (const workload of workloaddtl) {
                        const removeUser: any[] = [];
                        const insert = { insertOne: { document: {} } };
                        const updateOne = { updateOne: { filter: {}, update: {} } };
                        const { workload_id, isActive } = workload;
                        const workload_role_id = workload.role_id != undefined ? workload.role_id : project.role_id;
                        const workload_role_name = workload.role_name != undefined ? workload.role_name : project.role_name;
                        if (!isActive) {
                            if (project.isActive && appConstant.ROLES[1] === project.role_name) {
                                updateOne.updateOne.filter = { 'workload.user_id': user_id, workload_id };
                                updateOne.updateOne.update = { $set: { 'workload.$.role_id': project.role_id ? project.role_id : project.infra_role_id, 'workload.$.role_name': project.role_name } };
                                workloadBulkWriteValues.push(updateOne);
                            } else {
                                updateOne.updateOne.filter = { application_id, workload_id };
                                updateOne.updateOne.update = { $pull: { workload: { user_id } } };
                                removeUser.push(user_id);
                                workloadBulkWriteValues.push(updateOne);
                                workloads = workloads?.map((ele: any) => {
                                    if (ele.workload_id === workload_id) {
                                        const workload_user_List = ele.workload.map((user: any) => {
                                            if (user.user_id === user_id) {
                                                return undefined;
                                            } else {
                                                return user;
                                            }
                                        })
                                        ele.workload = workload_user_List;
                                        return ele;
                                    } else {
                                        return ele;
                                    }
                                });
                                let workloadIsExists = false;
                                await workloads && workloads.map(async (ele: any) => {
                                    ele.workload = ele.workload.filter(Boolean);
                                    if (ele.project_id === project_id) {
                                        if (!_.isEmpty(ele.workload)) {
                                            await ele.workload.map((user: any) => {
                                                if (user.user_id === user_id) {
                                                    workloadIsExists = true
                                                } else {
                                                    workloadIsExists = false
                                                }
                                            })
                                        }
                                    }
                                });
                                if (!workloadIsExists) {
                                    projectIsActive.push({ project_id })
                                }
                            }
                        } else {
                            const isAppAndWorkloadExist = workloads && workloads.find((ele: any) => { return ele.workload_id === workload_id; });
                            if (!_.isNil(isAppAndWorkloadExist)) {
                                let isUserExists;
                                if (!_.isEmpty(isAppAndWorkloadExist.workload) && isAppAndWorkloadExist.workload.length > 0) {
                                    isAppAndWorkloadExist.workload = isAppAndWorkloadExist.workload.filter(Boolean);
                                    isUserExists = isAppAndWorkloadExist.workload && isAppAndWorkloadExist.workload.some((ele: any) => { return ele.user_id == user_id && !removeUser.includes(ele.user_id) });
                                }
                                if (isUserExists) {
                                    updateOne.updateOne.filter = { 'workload.user_id': user_id, workload_id };
                                    updateOne.updateOne.update = { $set: { 'workload.$.role_id': workload_role_id, 'workload.$.role_name': workload_role_name } };
                                    workloadBulkWriteValues.push(updateOne);
                                    workloads = workloads?.map((ele: any) => {
                                        if (ele.workload_id === workload_id) {
                                            const workload_user_List = ele.workload.map((user: any) => {
                                                if (user.user_id === user_id) {
                                                    return { user_id, role_id: workload_role_id, role_name: workload_role_name }
                                                } else {
                                                    return user;
                                                }
                                            })
                                            ele.workload = workload_user_List;
                                            return ele;
                                        } else {
                                            return ele;
                                        }
                                    });
                                } else {
                                    const dynamicFields = {
                                        user_id,
                                        role_id: workload_role_id,
                                        role_name: workload_role_name
                                    }
                                    updateOne.updateOne.filter = { application_id, workload_id };
                                    updateOne.updateOne.update = { $push: { workload: dynamicFields } };
                                    workloadBulkWriteValues.push(updateOne);
                                    workloads = workloads?.map((ele: any) => {
                                        if (ele.workload_id === workload_id) {
                                            ele.workload.push(dynamicFields)
                                            return ele;
                                        } {
                                            return ele;
                                        }
                                    });
                                }
                            } else {
                                const appUserMap = {
                                    tenant_id: tokenData.tenant_id,
                                    tenant_group_id: tokenData.tenant_group_id,
                                    project_id,
                                    application_id,
                                    workload_id,
                                    workload: [{
                                        user_id,
                                        role_id: workload_role_id,
                                        role_name: workload_role_name
                                    }],
                                    created_by_user_id: tokenData._id,
                                    updated_by_user_id: tokenData._id
                                };
                                insert.insertOne.document = appUserMap;
                                workloadBulkWriteValues.push(insert);
                                appIndex++;
                            }
                        }
                    }
                }
            }
            await workloadBulkWrite(workloadBulkWriteValues);
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PROJECT_USER_MAP_CREATE)
            return projectIsActive;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.PROJECT_USER_MAP_CREATE_FAILED)
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get the workload details by user id 
     */
    async getWorkloadByUserId(tokenData: any, application_id: any, req: Request) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_INITIATED);
            const workloads = await findAllWorkload({
                app_id: application_id,
                status: appConstant.SCHEMA.STATUS_ACTIVE,
                tenant_id: tokenData.tenant_id
            });
            const user_id = req.query.user_id ? req.query.user_id : tokenData._id;
            const workloadUserMap: any = await findByWorkloadUserMapFields({
                application_id: application_id,
                status: appConstant.SCHEMA.STATUS_ACTIVE,
                tenant_id: tokenData.tenant_id
            });
            const allRoles:any= await otherService.getAllRole(req).catch((error: any) => { throw new Error(error) });
            if(allRoles?.error){
                throw new Error(allRoles.error); 
            }
            if (workloads) {
                let result = workloads.map((workload) => {
                    const matchingUserMap = workloadUserMap?.find((usermap: any) => usermap.workload_id.toString() === workload._id.toString());
                    if (matchingUserMap) {
                        const matchingData = matchingUserMap.workload.find((data: any) => data.user_id.toString() === user_id);
                        if (matchingData) {
                            const matchingRole = allRoles.find((role:any) => role._id === matchingData.role_id.toString());
                            if (matchingRole) {
                                const { _id, role_name, access_level } = matchingRole;
                                return {
                                    _id: workload._id,
                                    project_id: workload.project_id,
                                    app_id: workload.app_id,
                                    workload_name: workload.workload_name,
                                    roledtl: { _id, role_name, access_level },
                                    ...(matchingRole.role_name === appConstant.WORKLOAD_ADMIN
                                        && { isActive: true, isupdatechecked: true })
                                };
                            }
                        }
                    }
                    if (!req?.query?.access_overview) {
                        return {
                            _id: workload._id,
                            project_id: workload.project_id,
                            app_id: workload.app_id,
                            workload_name: workload.workload_name,
                        };
                    }
                });
                return result;
            }

        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to create workload or update particular workload
     */
    async workloadCreateAndUpdate(workloadBody: Record<string, any>, tokenData: Record<string, any>, req: any): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.WORKLOAD_CREATE_UPDATE);
            const { project_id, app_id, workload_name, nodes, edges, workload_id, cloud_platform } = workloadBody;
            if (_.isNil(workload_name)) {
                throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NAME_NULL);
            }
            const workloadExists = await findByWorkloadName(workload_name, app_id);
            if (nodes.length == 0) {
                throw new Error(appConstant.ERROR_MESSAGES.NODES_NULL);
            }
            if (!_.isNil(workload_id)) {
                const workload = await findByWorkloadFields({ _id: workload_id });
                if (_.isNil(workload)) {
                    logger.error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
                    throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
                }
                if (workloadExists && workloadExists._id != workload_id) {
                    logger.error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE)
                    throw new Error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE);
                }
                await this.resourceWithWorkloadMap(workload.nodes, workload_id, app_id, appConstant.SCHEMA.ISFALSE).catch((error: any) => { throw new Error(error) });
                await updateWorkload(workload_id, { $set: { nodes, edges, workload_name, cloud_platform, updated_by_user_id: tokenData._id, updated_at: new Date(), discover_sync_flag: false } });
                await this.resourceWithWorkloadMap(nodes, workload_id, app_id, appConstant.SCHEMA.ISTRUE).catch((error: any) => { throw new Error(error) });
                logger.info(appConstant.MESSAGES.WORKLOAD_UPDATED);
                return { message: appConstant.MESSAGES.WORKLOAD_UPDATED, statusCode: 200 };
            } else {
                if (workloadExists) {
                    logger.error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE)
                    throw new Error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE);
                }
                const workload = {
                    tenant_id: tokenData.tenant_id,
                    tenant_group_id: tokenData.tenant_group_id,
                    project_id,
                    app_id,
                    workload_name,
                    nodes,
                    cloud_platform,
                    edges,
                    created_by_user_id: tokenData._id
                }
                const workloadResult = await workloadCreate(workload);
                const usersList = await otherService.autoRoleMap(req, tokenData, project_id).catch((error: any) => { throw new Error(error) });
                if(usersList?.error){
                    throw new Error(usersList.error); 
                }
                if (usersList && usersList.length > 0) {
                    const appUserMap = {
                        tenant_id: tokenData.tenant_id,
                        tenant_group_id: tokenData.tenant_group_id,
                        project_id,
                        application_id: app_id,
                        workload_id: workloadResult._id,
                        workload: usersList[0].users_mapping,
                        created_by_user_id: tokenData._id,
                        updated_by_user_id: tokenData._id
                    };
                    await workloadUserCreate(appUserMap);
                }
                await this.resourceWithWorkloadMap(nodes, workloadResult._id, app_id, appConstant.SCHEMA.ISTRUE).catch((error: any) => { throw new Error(error) });
                logger.info(appConstant.LOGGER_MESSAGE.WORKLOAD_CREATED_SUCCESSFUL);
                return { message: appConstant.MESSAGES.WORKLOAD_CREATED, statusCode: 201 };
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * This function is used to update the  workloadid and application id in the dynamic colletion of mist api
     */
    async resourceWithWorkloadMap(nodes: any[], workload_id: any, application_id: any, isActive: boolean) {
        try {
            const { resourceIds, resourceGroupIds } = nodes.reduce(
                (result, node) => {
                    result.resourceIds.push(node.resource_id);
                    result.resourceGroupIds.push(node.resource_group_id);
                    return result;
                },
                { resourceIds: [], resourceGroupIds: [] }
            );
            const collectionNames = await mongoose.connection.db.collection(appConstant.SCHEMA.WORKLOAD_RESOURCE_GROUPING)
                .aggregate([
                    {
                        $match: { "cloud_resource_grp._id": { $in: resourceGroupIds }, }
                    },
                    {
                        $project: { cloud_resource_grp: { $filter: { input: "$cloud_resource_grp", as: "resource", cond: { $in: ["$$resource._id", resourceGroupIds] } } }, _id: 0 }
                    },
                    {
                        $unwind: "$cloud_resource_grp"
                    },
                    {
                        $group: { _id: null, cloud_resource_grp: { $push: "$cloud_resource_grp" } }
                    },
                    {
                        $project: { _id: 0 }
                    }
                ]).toArray();
            let index = 0;
            const pullOrPush = isActive ? '$push' : '$pull';
            for (const resource of collectionNames[0].cloud_resource_grp) {
                const { lookup_collection, lookupkeys } = resource;
                const resourceExist = await mongoose.connection.db.collection(lookup_collection).findOne({ [lookupkeys.resource_id]: resourceIds[index] });
                let appIsExist;
                if (resourceExist?.proj_app_workload) {
                    appIsExist = resourceExist?.proj_app_workload.find((ele: any) => { if (ele.application_id == application_id) { return ele } });
                }
                let updateFields: any;
                let filters: any;
                if (appIsExist) {
                    filters = { [lookupkeys.resource_id]: resourceIds[index], 'proj_app_workload.application_id': application_id }
                    if (appIsExist.workload_ids.length == 1 && !isActive) {
                        updateFields = { [pullOrPush]: { proj_app_workload: { application_id } } };
                    } else {
                        updateFields = { [pullOrPush]: { 'proj_app_workload.$.workload_ids': workload_id } };
                    }
                } else {
                    filters = { [lookupkeys.resource_id]: resourceIds[index] };
                    const dynamicFields = {
                        application_id,
                        workload_ids: [workload_id]
                    };
                    updateFields = { [pullOrPush]: { proj_app_workload: dynamicFields } };
                }
                await mongoose.connection.db.collection(lookup_collection).findOneAndUpdate(filters, updateFields);
                index++;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to delete a particular workload
     */
    async workloadDelete(params: Record<string, any>, tokenData: Record<string, any>): Promise<string> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.WORKLOAD_DELETE);
            const { workload_id } = params;
            const workload = await findByWorkloadFields({ _id: workload_id });
            if (_.isNil(workload)) {
                logger.error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
            }
            await updateWorkload(workload_id, { status: appConstant.SCHEMA.STATUS_INACTIVE, updated_by_user_id: tokenData._id, updated_at: new Date() })
            await this.resourceWithWorkloadMap(workload.nodes, workload_id, workload.app_id, appConstant.SCHEMA.ISFALSE).catch((error: any) => { throw new Error(error) });
            logger.info(appConstant.MESSAGES.WORKLOAD_DELETED);
            return appConstant.MESSAGES.WORKLOAD_DELETED;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /*
     * The below function is used for get the particular workload
     */
    async getWorkload(params: any, tokenData: any, query: any, req: Request, userData: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_WORKLOAD_FUNCTION_STARTED);
            const { _id } = params;
            const { pricetagger } = query;
            const dynamicFields = { _id: _id };
            const workloadData = await findByWorkloadFields(dynamicFields);

            if (!workloadData) {
                throw new Error(appConstant.LOGGER_MESSAGE.WORKLOAD_NOT_FOUND);
            }

            const resource_group_id = workloadData.nodes.map((data: any) => data.resource_group_id) || [];
            let finalResponse: any;

            if (pricetagger) {
                const currentData: any = await new Promise((resolve, reject) => {
                    redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, (getError: any, data: any) => {
                        if (getError) {
                            console.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                            reject(new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED));
                        } else {
                            resolve(data);
                        }
                    });
                });

                finalResponse = await new WorkloadService().handlePriceTaggerWorkload(workloadData, tokenData, query, req, userData, currentData, resource_group_id);
            } else {
                finalResponse = await new WorkloadService().viewWorkload(workloadData, resource_group_id);
            }
            logger.info(appConstant.LOGGER_MESSAGE.GET_WORKLOAD_FUNCTION_COMPLETED);

            return finalResponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_WORKLOAD_FAILED);
            throw new Error(error.message);
        }
    }

    /** 
     * The below function is used for get the price tagger workload 
    */
    async handlePriceTaggerWorkload(workloadData: any, tokenData: any, query: any, req: Request, userData: any, currentData: any, resource_group_id: any) {
        try {
            let totalCosts:any ;
            logger.info(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_STARTED);
            // Pricetagger Functionality
            const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
            const foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                if (ele.user_id === tokenData._id && ele.project_id === query.project_id) {
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
            let mistTokenData;
            if (!foundUserToken) {
                logger.info(appConstant.LOGGER_MESSAGE.GET_PROJECT_FUNCTION_STARTED);
                const projectData: any = await otherService.getProject(req, query.project_id);
                if(projectData?.error){
                    throw new Error(projectData.error); 
                }
                if (projectData) {
                    logger.info(appConstant.LOGGER_MESSAGE.GET_PROJECT_FUNCTION_COMPLETED);
                    userData.org = projectData?.project_name;
                    logger.info(appConstant.LOGGER_MESSAGE.MIST_TOKEN_GENERATION_SERVICE);
                    mistTokenData = await otherService.generateAuthTokeMist(req, userData);
                    if(mistTokenData?.error){
                        throw new Error(mistTokenData.error); 
                    }
                    mistTokenData.mistToken = mistTokenData.token;
                    const tokenDetails = {
                        project_id: query.project_id,
                        mistToken: mistTokenData.token,
                        user_id: tokenData._id,
                    };
                    const newTokenDetailsArray = tokenDetailsArray.filter((item: any) => item.project_id !== query.project_id);
                    newTokenDetailsArray.push(tokenDetails);
                    const updatedTokenDetailsString = JSON.stringify(newTokenDetailsArray);
                    redisClient.set(appConstant.REDIS_MIST_TOKEN_KEYNAME, updatedTokenDetailsString, (setError: any, setResult: any) => {
                        if (setError) {
                            console.error(appConstant.ERROR_MESSAGES.ERROR_STORING_TOKEN_DETAILS, setError);
                            throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                        } else {
                            logger.info(appConstant.MESSAGES.TOEKN_DETAILS_STORED_SUCCESSFULLY, setResult);
                        }
                    });
                } else {
                    logger.error(appConstant.LOGGER_MESSAGE.GET_PROJECT_FUNCTION_FAILED);
                    throw new Error(appConstant.LOGGER_MESSAGE.GET_PROJECT_FUNCTION_FAILED);
                }
            } else {
                mistTokenData = foundUserToken;
            }

            if (!mistTokenData) {
                throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
            }

            const body = {
                app_id: workloadData.app_id,
                workload_id: workloadData._id,
                start_date: query.start_date,
                end_date: query.end_date
            };
            logger.info(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_SERVICE_CALL_STARTED);
            const price = await otherService.priceTagger(mistTokenData.mistToken, body);
            if(price?.error){
                throw new Error(price.error); 
            }
            if (_.isNil(price) || _.isEmpty(price)) {
                throw new Error(appConstant.ERROR_MESSAGES.PRICE_TAGGER_EMPTY_VALUE);
            }
            logger.info(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_SERVICE_CALL_COMPLETED);
            // Helper function to remove curly braces and single quotes from the values
            function removeCurlyBracesAndQuotes(value: string) {
                return value.replace(/{|}|'/g, '');
            }

            // Convert the list of strings to an array of objects
            const arrayOfObjects: any = [].concat(...price.map((item: any) =>
                item.resources.map((data: any) => ({
                    resource_id: removeCurlyBracesAndQuotes(data.resource_id),
                    cost: parseFloat(removeCurlyBracesAndQuotes(data.cost)),
                    unit: removeCurlyBracesAndQuotes(data.unit)
                }))
            ));
            const resource_ids: any = [];
            arrayOfObjects.map((item: any) => {
                if (!_.isEmpty(resource_ids) && resource_ids.includes(item.resource_id)) {
                    throw new Error (appConstant.ERROR_MESSAGES.DUPLICATE_RECORD_FOUND);
                }
                resource_ids.push(item.resource_id);
            });
            let selectedCurrency: any;
            price.map(async (priceItem: any) => {
                selectedCurrency = await currencySymbolConvert.getCurrencySymbol(removeCurlyBracesAndQuotes(priceItem.display_currency));
                totalCosts = await removeCurlyBracesAndQuotes(priceItem.total_cost);
            })

            const resourceGroup: any[] = [];
            logger.info(appConstant.LOGGER_MESSAGE.GET_WROKLOAD_RESOURCE_FUNCTION_STARTED);
            const resource = await GetAllWorkloadResource({ "cloud_resource_grp._id": { $in: resource_group_id } });
            logger.info(appConstant.LOGGER_MESSAGE.GET_WROKLOAD_RESOURCE_FUNCTION_COMPLETED);
            let total_price: Number = 0;
            const addedResourceIds: any[] = []; // Array to track added resource_ids

            // Initialize a Set to track unique resource IDs
            const lookupCollections = Array.from(new Set(resource.flatMap(resourceData => resourceData.cloud_resource_grp.map(resdata => resdata.lookup_collection))));
            const collectionPromises = lookupCollections.map(colName => mongoose.connection.db.listCollections({ name: colName }).toArray());
            const collectionInfos = await Promise.all(collectionPromises);
            const collectionInfoLookup = Object.fromEntries(lookupCollections.map((collection, index) => [collection, collectionInfos[index]]));
            const addedResourceIdsSet = new Set();

            for (const priceItem of arrayOfObjects) {
                for (const data of workloadData.nodes) {
                    for (const resourceData of resource) {
                        for (const resdata of resourceData.cloud_resource_grp) {
                            const colName = resdata.lookup_collection;
                            const collinfo = collectionInfoLookup[colName];
                            if (_.isEmpty(collinfo)) {
                                logger.error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED);
                                throw new Error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED);
                            }
                            if ((priceItem.resource_id as String).toLowerCase() === (data.resource_id as String).toLowerCase() && resdata._id == data.resource_group_id && !addedResourceIds.includes(priceItem.resource_id)){
                                const resourceGroupIdMatch = resource_group_id.find((id: any) => resdata._id === id);
                                if (resourceGroupIdMatch) {
                                    const collection = resdata.lookup_collection.toString();
                                    const findkey = resdata.lookupkeys.resource_id;
                                    const query = { [findkey]: data.resource_id, cloud: data.cid };
                                    const metaServiceData = await mongoose.connection.db.collection(collection).findOne(query);
                                    total_price = Number(total_price) + Number(priceItem.cost);
                                    if (metaServiceData) {
                                        resourceGroup.push({
                                            id: data.id,
                                            resource_id: data.resource_id,
                                            resource_group_id: data.resource_group_id,
                                            name: data.name,
                                            image: resdata.image,
                                            cid: data.cid,
                                            lookup_collection: data.lookup_collection,
                                            label: data.label,
                                            cost: `${selectedCurrency?.symbol}${priceItem.cost}`,
                                            isActive: metaServiceData.missing_since ? false : true,
                                            opacity: metaServiceData.missing_since ? 0.3 : 1,
                                            x: parseFloat(data.x),
                                            y: parseFloat(data.y)
                                        });
                                        addedResourceIdsSet.add(priceItem.resource_id);
                                    } else {
                                        resourceGroup.push({
                                            id: data.id,
                                            resource_id: data.resource_id,
                                            resource_group_id: data.resource_group_id,
                                            name: data.name,
                                            image: resdata.image,
                                            label: data.label,
                                            cost: `${selectedCurrency?.symbol}${priceItem.cost}`,
                                            isActive: false,
                                            opacity: 0.3,
                                            x: parseFloat(data.x),
                                            y: parseFloat(data.y)
                                        })
                                        addedResourceIdsSet.add(priceItem.resource_id);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const finalResponse = {
                updated_at: workloadData.updated_at,
                _id: workloadData._id,
                tenant_id: workloadData.tenant_id,
                tenant_group_id: workloadData.tenant_group_id,
                project_id: workloadData.project_id,
                app_id: workloadData.app_id,
                workload_name: workloadData.workload_name,
                total_price: `${selectedCurrency?.symbol}${totalCosts}`,
                nodes: resourceGroup,
                edges: workloadData.edges,
                status: workloadData.status,
                created_by_user_id: workloadData.created_by_user_id,
                created_at: workloadData.created_at,
            };
            logger.info(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_COMPLETED);
            return finalResponse;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_FAILED);
            throw new Error(error.message);
        }
    }

    /** 
     * The below function is used for get the view workload 
    */
    async viewWorkload(workloadData: any, resource_group_id: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.VIEW_WORKLOAD_STARTED);

            // Non-Pricetagger Functionality
            logger.info(appConstant.LOGGER_MESSAGE.GET_WROKLOAD_RESOURCE_FUNCTION_STARTED);
            const resource = await GetAllWorkloadResource({ "cloud_resource_grp._id": { $in: resource_group_id } });
            logger.info(appConstant.LOGGER_MESSAGE.GET_WROKLOAD_RESOURCE_FUNCTION_COMPLETED);
            const resourceGroup = [];

            const collectionNames = new Set();

            // Collect all lookup_collection names in a set
            for (const resourceData of resource) {
                for (const resdata of resourceData.cloud_resource_grp) {
                    collectionNames.add(resdata.lookup_collection);
                }
            }

            // Fetch all collections in a single query
            const collectionPromises = Array.from(collectionNames).map(async (colName) => {
                const collinfo = await mongoose.connection.db.listCollections({ name: colName }).toArray();
                if (_.isEmpty(collinfo)) {
                    logger.error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED);
                    throw new Error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED);
                }
                return collinfo[0].name;
            });

            // Use Promise.all() for parallel queries
            const collections = await Promise.all(collectionPromises);

            const resourceGroupIdLookup = resource_group_id.reduce((lookup: any, id: any) => {
                lookup[id] = true;
                return lookup;
            }, {});

            for (const data of workloadData.nodes) {
                for (const resourceData of resource) {
                    for (const resdata of resourceData.cloud_resource_grp) {
                        const colName = resdata.lookup_collection;
                        const colIndex = collections.indexOf(colName);

                        if (colIndex !== -1 && resdata._id === data.resource_group_id && resourceGroupIdLookup[resdata._id]) {
                            const collection = collections[colIndex];
                            const findkey = resdata.lookupkeys.resource_id;
                            const query = { [findkey]: data.resource_id };
                            const metaServiceData = await mongoose.connection.db.collection(collection).findOne(query);
                            if (metaServiceData) {
                                resourceGroup.push({
                                    id: data.id,
                                    resource_id: data.resource_id,
                                    resource_group_id: data.resource_group_id,
                                    name: data.name,
                                    cid: data.cid,
                                    lookup_collection: data.lookup_collection,
                                    image: resdata.image,
                                    label: data.label,
                                    isActive: metaServiceData.missing_since ? false : true,
                                    opacity: metaServiceData.missing_since ? 0.3 : 1,
                                    x: parseFloat(data.x),
                                    y: parseFloat(data.y),
                                });
                            } else {
                                resourceGroup.push({
                                    id: data.id,
                                    resource_id: data.resource_id,
                                    resource_group_id: data.resource_group_id,
                                    name: data.name,
                                    image: resdata.image,
                                    label: data.label,
                                    isActive: false,
                                    opacity: 0.3,
                                    x: parseFloat(data.x),
                                    y: parseFloat(data.y)
                                });
                            }
                        }
                    }
                }
            }


            const finalResponse = {
                updated_at: workloadData.updated_at,
                _id: workloadData._id,
                tenant_id: workloadData.tenant_id,
                tenant_group_id: workloadData.tenant_group_id,
                project_id: workloadData.project_id,
                cloud_platform: workloadData.cloud_platform,
                app_id: workloadData.app_id,
                workload_name: workloadData.workload_name,
                nodes: resourceGroup,
                edges: workloadData.edges,
                status: workloadData.status,
                created_by_user_id: workloadData.created_by_user_id,
                created_at: workloadData.created_at,
            };
            logger.info(appConstant.LOGGER_MESSAGE.VIEW_WORKLOAD_COMPLETED);
            return finalResponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.VIEW_WORKLOAD_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get all the list of the workloads based on the application
     */
    async getAllWorkloadList(tokenData: Record<string, any>, applicationId: any, req: Request, limit: any, count: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GETALL_WORKLOAD_SERVICE_STARTED);
            let workloadList;
            let roleMap: any;
            let getAllRoles:any;
            if (tokenData.user_type == appConstant.SCHEMA.NORMAL_USER) {
                getAllRoles = await otherService.getAllRole(req).catch((error: any) => { throw new Error(error) });;
                if(getAllRoles?.error){
                    throw new Error(getAllRoles.error); 
                }
                const workloadUserMap = await findByWorkloadUserMapFields({ application_id: applicationId, "workload.user_id": tokenData._id });
                const workloadIds: any[] = [];
                roleMap = workloadUserMap?.map((ele) => {
                    workloadIds.push(ele.workload_id);
                    const role = ele.workload.find((user) => { return user.user_id == tokenData._id })
                    return { workload_id: ele.workload_id, role_id: role?.role_id, role_name: role?.role_name }
                });
                workloadList = await findAllWorkload({ _id: { $in: workloadIds }, status: appConstant.SCHEMA.STATUS_ACTIVE }).sort({ created_at: -1 });
            } else {
                workloadList = await findAllWorkload({ app_id: applicationId, status: appConstant.SCHEMA.STATUS_ACTIVE }).sort({ created_at: -1 });
            }
            const totalCount = workloadList.length;
            let totalPages;
            let currentPage;
            if (!_.isNil(limit) && limit != 0) {
                totalPages = Math.ceil(totalCount / limit);
                currentPage = count > 0 ? count : 1;
                // Calculate the correct start and end indexes for the current page
                const startIndex = (currentPage - 1) * limit;
                const endIndex = Math.min((Number(startIndex) + Number(limit)), totalCount);
                // If the requested page is out of range, return an empty list
                if (startIndex >= totalCount) {
                    return {
                        totalCount,
                        totalPages,
                        currentPage,
                        workloadList: []
                    };
                }
                workloadList = workloadList.slice(startIndex, endIndex);
            }
            const finalResponse = [];
            // Format the created_at dates for each item in the paginated list
            let index = 0;
            for (const item of workloadList) {
                const updatedDate = await dateConvert.dateConvertor(item.created_at, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                const createdAt = moment(item.created_at).tz(tokenData.time_zone)
                const currentTime = moment().tz(tokenData.time_zone);
                const diffDuration = moment.duration(currentTime.diff(createdAt));
                const diffMinutes = diffDuration.minutes();
                const diffHours = diffDuration.hours();
                const diffDays = diffDuration.days();
                let created_date_time;
                if (diffMinutes <= 60 && diffHours == 0 && diffDays == 0) {
                    created_date_time = `${diffMinutes}m ago`;
                } else if (diffHours < 24 && diffDays == 0) {
                    created_date_time = `${diffHours}hr ago`;
                } else if (diffDays < 7) {
                    created_date_time = `${diffDays}d ago`;
                } else {
                    created_date_time = createdAt.format('DD MMM YYYY');
                }
                const finalObj: any = {
                    _id: item._id,
                    tenant_id: item.tenant_id,
                    project_id: item.project_id,
                    app_id: item.app_id,
                    workload_name: item.workload_name,
                    status: item.status,
                    created_at: created_date_time,
                    discover_sync_flag: item.discover_sync_flag,
                    last_discovered_on: item.last_discovered_on,
                    ...(tokenData.user_type == appConstant.SCHEMA.NORMAL_USER && {
                        role_id: roleMap?.[index]?.role_id,
                        role_name: roleMap?.[index]?.role_name,
                        ...(true && {
                            role_access: getAllRoles?.find((ele:any) => ele._id == roleMap?.[index]?.role_id).access_level
                        })
                    })
                }
                index++;
                finalResponse.push(finalObj)
            }
            return {
                totalCount, 
                ...(!_.isNil(limit) && {
                    totalPages,
                    currentPage,
                }),
                workloadList: finalResponse
            };
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get all the active cloud platforms
     */
    async getAllCloudPlatformsByApp(tokenData: Record<string, any>, project_id: any, req: Request): Promise<any> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GETALL_CLOUD_PLATFORM_SERVICE_STARTED);
            let finalResponse;
            await otherService.getAllCloudPlatforms(project_id, req).then(async (data) => {
                if(data?.error){
                    throw new Error(data.error); 
                }
                finalResponse = data;
                logger.info(appConstant.LOGGER_MESSAGE.GETALL_CLOUD_PLATFORM_SERVCIE_COMPLETED);
            }).catch((error: any) => {
                throw new Error(error.message);
            });
            return finalResponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GETALL_CLOUD_PLATFORM_SERVICE_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to create the workload resource grouping masters
     */
    async createWorkloadResourceGrpMaster(tokenData: Record<string, any>, requestData: any): Promise<any> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_SERVICE_START);
            let finalResponse;
            await workloadResourceGroupingMasterCreate(requestData).then(async (data: any) => {
                finalResponse = data;
                logger.info(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_SERVICE_COMPLETED);
            }).catch((error: any) => {
                throw new Error(error.message);
            });
            return finalResponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.CLOUD_RESOURCE_GRP_MASTER_CREATE_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get the list of the category based on the cloud platforms
     */
    async getCategoryBasedOnCloud(tokenData: Record<string, any>, cloud_platform: any): Promise<any> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_SERVICE_STARTED);
            let finalResponse;
            const filterObj = {
                cloud_platform_display_name: cloud_platform,
                cloud_category_status: appConstant.SCHEMA.STATUS_ACTIVE
            }
            await findAll(filterObj).then(async (data: any) => {
                const finalData: any = [];
                data.map((ele: any) => {
                    const finalObj = {
                        _id: ele._id,
                        cloud_platform_type: ele.cloud_platform_type,
                        cloud_category: ele.cloud_category,
                        cloud_category_status: ele.cloud_category_status
                    }
                    finalData.push(finalObj)
                })
                finalResponse = finalData;
                logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_SERVICE_COMPLETED);
            }).catch((error: any) => {
                throw new Error(error.message);
            });
            return finalResponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_CATEGORY_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get all the list of the resource grouping based on the category
     */
    async getAllCloudResourceGrps(tokenData: Record<string, any>, cloud_catrgory_id: any): Promise<any> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_SERVICE_START);
            let finalResponse: any;
            const filterObj = {
                _id: cloud_catrgory_id,
                cloud_category_status: appConstant.SCHEMA.STATUS_ACTIVE
            }
            await findAll(filterObj).then(async (data: any) => {
                const finalArray: any = [];
                data[0].cloud_resource_grp.map((ele: any) => {
                    const obj = {
                        _id: ele._id,
                        name: ele.name,
                        image: ele.image,
                        status: ele.status
                    }
                    finalArray.push(obj)
                });
                finalResponse = finalArray;
            }).catch((error: any) => {
                throw new Error(error.message);
            });
            return { cloud_catrgory_id, finalResponse };
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get resource info
     */
    async getResourceInfo(params: Record<string, any>, tokenData: Record<string, any>, req: Request) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_RESOURCE_INFO_STARTED);
            const { resource_group_id, resource_id } = params;

            const resourceInfo = await new WorkloadService().fetchResourceInfo(resource_group_id, resource_id).catch((error: any) => { throw new Error(error) });
            const usedInApplications = await new WorkloadService().fetchUsedApplicationsInfo(resource_group_id, req, tokenData, resource_id).catch((error: any) => { throw new Error(error) });

            if (!_.isEmpty(resourceInfo) && !_.isNil(resourceInfo) && usedInApplications.length > 0) {
                resourceInfo["message"] = `${appConstant.MESSAGES.APPLICATION_MESSAGE} ${usedInApplications.join(", ")}`;
            }

            return resourceInfo;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_RESOURCE_INFO_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get the datas dynamically form the collections
     */
    async fetchResourceInfo(resource_group_id: string, resource_id: string) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.FETCH_RESOURCE_INFO_STARTED);
            const resource = await GetWorkloadResourceById({ "cloud_resource_grp._id": resource_group_id });
            if (!_.isNil(resource)) {
                const lookUpCollection = resource?.cloud_resource_grp.find((ele: any) => ele._id == resource_group_id);
                const colName: any = lookUpCollection?.lookup_collection;
                // Rest of your code using lookupKeys.resource_id and lookUpCollection.lookup_collection
                const collinfo = await mongoose.connection.db.listCollections({ name: colName }).toArray();
                if (_.isEmpty(collinfo)) {
                    logger.error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED)
                    throw new Error(appConstant.LOGGER_MESSAGE.COLLECTION_MISMATCHED);
                }
                const collectionName = appConstant.SCHEMA.META_SERVICE;
                const findField = { service: lookUpCollection?.lookup_collection, platform: resource?.cloud_platform_type };
                const metaServiceData = await mongoose.connection.db.collection(collectionName).find(findField).toArray();
                metaServiceData.sort((a, b) => a.order_no - b.order_no);
                if (!_.isNil(lookUpCollection?.lookupkeys)) {
                    const findkey: any = lookUpCollection?.lookupkeys.resource_id;
                    const query = { [findkey]: resource_id };
                    const machineData = await mongoose.connection.db.collection(colName).findOne(query);
                    if (!_.isNil(machineData)) {
                        const finalResponse: Record<string, any> = {};
                        for (const orderItem of metaServiceData) {
                            const fieldParts = orderItem.field_name.split('.');
                            let value: any = machineData;
                            for (const part of fieldParts) {
                                if (value === null) {
                                    // Stop the loop if value is null
                                    break;
                                }
                                if (part.includes('[')) {
                                    // Handle array indexing
                                    const arrayFieldName = part.substring(0, part.indexOf('['));
                                    const index = parseInt(part.match(/\d+/)[0]);
                                    // Check if the array and index exist
                                    if (Array.isArray(value[arrayFieldName]) && value[arrayFieldName].length > index) {
                                        value = value[arrayFieldName][index];
                                    } else {
                                        // If the field is not found, set value to null and break the loop
                                        value = null;
                                        break;
                                    }
                                } else {
                                    if (!_.isNil(value)) {
                                        value = value[part];
                                    }
                                }
                            }
                            if (value !== null) {
                                const displayName = orderItem.display_name;
                                finalResponse[displayName] = value; // Add key-value pair to the finalResponse object
                            }
                        }
                        return finalResponse;
                    } else {
                        throw new Error(appConstant.ERROR_MESSAGES.MACHINE_DATA_NOT_FOUND);
                    }

                } else {
                    logger.error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
                    throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
                }
            } else {
                logger.error(appConstant.LOGGER_MESSAGE.RESOURCE_NOT_FOUND)
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
            }

        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.FETCH_RESOURCE_INFO_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This function is used to get the all applications that matched with the resource group id
     */
    async fetchUsedApplicationsInfo(resource_group_id: string, req: Request, tokenData: any, resource_id: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.FETCH_USED_APPLICATIONS_INFO_STARTED);
            const _id = req.query.workload_id;
            const conditions = {
                "nodes.resource_group_id": resource_group_id,
                "nodes.resource_id": resource_id,
                status: appConstant.SCHEMA.STATUS_ACTIVE,
                tenant_id: tokenData.tenant_id
            };

            const workloadData = await findAllWorkload(conditions);
            const workloads = workloadData.filter((element) => element._id !== _id);
            const application_ids: string[] = workloads.map((workloadData) => workloadData.app_id);
            const applications = await otherService.getAllApplicationInfo(req, application_ids).catch((error: any) => { throw new Error(error) });
            if(applications?.error){
                throw new Error(applications.error); 
            }
            const usedInApplications: string[] = [];
            workloads.forEach((workloadData) => {
                const applicationData = applications.find((appData: any) => appData?._id === workloadData.app_id);
                if (applicationData) {
                    const appName = applicationData?.app_name;
                    const workloadName = workloadData.workload_name;
                    usedInApplications.push(`${appName} application / ${workloadName} workload`);
                }
            });
            // Filter out any null or undefined values in the array
            const filteredUsedInApplications = usedInApplications.filter(Boolean);
            return filteredUsedInApplications;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.FETCH_USED_APPLICATIONS_INFO_FAILED);
            throw new Error(error.message);
        }
    }

    /**
      * This function is used to get all the list of the resouces based on the resource grp
      */
    async getAllResoucesList(tokenData: Record<string, any>, cloud_resource_grp: any, type: any, workload_id: any, project_id: any, cloud_account: any): Promise<any> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCES_SERVICES_START);
            let finalResponse: any;
            const findLookupCollection: any = await findByResourceGrp(cloud_resource_grp);
            if (_.isNil(findLookupCollection)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const lookUpCollection = await findLookupCollection.cloud_resource_grp.find((ele: any) => ele._id == cloud_resource_grp);
            if (_.isNil(lookUpCollection)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const lookupKeys: any = lookUpCollection.lookupkeys;
            if (_.isNil(lookupKeys)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const resource_id = lookupKeys.resource_id;
            const name = lookupKeys.resource_name;
            let region = lookupKeys.notify_field != "" ? lookupKeys.notify_field.split('.').slice(1).join('.') : "";
            region = region == undefined ? lookupKeys.notify_field : region;
            const lookupKeysObject = lookupKeys.toObject();
            const keysArray: any = Object.values(lookupKeysObject);
            const listData = await mongoose.connection.db.collection(lookUpCollection.lookup_collection).find({ owner: project_id, cloud: cloud_account }).toArray();
            if (_.isNil(listData) || listData.length == 0) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCES_NOT_FOUND);
            }
            const extractedDataPromises: any = listData.map(async(ele) => {
                if(_.isNil(ele.missing_since)){
                    return await new WorkloadService().extractKeysFromObject(ele, keysArray);
                }
            });
            let extractedData = await Promise.all(extractedDataPromises);
            extractedData = _.compact(extractedData);
            const primaryIds: any = []
            extractedData.map((ele) => primaryIds.push(ele[resource_id]))
            const findSharedResource = await findByArrayOfValue(primaryIds, tokenData.tenant_id);
            for (const extractedItem of extractedData) {
                const sharedResourceMatch = findSharedResource.find((resource) => {
                    if (resource.nodes && Array.isArray(resource.nodes)) {
                        return resource.nodes.some((node) => node.resource_id === extractedItem[resource_id]);
                    }
                    return false;
                });

                if (sharedResourceMatch) {
                    extractedItem.isshared = true;
                    extractedItem.ismapped = false;
                } else {
                    extractedItem.isshared = false;
                    extractedItem.ismapped = false;
                }
            }
            //if it is edit scenario we need to check if the workload contains resources if so we need send the flag
            if (type == appConstant.REQUEST_TYPES.EDIT) {
                const dynamicFields = {
                    _id: workload_id
                }
                const findWorkload = await findByWorkloadFields(dynamicFields);
                for (const extractedItem of extractedData) {
                    const isMapped = findWorkload?.nodes.some((node) => node.resource_id === extractedItem[resource_id]);

                    if (isMapped) {
                        extractedItem.ismapped = true;
                    } else {
                        extractedItem.ismapped = false;
                    }
                }

            }
            const finalResponseArray: any = [];
            //Form the final response
            extractedData.map((ele) => {
                const obj = {
                    resource_id: ele[resource_id],
                    name: ele[name],
                    id: `${ele[resource_id]}-${cloud_resource_grp}`,
                    label: ele[name],
                    cid: cloud_account,
                    image: lookUpCollection.image,
                    resource_group_id: cloud_resource_grp,
                    region: ele[region],
                    isshared: ele.isshared,
                    ismapped: ele.ismapped,
                    lookup_collection: lookUpCollection.lookup_collection
                }
                finalResponseArray.push(obj)
            })
            return finalResponseArray;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_CLOUD_RESOURCE_GROUP_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used for key value mapping for getting the list of resources based on the resource group
     */
    async extractKeysFromObject(obj: any, keys: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.DYNAMIC_KEY_VALUE_MAPPING_START);
            const extractedData: any = {};
            keys.forEach((key: any) => {
                const nestedKeys: any = key.split('.');
                let value = obj;
                for (const nestedKey of nestedKeys) {
                    value = value[nestedKey];
                    if (value === undefined) break;
                }
                if (value !== undefined) {
                    extractedData[nestedKeys[nestedKeys.length - 1]] = value;
                }
            });
            logger.info(appConstant.LOGGER_MESSAGE.DYNAMIC_KEY_VALUE_MAPPING_COMPLETED);
            return extractedData;
        } catch (error: any) {
            logger.info(appConstant.LOGGER_MESSAGE.DYNAMIC_KEY_VALUE_MAPPING_FAILED);
            return error;
        }
    }

    /**
     * This below function is used to change workload name
     */
    async workloadRename(data: Record<string, any>, tokenData: Record<string, any>): Promise<string> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE);
            if (_.isNil(data.workload_name)) {
                throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NAME_NULL);
            }
            const workloadExists = await findByWorkloadName(data.workload_name, data.app_id);
            if (workloadExists && workloadExists._id != data.workload_id) {
                logger.error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE)
                throw new Error(appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE);
            }
            const workload = await updateWorkload(data.workload_id, { $set: { workload_name: data.workload_name, updated_by_user_id: tokenData._id, updated_at: new Date() } });
            if (_.isNil(workload)) {
                logger.error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
                throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NOT_FOUND);
            }
            return appConstant.MESSAGES.WORKLOAD_NAME_UPDATED;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE_FAILED + error.message);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to get the cloud account name list based on the group
     */
    async getAllCloudAccountNameList(tokenData: Record<string, any>, cloud_resource_grp: any, project_id: any, req: Request) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_START);
            let finalResponse: any;
            const findLookupCollection: any = await findByResourceGrp(cloud_resource_grp);
            if (_.isNil(findLookupCollection)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const lookUpCollection = await findLookupCollection.cloud_resource_grp.find((ele: any) => ele._id == cloud_resource_grp);
            if (_.isNil(lookUpCollection)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const lookupKeys: any = lookUpCollection.lookupkeys;
            if (_.isNil(lookupKeys)) {
                throw new Error(appConstant.ERROR_MESSAGES.RESOURCE_ID_NOT_MATCHED);
            }
            const listData = await mongoose.connection.db.collection(lookUpCollection.lookup_collection).find({ owner: project_id }).toArray();
            if (_.isNil(listData) || listData.length == 0) {
                return [];
            }
            const cloud_account_id: any = [];
            listData.map((ele) => cloud_account_id.push(ele.cloud));
            const finalArray = {
                cloud_account_id: cloud_account_id,
                cloud_type: findLookupCollection.cloud_platform_type.toUpperCase()
            }
            const getCloudName = await otherService.getCloudName(req, tokenData, finalArray).catch((error: any) => { throw new Error(error) });
            if(getCloudName?.error){
                throw new Error(getCloudName.error); 
            }
            return getCloudName
        } catch (error: any) {
            logger.error(appConstant.ERROR_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_FAILED + error.message);
            throw new Error(error.message);
        }
    }

    /**
     * This below functionality is used to upload image to azure
     */
    async uploadImageToAzure(imgFile: any) {
        try {
            // If image is present then save image to Azure
            if (imgFile.File) {
                const blobName = Date.now().toString() + '-' + imgFile.File.originalFilename;
                const blobUrl = await azureImage.saveImage(imgFile, blobName);
                return blobUrl;
            } else {
                throw new Error(appConstant.LOGGER_MESSAGE.BLANK_PICTURE);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to discover sync update
     */
    async discoverSyncUpdate(data: Record<string, any>): Promise<string> {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.WORKLOAD_DISCOVERY_FLAG_UPDATE);
            await discoverSyncUpdateMany({ 'nodes.cid': data.cid }, { $set: { discover_sync_flag: true, last_discovered_on: new Date() } });
            return appConstant.MESSAGES.WORKLOAD_DISCOVERY_FLAG_UPDATE;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.WORKLOAD_NAME_CHANGE_FAILED + error.message);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to get the all workloads based on project id
     */
    async getAllWorkloads(tokenData: any, project_id: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_STARTED);
            const conditions = {
                project_id: project_id,
                status: appConstant.SCHEMA.STATUS_ACTIVE
            }
            const workloads: any = await findAllWorkload(conditions);
            return workloads;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_FAILED);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to get all the workload that mapped on this user
     */

    async getWorkloadMapList(tokenData: any, project_id: any) {
        try {
            logger.info(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_MAP_STARTED);
            const user_id = tokenData._id;
            const isAppAndWorkloadExist: any = await findByWorkloadUserMapFields({ project_id: project_id, "workload.user_id": user_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
            return isAppAndWorkloadExist;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.SERVICE + appConstant.LOGGER_MESSAGE.GET_ALL_WORKLOAD_MAP_FAILED);
            throw new Error(error.message);
        }
    }

    /**
    * This below function is used to check workload name exist or not
    */
    async workloadNameExist(data: Record<string, any>): Promise<Record<string, any>> {
        try {
            const { workload_name, app_id } = data;
            if (_.isNil(workload_name)) {
                throw new Error(appConstant.ERROR_MESSAGES.WORKLOAD_NAME_NULL);
            }
            const workloadExists = await findByWorkloadName(workload_name, app_id);
            const existOrNot = _.isNil(workloadExists) ? { statusCode: 202, message: appConstant.MESSAGES.WORKLOAD_NAME, workload_name } : { statusCode: 400, message: appConstant.MESSAGES.WORKLOAD_NAME_DUPLICATE, workload_name };
            return existOrNot;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}