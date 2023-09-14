import { applicationCreate, findByApplicationFields, findByApplicationName, updateApplication, deleteApplication, findAllApplication } from "../models/applicationmodel";
import { findByProjectName, projectsCreate, updateProject, findAllProjects, deleteProject, findByProjectFields } from "../models/projectsmodel";
import AppConstants from '../utils/constant';
const _ = require("lodash");
import AzureImage from "../helpers/azureimage";
import { ProjectUser, findAllByProjectUserMapFields, findAndUpdateInArray, findAndUpdateProjectUser, findAndUpdateRoleProjectUser, findByProjectUserMapFields, projectBulkWrite, projectUserCreate, removeAndupdate } from "../models/projectusermapping";
import OtherService from "./otherservices"
import { applicationUserCreate, findByApplicationUserMapFields, findAndUpdateAppNewUser, ApplicationUser, isUserExist, getAppUsers, applicationBulkWrite } from "../models/userapplicationmapping";
const logger = require('../helpers/logger');
import DateConvertor from "../helpers/date";
import { CloudOnbarod,cloudOnboardCreate, cloudUserCount, cloundAccountUpdate, findAll, findCloudAccountAndUpdate, findCloudAccountByFields, findAllById } from "../models/cloudonboard";
import ApiFilters from "../helpers/apifilters";
const redis = require('redis');
const IORedis = require('ioredis');
import { auditTrailCreate } from "../models/audittrails"


const client = redis.createClient();
const dateConvert = new DateConvertor();
const appConstant = new AppConstants();
const azureImage = new AzureImage();
const otherService = new OtherService();

const redisClient = new IORedis({
    host: process.env.REDIS_SERVER_IP,
    port: process.env.REDIS_SERVER_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SERVER_DEFAULT_DB,
});

export default class ProjectService {

    /**
     * Get all active projects
     */
    async getAllProject(tokenData: Record<string, any>): Promise<Array<Record<string, any>>> {
        try {
            return await findAllProjects({
                _cls: appConstant.SCHEMA.OWNER_CLASS,
                status: appConstant.SCHEMA.STATUS_ACTIVE,
                tenant_id: tokenData.tenant_id
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Project Creation - unique project_name & validation
     */
    async createProject(projectData: Record<string, any>, tokenData: Record<string, any>): Promise<Record<string, any>> {
        try {
            const { project_name, description } = projectData;
            if (_.isNil(project_name)) {
                throw new Error(appConstant.MESSAGES.PROJECT_NAME_NULL);
            }
            const projectDuplicate = await findByProjectName(appConstant.SCHEMA.OWNER_CLASS, project_name, tokenData.tenant_id);
            if (projectDuplicate) {
                logger.error(appConstant.LOG_MESSAGES.CREATE_PROJECT + appConstant.ERROR_MESSAGES.DUPLICATE);
                throw new Error(appConstant.ERROR_MESSAGES.DUPLICATE);
            }
            const project = {
                _cls: appConstant.SCHEMA.OWNER_CLASS,
                project_name,
                description,
                members: [tokenData._id],
                tenant_group_id: tokenData.tenant_group_id,
                tenant_id: tokenData.tenant_id,
                created_by_user_id: tokenData._id,
                updated_by_user_id: tokenData._id
            };
            return await projectsCreate(project);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Get project Info by project_id
     */
    async getProjectInfo(queryParams: Record<string, any>, tokenData: Record<string, any>): Promise<Record<string, any>> {
        try {
            const { _id } = queryParams;
            if (_.isNil(_id)) {
                if (tokenData.user_type === appConstant.SCHEMA.NORMAL_USER) {
                    const userMapped = await findAllByProjectUserMapFields({ "users_mapping.user_id": tokenData._id, status: appConstant.SCHEMA.STATUS_ACTIVE });
                    const project_id: any = [];
                    userMapped?.map((data: any) => {
                        project_id.push(data.project_id);
                    })
                    const allProjects = await findAllProjects({ _cls: appConstant.SCHEMA.OWNER_CLASS, tenant_id: tokenData.tenant_id, _id: project_id })
                    const project = allProjects?.find((projects: any) => projects.status === appConstant.SCHEMA.STATUS_ACTIVE);
                    const projectInfo = _.pick(project, ['_id', 'project_name', 'description']);
                    return projectInfo;
                }
                const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, tenant_id: tokenData.tenant_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
                const projectInfo = _.pick(project, ['_id', 'project_name', 'description']);
                return projectInfo;
            }
            const projectInfo = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, tenant_id: tokenData.tenant_id, _id, status: appConstant.SCHEMA.STATUS_ACTIVE });
            if (!projectInfo) {
                logger.error(appConstant.LOG_MESSAGES.PROJECT_INFO + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            const projectRes = _.pick(projectInfo, ['_id', 'project_name', 'description']);
            return projectRes;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Update project by project_id
     */
    async updateProject(params: Record<string, any>, projectData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            const { _id } = params;
            const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id });
            if (!project) {
                logger.error(appConstant.LOG_MESSAGES.UPDATE_PROJECT + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            if (_.isNil(projectData.project_name)) {
                throw new Error(appConstant.MESSAGES.PROJECT_NAME_NULL);
            }
            const projectDuplicate: any = await findByProjectName(appConstant.SCHEMA.OWNER_CLASS, projectData.project_name, tokenData.tenant_id);
            if (projectDuplicate && projectDuplicate._id != _id) {
                logger.error(appConstant.LOG_MESSAGES.UPDATE_PROJECT + appConstant.ERROR_MESSAGES.DUPLICATE);
                throw new Error(appConstant.ERROR_MESSAGES.DUPLICATE);
            }
            const updateData = {
                name: projectData.project_name,
                description: projectData.description,
                updated_by_user_id: tokenData._id,
                updated_at: new Date()
            };
            const projectRes = await updateProject(appConstant.SCHEMA.OWNER_CLASS, _id, updateData);
            return projectRes;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     *  Delete project by project_id - soft delete
     */
    async deleteProject(params: Record<string, any>, tokendata: Record<string, any>): Promise<string> {
        try {
            const { _id } = params;
            const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id });
            if (!project) {
                logger.error(appConstant.LOG_MESSAGES.DELETE_PROJECT + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            const updateFields = {
                status: appConstant.SCHEMA.STATUS_INACTIVE,
                updated_at: new Date(),
                updated_by_user_id: tokendata._id
            }
            await deleteProject(appConstant.SCHEMA.OWNER_CLASS, _id, updateFields);
            return appConstant.MESSAGES.DELETE_PROJECT;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Create application with save image as azure
     */
    async applicationCreate(appData: Record<string, any>, imgFile: Record<string, any>, tokenData: Record<string, any>): Promise<Record<string, any>> {
        try {
            const { project_id, app_name, description } = appData;
            const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id: project_id });
            if (!project) {
                logger.error(appConstant.LOG_MESSAGES.CREATE_APP + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            if (_.isNil(app_name)) {
                throw new Error(appConstant.MESSAGES.APP_NAME_NULL)
            }
            const applicationDuplicate = await findByApplicationName(appData.app_name, appData.project_id);
            if (applicationDuplicate) {
                logger.error(appConstant.LOG_MESSAGES.CREATE_APP + appConstant.ERROR_MESSAGES.DUPLICATE);
                throw new Error(appConstant.ERROR_MESSAGES.DUPLICATE);
            }
            const application = {
                project_id,
                app_name,
                description,
                app_img: null,
                blob_Name: '',
                tenant_group_id: tokenData.tenant_group_id,
                tenant_id: tokenData.tenant_id,
                created_by_user_id: tokenData._id,
                updated_by_user_id: tokenData._id
            };
            // If image is present then save image to Azure
            if (imgFile.File) {
                if (imgFile.File.mimetype === 'image/jpeg' || imgFile.File.mimetype === 'image/jpg') {
                    const blobName = Date.now().toString() + '-' + imgFile.File.originalFilename;
                    const blobUrl = await azureImage.saveImage(imgFile, blobName);
                    application.app_img = blobUrl;
                    application.blob_Name = blobName;
                } else {
                    logger.info(appConstant.LOG_MESSAGES.INVALID_IMAGE);
                    throw new Error(appConstant.ERROR_MESSAGES.INVALID_IMAGE);
                }
            }
            const result = await applicationCreate(application)
            const isMapped = await findByProjectUserMapFields({ project_id });
            if (isMapped) {
                logger.info(appConstant.LOG_MESSAGES.APPLICATION_USER_MAP);
                let user_ids = isMapped.users_mapping.map((user) => {
                    if (appConstant.ROLES.includes(user.role_name)) {
                        return user.user_id;
                    }
                });
                if (user_ids){
                    user_ids = user_ids && user_ids.filter(Boolean);
                    const applicationUserMap = {
                        application_id: result._id,
                        user_id: user_ids
                    };
                    await findAndUpdateAppNewUser(project_id, applicationUserMap);
                }
            }
            return result;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Update application with save image as azure or remove image
     */
    async applicationUpdate(params: Record<string, any>, appData: Record<string, any>, imgFile: Record<string, any>, tokenData: Record<string, any>, query: any) {
        try {
            const { _id } = params
            const application = await findByApplicationFields({ _id });
            if (!application) {
                logger.error(appConstant.LOG_MESSAGES.UPDATE_APP + appConstant.MESSAGES.APP_NOT_FOUND)
                throw new Error(appConstant.MESSAGES.APP_NOT_FOUND);
            }
            if (_.isNil(appData.app_name)) {
                throw new Error(appConstant.MESSAGES.APP_NAME_NULL)
            }
            const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id: appData.project_id });
            if (!project) {
                logger.error(appConstant.LOG_MESSAGES.UPDATE_APP + appConstant.MESSAGES.PROJECT_NOT_FOUND)
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            const applicationDuplicate = await findByApplicationName(appData.app_name, appData.project_id);
            if (applicationDuplicate && applicationDuplicate._id != _id) {
                logger.error(appConstant.LOG_MESSAGES.UPDATE_APP + appConstant.ERROR_MESSAGES.DUPLICATE)
                throw new Error(appConstant.ERROR_MESSAGES.DUPLICATE);
            }
            const applicationUpdate: Record<string, any> = {
                app_name: appData.app_name,
                description: appData.description,
                updated_at: new Date(),
                updated_by_user_id: tokenData._id,
                ...(appData.imageremove && {
                    app_img: null,
                    blob_Name: null
                })
            };
            // If image is present then save image to Azure
            if (imgFile.File) {
                if (imgFile.File.mimetype === 'image/jpeg' || imgFile.File.mimetype === 'image/jpg') {
                    const blobName = Date.now().toString() + '-' + imgFile.File.originalFilename;
                    const blobUrl = await azureImage.saveImage(imgFile, blobName);
                    applicationUpdate.app_img = blobUrl;
                    applicationUpdate.blob_Name = blobName;
                } else {
                    logger.info(appConstant.LOG_MESSAGES.INVALID_IMAGE);
                    throw new Error(appConstant.ERROR_MESSAGES.INVALID_IMAGE);
                }
            }
            if (appData.imageremove) {
                await azureImage.deleteImage(application);
            }
            return await updateApplication(_id, applicationUpdate);
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     *  Delete application by _id - soft delete
     */
    async applicationDelete(params: Record<string, any>, tokendata: Record<string, any>): Promise<string> {
        try {
            const { _id } = params;
            const application: any = await findByApplicationFields({ _id });
            if (!application) {
                logger.error(appConstant.LOG_MESSAGES.DELETE_APP + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.APPLICATION_NOT_FOUND);
            }
            await deleteApplication(_id, {
                status: appConstant.SCHEMA.STATUS_INACTIVE,
                updated_at: new Date(),
                updated_by_user_id: tokendata._id
            });
            return appConstant.MESSAGES.DELETE_APP;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
    * Get all active Application
    */
    async getAllApplication(tokenData: Record<string, any>, params: Record<string, any>): Promise<Record<string, any>> {
        try {
            const { _id } = params;
            return await findAllApplication({
                status: appConstant.SCHEMA.STATUS_ACTIVE,
                tenant_id: tokenData.tenant_id,
                project_id: _id
            });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_ALL_APP_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Get project Info by project_id
     */
    async getApplicationInfo(params: Record<string, any>, tokenData: Record<string, any>, req:any): Promise<Record<string, any> | any> {
        try {
            const application:any = await findByApplicationFields({
                _id: params._id,
                tenant_id: tokenData.tenant_id,
                status: appConstant.SCHEMA.STATUS_ACTIVE
            });
            if (!application) {
                logger.error(`${appConstant.LOG_MESSAGES.GET_INFO_APP} ${appConstant.MESSAGES.APP_NOT_FOUND}`);
                throw new Error(appConstant.MESSAGES.APP_NOT_FOUND);
            }
            const appUsers: any = await getAppUsers({ "application.application_id": params._id });
            let confirmedUsers;
            if (!_.isNil(appUsers)){
                const usersIds:any = await appUsers && appUsers.application.find((app: any) => { if (app.application_id == params._id) {return app.user_id }});
                const usersList = await otherService.usersList(req, usersIds.user_id);
                if(usersList?.error){
                    throw new Error(usersList.error); 
                }
                confirmedUsers = await usersList.filter((user:any) => user.status === appConstant.USER_STATUS.STATUS_CONFIRMED);
            }
            const updatedDate = await dateConvert.dateConvertor(application.updated_at, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
            const applicationInfo = {
                _id: application._id,
                application_name: application.app_name,
                description: application.description,
                updated_at: updatedDate,
                app_img: application.app_img,
                user_count: (confirmedUsers?.length || 0) + 1
            };
            return applicationInfo;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_ALL_APP_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * The below function is used to update/create the user-project-mapping collection
     */
    async projectUserMapUpdate(projectData: Record<string, any>, tokenData: Record<string, any>, query: Record<string, any>, req: any) {
        try {
            const { user_id, projectdtl } = projectData;
            let { action_type } = query;
            action_type = _.isNil(action_type) ? appConstant.AUDIT_TRAIL.CREATE : appConstant.AUDIT_TRAIL.CREATE;
            const auditTrailActivity: any[] = [];
            const projectBulkWriteValue: any[] = [];
            const removeUser: any[] = [];
            let WorkloadAdminUpdate: { updateOne: { filter: { project_id: any; }; update: { $pull: { users_mapping: { user_id: any; }; }; }; }; }[] = [];
            for (let { project_id, role_id, isActive, role_name } of projectdtl) {
                role_name = {
                    [appConstant.ROLES_SPACE.Project_Admin]: appConstant.ROLES[0],
                    [appConstant.ROLES_SPACE.Infra_Admin]: appConstant.ROLES[1],
                    [appConstant.ROLES_SPACE.View_Only]: appConstant.ROLES[2],
                    [appConstant.ROLES_SPACE.Workload_Admin]: appConstant.WORKLOAD_ADMIN
                }[role_name] || role_name;
                const insert = { insertOne: { document: {} } };
                const update = { updateOne: { filter: {}, update: {} } };
                const projectDetail = await findByProjectFields({ _id: project_id });
                if (_.isNil(projectDetail)) {
                    continue;
                }
                const { project_name } = projectDetail;
                if (!isActive) {
                    update.updateOne.filter = { project_id };
                    update.updateOne.update = { $pull: { users_mapping: { user_id } } };
                    await updateProject(appConstant.SCHEMA.OWNER_CLASS, project_id, { $pull: { members: user_id } });
                    removeUser.push({ project_id, user_id });
                    projectBulkWriteValue.push(update);
                    auditTrailActivity.push({ project_id, project_name, activity: appConstant.AUDIT_TRAIL.PROJECT_MAP_REMOVED })
                } else {
                    if (role_id != undefined) {
                        const project = await findByProjectUserMapFields({ project_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
                        const projectUserMap = {
                            user_id,
                            role_id,
                            role_name,
                            created_by_user_id: tokenData._id,
                            updated_by_user_id: tokenData._id
                        };
                        if (project) {
                            const user = project.users_mapping.some((ele) => {
                                const removedUser = removeUser.some((ele: any) => { return ele.user_id == user_id && ele.project_id == project_id })
                                return ele.user_id == user_id && !removedUser
                            });
                            if (!user) {
                                update.updateOne.filter = { project_id };
                                update.updateOne.update = { $push: { users_mapping: projectUserMap } };
                                projectBulkWriteValue.push(update);
                                auditTrailActivity.push({ project_id, project_name, activity: appConstant.AUDIT_TRAIL.PROJECT_MAP_UPDATED });
                                await updateProject(appConstant.SCHEMA.OWNER_CLASS, project_id, { $push: { members: user_id } });
                            } else {
                                if (role_name === appConstant.WORKLOAD_ADMIN) {
                                    const update = { updateOne: { filter: { project_id }, update: { $pull: { users_mapping: { user_id } } } } };
                                    WorkloadAdminUpdate.push(update);
                                }
                                const updateProjectUser = {
                                    user_id,
                                    role_id,
                                    role_name,
                                    updated_by_user_id: tokenData._id,
                                    updated_at: new Date()
                                }
                                update.updateOne.filter = { project_id, 'users_mapping.user_id': user_id };
                                update.updateOne.update = { $set: { 'users_mapping.$': updateProjectUser } };
                                projectBulkWriteValue.push(update);
                                auditTrailActivity.push({ project_id, project_name, activity: appConstant.AUDIT_TRAIL.PROJECT_MAP_UPDATED });
                            }
                        } else {
                            const projectUserMapData = {
                                tenant_id: tokenData.tenant_id,
                                tenant_group_id: tokenData.tenant_group_id,
                                project_id,
                                users_mapping: [projectUserMap],
                                created_by_user_id: tokenData._id,
                                updated_by_user_id: tokenData._id
                            };
                            insert.insertOne.document = projectUserMapData;
                            projectBulkWriteValue.push(insert);
                            auditTrailActivity.push({ project_id, project_name, activity: appConstant.AUDIT_TRAIL.PROJECT_MAP_CREATED });
                            await updateProject(appConstant.SCHEMA.OWNER_CLASS, project_id, { $push: { members: user_id } });
                        }
                    }
                }
            }
            const projectMapIds = await projectBulkWrite(projectBulkWriteValue);
            const applicationMapIds = await this.applicationUserMapCreate(projectData, tokenData, projectMapIds);
            logger.info(appConstant.LOG_MESSAGES.USER_MAP_WORKLOAD_CALLED);
            await otherService.workloadUserMap(req, projectData, applicationMapIds).then(async (response) => {
                if (response?.error) {
                    throw new Error(response.error);
                }
                const bulkRemove: any[] = [];
                if (response.data && response.data.length > 0) {
                    await response.data.map(async (ele: any) => {
                        const removeProject = WorkloadAdminUpdate.find((obj) => { return obj.updateOne.filter.project_id === ele.project_id });
                        if (!_.isNil(removeProject)) {
                            bulkRemove.push(removeProject);
                        }
                    });
                }
                if (bulkRemove && bulkRemove.length > 0) {
                    await projectBulkWrite(bulkRemove);
                }
                const auditTrail = {
                    user_id,
                    type: action_type,
                    activity: auditTrailActivity,
                    audit_trail_by: tokenData._id
                }
                await auditTrailCreate(auditTrail);
                return appConstant.MESSAGES.USER_PROJECT_MAP;
            }).catch((error: any) => { throw new Error(error) });
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_MAP_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * The below function is used to update/create the user-application-mapping collection
     */
    async applicationUserMapCreate(projectData: Record<string, any>, tokenData: Record<string, any>, projectMapIds: any) {
        try {
            const { user_id, projectdtl } = projectData;
            const applicationBulkWriteValues: any[] = [];
            const applicationMapIds: any[] = [];
            let projectIndex = 0;
            const removeUser: any[] = [];
            const insertProject:any[]=[];
            for (const project of projectdtl) {
                let { project_id, appdtl, role_id, role_name, isActive } = project;
                role_name = {
                    [appConstant.ROLES_SPACE.Project_Admin]: appConstant.ROLES[0],
                    [appConstant.ROLES_SPACE.Infra_Admin]: appConstant.ROLES[1],
                    [appConstant.ROLES_SPACE.View_Only]: appConstant.ROLES[2],
                    [appConstant.ROLES_SPACE.Workload_Admin]: appConstant.WORKLOAD_ADMIN
                }[role_name] || role_name;
                const projectDetail = await findByProjectFields({ _id: project_id });
                if (_.isNil(projectDetail)) {
                    continue;
                }
                if (role_id != undefined) {
                    if (appConstant.ROLES.includes(role_name) || appdtl.length === 0) {
                        const application_ids: any = [];
                        if (role_name == appConstant.ROLES[1] && appdtl.length > 0) {
                            appdtl.map((ele: any) => {
                                application_ids.push(ele.application_id)
                            })
                        }
                        const conditions = {
                            project_id,
                            status: appConstant.SCHEMA.STATUS_ACTIVE
                        }
                        const applications = await findAllApplication(conditions);
                        applications.map((ele) => {
                            if (!application_ids.includes(ele._id)) {
                                appdtl.push({ application_id: ele._id, isActive: isActive })
                            }
                        })
                    }
                    let isProjectExist:any = await findByApplicationUserMapFields({ project_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
                    for (const app of appdtl) {
                        if(!isProjectExist && insertProject.length > 0){
                            isProjectExist= insertProject.find((ele:any)=> ele.project_id === project_id);
                        }
                        const insert = { insertOne: { document: {} } };
                        const updateOne = { updateOne: { filter: {}, update: {} } };
                        const { application_id, isActive } = app;
                        if (!isActive) {
                            updateOne.updateOne.filter = { project_id, 'application.application_id': application_id };
                            updateOne.updateOne.update = { $pull: { 'application.$.user_id': user_id } };
                            removeUser.push({ user_id, application_id });
                            applicationBulkWriteValues.push(updateOne);
                        } else {
                            const project_user_map_id: string = projectMapIds.insertedIds[projectIndex.toString()];
                            if (isProjectExist) {
                                const applicationExists = isProjectExist.application.some((ele: any) => { return ele.application_id == application_id });
                                if (applicationExists) {
                                    const removedUser = removeUser && removeUser.some(ele => ele.user_id == user_id && ele.application_id == application_id);
                                    let isUserExists;
                                    if (removedUser) {
                                        isUserExists = false;
                                    } else {
                                        isUserExists = isProjectExist.application.some((ele: any) => { return ele.application_id == application_id && ele.user_id.includes(user_id) });
                                    }
                                    if (!isUserExists) {
                                        const filter = { project_id, "application.application_id": application_id };
                                        const update = { $push: { "application.$.user_id": user_id } };
                                        updateOne.updateOne.filter = filter;
                                        updateOne.updateOne.update = update;
                                        applicationBulkWriteValues.push(updateOne);
                                    }
                                } else {
                                    const appUserMap = {
                                        user_id: [user_id],
                                        application_id
                                    };
                                    const filter = { project_id };
                                    const update = { $push: { application: appUserMap } };
                                    updateOne.updateOne.filter = filter;
                                    updateOne.updateOne.update = update;
                                    applicationBulkWriteValues.push(updateOne);
                                }
                            } else {
                                const appUserMap = {
                                    tenant_id: tokenData.tenant_id,
                                    tenant_group_id: tokenData.tenant_group_id,
                                    project_id,
                                    project_user_map_id: project_user_map_id,
                                    application: [{
                                        user_id,
                                        application_id
                                    }],
                                    created_by_user_id: tokenData._id,
                                    updated_by_user_id: tokenData._id
                                };
                                projectIndex++;
                                insert.insertOne.document = appUserMap;
                                applicationBulkWriteValues.push(insert);
                                insertProject.push(appUserMap)
                                // const appRes: any = await applicationUserCreate(appUserMap);
                                // isProjectExist = appRes;
                                // applicationMapIds.push(appRes?._id);
                            }
                        }
                    }
                }
            }
            await applicationBulkWrite(applicationBulkWriteValues);
            logger.info(appConstant.LOG_MESSAGES.USER_MAP_WORKLOAD_CALLED);
            return applicationMapIds;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_MAP_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * The below function is used for get the project based on user id
     */
    async getProjectByUserId(userId: any): Promise<any> {
        try {
            const query = [
                {
                    $match: {
                        "users_mapping.user_id": userId,
                        status: appConstant.SCHEMA.STATUS_ACTIVE
                    },
                },
                {
                    $addFields: {
                        users_mapping: {
                            $filter: {
                                input: "$users_mapping",
                                as: "mapping",
                                cond: {
                                    $eq: [
                                        "$$mapping.user_id", userId,
                                    ],
                                },
                            },
                        },
                    },
                },
                { $unwind: "$users_mapping" },
                {
                    $lookup: {
                        from: "owner",
                        localField: "project_id",
                        foreignField: "_id",
                        as: "project",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        project_id: 1,
                        project: { $arrayElemAt: ["$project", 0] },
                        users_mapping: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        project_id: 1,
                        "project.name": 1,
                        "project.description": 1,
                        users_mapping: 1,
                    },
                },
            ]
            const result = await ProjectUser.aggregate(query).exec();
            return result;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_MAP_FAILED} ${error.message}`);
            throw error;
        }
    }

    /**
     * The below function is used for get the application based on user id and user project map id
     */
    async getAppByUserId(user_id: any, project_id: any) {
        try {
            const query = [
                {
                    $match: {
                        "application.user_id": user_id,
                        project_id: project_id,
                        status: "Active",
                    },
                },
                {
                    $project: {
                        application: {
                            $filter: {
                                input: "$application",
                                as: "app",
                                cond: {
                                    $in: [
                                        user_id,
                                        "$$app.user_id",
                                    ],
                                },
                            },
                        },
                        project_id: 1,
                        project_user_map_id: 1,
                    },
                },
                {
                    $lookup: {
                        from: "application",
                        localField: "application.application_id",
                        foreignField: "_id",
                        as: "application",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        project_id: 1,
                        "application._id": 1,
                        "application.app_name": 1,
                        "application.description": 1,
                        "application.app_img": 1,
                        project_user_map_id: 1,
                        "application.status": 1,
                    },
                },
            ];
            const result = await ApplicationUser.aggregate(query).exec();
            return result;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_MAP_FAILED} ${error.message}`);
            throw error; 
        }
    }

    /**
     * The below function is used for get project users id 
     */
    async getProjectUser(params: any) {
        try {
            const { project_id } = params;
            const isProjectExist = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id: project_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
            if (isProjectExist) {
                const projectUser: any = await findByProjectUserMapFields({
                    project_id,
                    status: appConstant.SCHEMA.STATUS_ACTIVE
                });
                if (projectUser) {
                    const userRole = projectUser?.users_mapping.map(({ user_id, role_id }: { user_id: string, role_id: string }) => ({ user_id, role_id }));
                    return userRole;
                } else {
                    return projectUser
                }
            } else {
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_PROJECT_USER_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * The below function is used for get project users id 
     */
    async checkUserRoleMap(data: any) {
        try {
            let roleMap: boolean[] = [];
            for (const user of data) {
                const { _id, user_type } = user;
                if (user_type != 'A') {
                    const roleMapped = await findByProjectUserMapFields({ "users_mapping.user_id": _id });
                    if (roleMapped) {
                        roleMap.push(false)
                    } else {
                        roleMap.push(true)
                    }
                } else {
                    roleMap.push(false)
                }
            }
            return roleMap;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CHECK_USER_ROLE_MAP_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to get regions
     */
    async getRegions(req: any, tokenData: Record<string, any>): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOG_MESSAGES.SERVICE + appConstant.LOG_MESSAGES.GET_REGION);
            const { project_id, project_name } = JSON.parse(JSON.stringify(req.body.project_id));
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
                    if (ele.user_id === tokenData._id && ele.project_id === project_id) {
                        if (ele.created_at) {
                            const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                            const diffMinutes = diffDuration.minutes();
                            const diffHours = diffDuration.hours();
                            const diffDays = diffDuration.days();
                            if ( diffHours <= 7 && diffDays === 0) {
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
                    org: project_name,
                    password: "",
                    ttl: 0
                };
                const token = await new ProjectService().checkMistTokenAvail(userData, req, tokenData, project_id).catch((error: any) => { throw new Error(error) });
                foundUserToken = { mistToken: token.token };
            }
            const getRegions = await otherService.getRegionsMist(req, foundUserToken).catch((error: any) => { throw new Error(error) });
            if(getRegions?.error){
                throw new Error(getRegions.error); 
            }
            return JSON.parse(JSON.stringify(getRegions));
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_REGIONS_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }


    /**
     * The below function is check if the useer has already generated a mist token if not generate a new one
     */
    async generateAuthTokenMistApi(userData: Record<string, any>, req: any, tokenData: Record<string, any>, project_id: string) {
        const redisClient = new IORedis({
            host: process.env.REDIS_SERVER_IP,
            port: process.env.REDIS_SERVER_PORT,
            password: process.env.REDIS_PASSWORD,
            db: process.env.REDIS_SERVER_DEFAULT_DB,
        });
        try {
            let finalResponse;
            await redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, async (getError: any, currentData: any) => {
                if (getError) {
                    console.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                    throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                } else {
                    // Parse the current data from Redis into an array or initialize an empty array
                    const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
                    if (tokenDetailsArray != undefined && tokenDetailsArray.length > 0) {
                        const foundUserToken = tokenDetailsArray.find(async (ele: any) => {
                            if (ele.user_id === tokenData._id && ele.project_id === project_id) {
                                if (ele.created_at) {
                                    const diffDuration = await dateConvert.dateDifference(ele.created_at, tokenData.time_zone);
                                    const diffMinutes = diffDuration.minutes();
                                    const diffHours = diffDuration.hours();
                                    const diffDays = diffDuration.days();
                                    if ( diffHours <= 7 && diffDays === 0) {
                                        return ele;
                                    }
                                }
                            }
                        });
                        if (foundUserToken != undefined) {
                            finalResponse = appConstant.MESSAGES.MIST_AUTH_TOKEN_FOUND;
                        } else {
                            await new ProjectService().checkMistTokenAvail(userData, req, tokenData, project_id).catch((error: any) => { throw new Error(error) });
                            finalResponse = appConstant.MESSAGES.MIST_AUTH_TOKEN_SAVED;
                        }
                    } else {
                        await new ProjectService().checkMistTokenAvail(userData, req, tokenData, project_id).catch((error: any) => { throw new Error(error) });
                        finalResponse = appConstant.MESSAGES.MIST_AUTH_TOKEN_SAVED;
                    }
                }
            });
            return finalResponse
        } catch (error: any) {
            logger.error(`${appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED} ${error.message}`);
            throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
        }
    }

    /**
     * The below function is used to generate a new token and save it in express session
     */
    async checkMistTokenAvail(userData: Record<string, any>, req: any, tokenData: Record<string, any>, project_id: string) {
        try {
            logger.info(appConstant.LOG_MESSAGES.MIST_TOKEN_GENERATION_SERVICE);
            const responseData = await otherService.generateAuthTokeMist(req, userData).catch((error: any) => { throw new Error(error) });
            if(responseData?.error){
                throw new Error(responseData.error); 
            }
            // Create an object with the token details
            const tokenDetails = {
                project_id: project_id,
                mistToken: responseData.token,
                user_id: tokenData._id,
                created_at: new Date()
            };
            // Fetch the current tokenDetails array from Redis
            const currentData: any = await new Promise((resolve, reject) => {
                redisClient.get(appConstant.REDIS_MIST_TOKEN_KEYNAME, (getError: any, data: string) => {
                    if (getError) {
                        logger.error(appConstant.ERROR_MESSAGES.ERROR_FETCHING_TOKEN_DETAILS, getError);
                        reject(new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED));
                    } else {
                        resolve(data);
                    }
                });
            }).catch((error: any) => { throw new Error(error) });
            // Parse the current data from Redis into an array or initialize an empty array
            const tokenDetailsArray = currentData ? JSON.parse(currentData) : [];
            const newTokenDetailsArray = tokenDetailsArray.filter((item: any) => item.project_id !== project_id);
            // Push the new token details into the array
            newTokenDetailsArray.push(tokenDetails);
            // Store the updated array in Redis
            const updatedTokenDetailsString = JSON.stringify(newTokenDetailsArray);
            await new Promise((resolve, reject) => {
                redisClient.set(appConstant.REDIS_MIST_TOKEN_KEYNAME, updatedTokenDetailsString, (setError: any, setResult: any) => {
                    if (setError) {
                        console.error(appConstant.ERROR_MESSAGES.ERROR_STORING_TOKEN_DETAILS, setError);
                        reject(setError)
                        throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
                    } else {
                        console.log(appConstant.MESSAGES.TOEKN_DETAILS_STORED_SUCCESSFULLY, setResult);
                        logger.info(appConstant.LOG_MESSAGES.MIST_TOKEN_OTHER_SERVICE_COMPLETED);
                        resolve(setResult)
                    }
                });
            }).catch((error: any) => { throw new Error(error) });
            return responseData;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.USER_GET_FAILED} ${error.message}`);
            throw new Error(appConstant.ERROR_MESSAGES.MIST_TOKEN_FAILED);
        }
    }


    /*
     * Mist Validate cloud credential 
     */
    async verifyCloudCredntial(projectData: Record<string, any>, foundUserToken: any, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOG_MESSAGES.SERVICE + appConstant.LOG_MESSAGES.MIST_CONNECTION_VALIDATE);
            // service call for validate the mist token
            const responseData = await otherService.verifyCloudCredntial(projectData, foundUserToken).catch((error: any) => { throw new Error(error) });
            if(responseData?.error){
                throw new Error(responseData.error); 
            }
            logger.info(appConstant.LOG_MESSAGES.MIST_CONNECTION_COMPLETED);
            return responseData;
        } catch (error: any) {
            logger.error(`${appConstant.ERROR_MESSAGES.CLOUD_CRED_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Cloud Onboard Create service
     */
    async createCloudAccount(requestData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_SERVICE_STARTED);
            const accountAlreadyExist = await findCloudAccountByFields({ title: requestData.account_name, owner: requestData.owner, _cls: requestData._cls });
            if (accountAlreadyExist) {
                throw new Error(appConstant.ERROR_MESSAGES.CLOUD_DUPLICATE_ACCOUNT)
            } else {
                requestData.created_by = tokenData._id;
                requestData.owned_by = tokenData._id;
                requestData.app_tenant_id = tokenData.tenant_id;
                requestData.app_tenant_group_id = tokenData.tenant_group_id;
                requestData.created_at = new Date();
                if (requestData._cls == appConstant.CLOUD_PROVIDER.AWS) {
                    Object.assign(requestData, appConstant.CLOUD_REQUEST_AWS);
                    requestData.region = requestData.opted_regions[0];
                }
                if (requestData._cls == appConstant.CLOUD_PROVIDER.AZURE) {
                    requestData._cls = appConstant.CLOUD_PROVIDER.AZURE;
                }
                const responseData = await cloudOnboardCreate(requestData);
                logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_SERVICE_COMPLETED)
                return responseData;
            }

        } catch (error: any) {
            logger.error(`${appConstant.ERROR_MESSAGES.CLOUD_ONBOARD_FAILED} ${error.message}`);

            throw new Error(error.message);
        }
    }

    /**
     * Cloud Onboard Update service 
     */
    async updateCloudAccount(requestData: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_EDIT_SERVICE_STARTED);
            const dynamicFields = {
                _id: requestData._id,
                title: requestData.account_name,
            }
            if (requestData._cls == appConstant.CLOUD.AWS) {
                requestData.region = requestData.opted_regions[0];
            }
            delete requestData._cls;
            const responseData = await findCloudAccountAndUpdate(dynamicFields, requestData);
            logger.info(appConstant.LOG_MESSAGES.CLOUD_ONBOARD_EDIT_SERVICE_COMPLETED)
            return responseData;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    async getCloudDetails(params: any, tokenData: Record<string, any>, queryParams: Record<string, any>) {
        try {
            logger.info(`${appConstant.LOG_MESSAGES.GET_CLOUD_SERVICE_STARTED}`);
            const { _id } = params;
            const cloudDetails = await findCloudAccountByFields({ _id: _id });
            const finalResponse = {
                _id: cloudDetails?._id,
                _cls: cloudDetails?._cls,
                cluster_count: cloudDetails?.cluster_count,
                container_enabled: cloudDetails?.container_enabled,
                created_by: cloudDetails?.created_by,
                dns_enabled: cloudDetails?.dns_enabled,
                enabled: cloudDetails?.enabled,
                machine_count: cloudDetails?.machine_count,
                object_storage_enabled: cloudDetails?.object_storage_enabled,
                observation_logs_enabled: cloudDetails?.observation_logs_enabled,
                owned_by: cloudDetails?.owned_by,
                owner: cloudDetails?.owner,

                polling_interval: cloudDetails?.polling_interval,
                region: cloudDetails?.region,
                starred: cloudDetails?.starred,
                title: cloudDetails?.title,
                unstarred: cloudDetails?.unstarred,
                account_type: cloudDetails?.account_type,
                access_type: cloudDetails?.access_type,
                environment: cloudDetails?.environment,
                authentication_protocol: cloudDetails?.authentication_protocol,
                bucket_name: cloudDetails?.bucket_name,
                cost_report_format_fields: cloudDetails?.cost_report_format_fields,
                discovery_status: cloudDetails?.discovery_status,
                discovery_progress_percentage: cloudDetails?.discovery_progress_percentage,
                discovery_date: cloudDetails?.discovery_date,
                opted_regions: cloudDetails?.opted_regions,
                created_at: cloudDetails?.created_at,
                discovery_locked: false,
                ...(!queryParams.discovery_refresh && {
                    apikey: cloudDetails?.apikey,
                    apisecret: cloudDetails?.apisecret,
                    key: cloudDetails?.key,
                    secret: cloudDetails?.secret,
                    subscription_type: cloudDetails?.subscription_type,
                    subscription_id: cloudDetails?.subscription_id,
                    tenant_id: cloudDetails?.tenant_id,
                })
            }
            if (finalResponse?.discovery_date) {
                const diffDuration = await dateConvert.dateDifference(finalResponse.discovery_date, tokenData.time_zone);
                const diffMinutes = diffDuration.minutes();
                const diffHours = diffDuration.hours();
                const diffDays = diffDuration.days();
                if (diffMinutes <= 30 && diffHours == 0 && diffDays == 0) {
                    finalResponse.discovery_locked = true
                }
                finalResponse.discovery_date = await dateConvert.dateConvertor(finalResponse.discovery_date, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
            }
            if (finalResponse?.created_at) {
                finalResponse.created_at = await dateConvert.dateConvertor(finalResponse.created_at, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
            }
            logger.info(`${appConstant.LOG_MESSAGES.GET_CLOUD_SERVICE_COMPLETED}`);
            return finalResponse;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * This below function is used to get regions
     */
    async cloudUsersCount(params: Record<string, any>, tokenData: any): Promise<Record<string, any>> {
        try {
            logger.info(appConstant.LOG_MESSAGES.SERVICE + appConstant.LOG_MESSAGES.CLOUD_COUNT_SERVICE);
            const { project_id } = params;
            const cloudCount: any = {
                aws: 0,
                azure: 0,
                gcp: 0,
                oci: 0,
            };
            const project = await findByProjectFields({ _cls: appConstant.SCHEMA.OWNER_CLASS, _id: project_id, tenant_id: tokenData.tenant_id, status: appConstant.SCHEMA.STATUS_ACTIVE });
            if (!project) {
                logger.error(appConstant.LOG_MESSAGES.PROJECT_INFO + appConstant.MESSAGES.PROJECT_NOT_FOUND);
                throw new Error(appConstant.MESSAGES.PROJECT_NOT_FOUND);
            }
            const count = await findAll({ _cls: { $in: [appConstant.CLOUD_PROVIDER.AZURE, appConstant.CLOUD_PROVIDER.AWS, appConstant.CLOUD_PROVIDER.GCP, appConstant.CLOUD_PROVIDER.OCI] }, owner: project_id });
            count.forEach((item: any) => {
                switch (item._cls) {
                    case appConstant.CLOUD_PROVIDER.AZURE:
                        cloudCount.azure++;
                        break;
                    case appConstant.CLOUD_PROVIDER.AWS:
                        cloudCount.aws++;
                        break;
                    case appConstant.CLOUD_PROVIDER.GCP:
                        cloudCount.gcp++;
                        break;
                    case appConstant.CLOUD_PROVIDER.OCI:
                        cloudCount.oci++;
                        break;
                    default:
                        break;
                }
            });
            for (const key in cloudCount) {
                if (cloudCount[key] === 0) {
                    delete cloudCount[key];
                }
            }
            return cloudCount;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.CLOUD_USER_COUNT_FAILED} ${error.message}`);
            throw new Error(error.message)
        }
    }

    async cloudUserList(req: any, queryParams: Record<string, any>, tokenData: Record<string, any>) {
        try {
            logger.info(appConstant.LOG_MESSAGES.SERVICE + appConstant.LOG_MESSAGES.CLOUD_USER_LIST);
            let { project_id, cloud_name, sort, limit, page, search, orderBy } = queryParams;
            cloud_name = {
                [appConstant.CLOUD.AWS]: appConstant.CLOUD_PROVIDER.AWS,
                [appConstant.CLOUD.AZURE]: appConstant.CLOUD_PROVIDER.AZURE,
                [appConstant.CLOUD_PROVIDER.GCP]: appConstant.CLOUD_PROVIDER.GCP,
                [appConstant.CLOUD_PROVIDER.OCI]: appConstant.CLOUD_PROVIDER.OCI
            }[cloud_name] || cloud_name;
            const filter = { owner: project_id, _cls: cloud_name, app_tenant_id: tokenData.tenant_id, app_tenant_group_id: tokenData.tenant_group_id };
            let total_users: number = await cloudUserCount(filter);
            const apiFilters = new ApiFilters(findAll(filter), req.query)
                .filter()
                .pagination();
            let cloudAccount = await apiFilters.query;
            if (_.isNil(cloudAccount)) {
                return { total_users, user_list: cloudAccount }
            }
            const userIds = await Promise.all([...new Set(cloudAccount.map((cloud: any) => cloud.owned_by))]);
            const userList = await otherService.usersList(req, userIds);
            if(userList?.error){
                throw new Error(userList.error); 
            }
            if (userList) {
                let cloudUsersList: any[] = [];
                for (const ele of cloudAccount) {
                    const { title, account_type, enabled, owned_by, discovery_date, created_at, discovery_status, discovery_progress_percentage } = ele;
                    const user = await userList.find((user: any) => { return user._id == owned_by });
                    if (_.isNil(user)) {
                        continue;
                    }
                    const { first_name, last_name, email, user_img, } = user;
                    const modifiedUser: any = {
                        _id: ele._id,
                        account: title,
                        user_id: user._id,
                        user_name: _.isNil(last_name) ? first_name : `${first_name} ${last_name}`,
                        email,
                        user_img: _.isNil(user_img) ? null : user_img,
                        status: enabled ? appConstant.SCHEMA.STATUS_ACTIVE : appConstant.SCHEMA.STATUS_INACTIVE,
                        created_at,
                        discovery_status,
                        discovery_date,
                        discovery_progress_percentage,
                        discovery_locked: false
                    };
                    if (cloud_name === appConstant.CLOUD_PROVIDER.AWS) {
                        modifiedUser.account_type = account_type;
                    }
                    if (created_at) {
                        modifiedUser.created_at = await dateConvert.dateConvertor(created_at, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                    }
                    if (discovery_date) {
                        const diffDuration = await dateConvert.dateDifference(discovery_date, tokenData.time_zone);
                        const diffMinutes = diffDuration.minutes();
                        const diffHours = diffDuration.hours();
                        const diffDays = diffDuration.days();
                        if (diffMinutes <= 30 && diffHours == 0 && diffDays == 0) {
                            modifiedUser.discovery_locked = true
                        }
                        modifiedUser.discovery_date = await dateConvert.dateConvertor(discovery_date, tokenData.time_zone, appConstant.DATE_FORMAT.USER_DATE_FORMAT);
                    }
                    // Check if the search query matches the firstname, lastname, or role
                    const isMatchingUserName = search && modifiedUser?.user_name?.toLowerCase().includes(search.toLowerCase());
                    const isMatchingAccount = search && modifiedUser?.account?.toLowerCase().includes(search.toLowerCase());
                    const isMatchingCreatedAt = search && modifiedUser?.created_at?.toLowerCase().includes(search.toLowerCase());
                    const isMatchingAccountType = search && modifiedUser?.account_type?.toLowerCase().includes(search.toLowerCase());
                    const isMatchingStatus = search && modifiedUser?.status?.toLowerCase().includes(search.toLowerCase());
                    // Filter the user based on the search query
                    if (search && cloud_name === appConstant.CLOUD_PROVIDER.AWS && !isMatchingUserName && !isMatchingAccount && !isMatchingCreatedAt && !isMatchingStatus) {
                        continue;
                    } if (search && cloud_name === appConstant.CLOUD_PROVIDER.AZURE && !isMatchingUserName && !isMatchingAccount && !isMatchingCreatedAt && !isMatchingStatus && !isMatchingAccountType) {
                        continue;
                    }
                    cloudUsersList.push(modifiedUser);
                }
                sort = sort || appConstant.SORT.DEFAULT_SORT;
                sort = orderBy && orderBy == appConstant.SORT.DESCENDING ? `-${sort}` : sort;
                total_users = search ? cloudUsersList.length : total_users;
                let sortedList = await this.sortFilteredUserList(cloudUsersList, sort);
                if ((search || sort) && !_.isNil(limit) && !_.isNil(page)) {
                    const startIndex = (page - 1) * limit;
                    const endIndex = Number(startIndex) + Number(limit);
                    sortedList = sortedList.slice(startIndex, endIndex);
                }
                return { total_users, user_list: sortedList };
            } else {
                return { total_users, user_list: cloudAccount };
            }
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.SERVICE} ${appConstant.LOG_MESSAGES.CLOUD_USER_LIST_FAILED} ${error.message}`);
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
            "-user_name": (a, b) => b.user_name.localeCompare(a.user_name, undefined, { sensitivity: "case" }),
            "user_name": (a, b) => a.user_name.localeCompare(b.user_name, undefined, { sensitivity: "case" }),
            "-account": (a, b) => (b.account).localeCompare(a.account, undefined, { sensitivity: "case" }),
            "account": (a, b) => (a.account).localeCompare(b.account, undefined, { sensitivity: "case" }),
            "status": (a, b) => String(a.status).localeCompare(String(b.status)),
            "-status": (a, b) => String(b.status).localeCompare(String(a.status)),
            "-account_type": (a, b) => (b.account_type || '').localeCompare(a.account_type || ''),
            "account_type": (a, b) => (a.account_type || '').localeCompare(b.account_type || '')
        };
        return !_.isNil(sort) && sortMap.hasOwnProperty(sort) ? filteredUserList.sort(sortMap[sort]) : filteredUserList;
    }

    async getCloudSubscriptionsList(requestData: Record<string, any>, tokenData: Record<string, any>, mistToken: Record<string, any>) {
        try {
            logger.info(`${appConstant.LOG_MESSAGES.CLOUD_SUBSCRIPTION_LIST_SERVICE_STARTED}`);
            const finalResponse = await otherService.getSubscriptionList(requestData, mistToken).catch((error: any) => { throw new Error(error) });
            if(finalResponse?.error){
                throw new Error(finalResponse.error); 
            }
            return finalResponse
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }
    async getCloudDiscovery(body: Record<string, any>, foundUserToken: any, tokenData: Record<string, any>, req: any) {
        try {
            logger.info(`${appConstant.LOG_MESSAGES.GET_CLOUD_SERVICE_STARTED}`);
            // Update discovery date
            const _id = body.cid;
            const cloudDiscover: any = await findCloudAccountByFields({ _id });
            if (cloudDiscover.discovery_date) {
                const diffDuration = await dateConvert.dateDifference(cloudDiscover.discovery_date, tokenData.time_zone);
                const diffMinutes = diffDuration.minutes();
                const diffHours = diffDuration.hours();
                const diffDays = diffDuration.days();
                if (diffMinutes <= 30 && diffHours == 0 && diffDays == 0) {
                    throw new Error(appConstant.ERROR_MESSAGES.DISCOVERY_LOCKED);
                    return;
                }
            }
            const dynamicFields = {
                discovery_date: new Date(),
                discovery_status: appConstant.DISCOVERY_STATUS.INPROGRESS,
                discovery_progress_percentage: 0,
            }
            // service call for validate the mist token
            const responseData = await otherService.getCloudDiscovery(body, foundUserToken).catch((error: any) => { throw new Error(error) });
            if(responseData?.error){
                throw new Error(responseData.error); 
            }
            const discoverSyncUpdate = await otherService.discoverSyncUpdate(req).catch((error: any) => { throw new Error(error) });
            if(discoverSyncUpdate?.error){
                throw new Error(discoverSyncUpdate.error); 
            }
            const updateDate = await cloundAccountUpdate(_id, dynamicFields);
            logger.info(appConstant.LOG_MESSAGES.MIST_CONNECTION_COMPLETED);
            const finalResponse = {
                _id: responseData._id,
                _cls: responseData._cls,
                cluster_count: responseData.cluster_count,
                container_enabled: responseData.container_enabled,
                created_by: responseData.created_by,
                dns_enabled: responseData.dns_enabled,
                enabled: responseData.enabled,
                machine_count: responseData.machine_count,
                object_storage_enabled: responseData.object_storage_enabled,
                observation_logs_enabled: responseData.observation_logs_enabled,
                owned_by: responseData.owned_by,
                owner: responseData.owner,
                polling_interval: responseData.polling_interval,
                region: responseData.region,
                starred: responseData.starred,
                title: responseData.title,
                unstarred: responseData.unstarred,
                account_type: responseData.account_type,
                access_type: responseData.access_type,
                environment: responseData.environment,
                authentication_protocol: responseData.authentication_protocol,
                bucket_name: responseData.bucket_name,
                cost_report_format_fields: responseData.cost_report_format_fields,
                discovery_status: responseData.discovery_status,
                discovery_progress_percentage: responseData.discovery_progress_percentage,
                discovery_date: updateDate?.discovery_date,
                opted_regions: responseData.opted_regions,
                created_at: responseData.created_at,
                discovery_locked: true
            }
            return finalResponse;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(`${appConstant.LOG_MESSAGES.SERVICE} ${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
        }
    }

    async getProgressCloud(requestBody: Record<string, any>, tokenData: Record<string, any>, foundToken: Record<string, any>) {
        try {
            logger.info(`${appConstant.MESSAGES.GET_CLOUD_SINGLE_PROGRESS_SERVICE_STARTED}`);
            const token = foundToken.mistToken
            const responseData = await otherService.getProgressForSingleCloud(requestBody.cid, tokenData, token).catch((error: any) => { throw new Error(error) });
            if(responseData?.error){
                throw new Error(responseData.error); 
            }
            logger.info(appConstant.MESSAGES.GET_CLOUD_SINGLE_PROGRESS_SERVICE_COMPLETED);
            return responseData;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(`${appConstant.LOG_MESSAGES.SERVICE} ${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
        }
    }

    /**
     * This below function is used to get all the active cloud platforms based on the projectid
     */

    async getAllCloudPlatformsByApp(project_id: any): Promise<any> {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_PLATFORMS_SERVICE_STARTED);
            const filterObj = {
                owner: project_id,
                enabled: true
            }
            const getAllDetails = await findAll(filterObj);
            const finalResArray: any = [];
            for (const ele of getAllDetails) {
                switch (ele._cls) {
                    case appConstant.CLOUD_PROVIDER.AWS:
                        finalResArray.push(appConstant.CLOUD_PLATFORMS.AWS);
                        break;
                    case appConstant.CLOUD_PROVIDER.AZURE:
                        finalResArray.push(appConstant.CLOUD_PLATFORMS.AZURE);
                        break;
                    default:
                        break;
                }
            }
            const uniqDetails = await _.uniq(finalResArray);
            const sortedArray = await _.sortBy(uniqDetails);
            return sortedArray;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * This function used for get multiple application based on the array of application id
     */
    async getApplication(_id: any, tokenData: any) {
        try {
            return await findAllApplication({ _id, status: appConstant.SCHEMA.STATUS_ACTIVE })
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * THis function is used to get the list of cloud account names
     */
    async getAllCloudAccountNames(data: any) {
        try {
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_START);
            let finalResponse: any = [];
            const CLOUD_PROVIDER: any = {
                AWS: "Cloud.AmazonCloud",
                AZURE: "Cloud.AzureArmCloud",
                GCP: "Cloud.GCP",
                OCI: "Cloud.OCI"
            };
            const cloud_type = CLOUD_PROVIDER[data.cloud_type];
            const findCloudAccountName: any = await findAllById(data.cloud_account_id, cloud_type);
            const parsedobject = JSON.parse(JSON.stringify(findCloudAccountName));

            parsedobject.map((ele: any) => {
                const obj = {
                    cloud_account_id: ele._id,
                    cloud_account_name: ele.title
                }
                finalResponse.push(obj);
            })
            logger.info(appConstant.LOG_MESSAGES.GET_ALL_CLOUD_ACCOUNT_NAME_SERVICE_COMPLETED);
            return finalResponse;
        } catch (error: any) {
            logger.error(`${appConstant.LOG_MESSAGES.GET_CLOUD_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    async autoRoleMap(data: Record<string, any>) {
        try {
            const { project_id, user_id } = data;
            const autoRoleMap = ProjectUser.aggregate([
                {
                    $match: { project_id }
                },
                {
                    $project: {
                        _id: "$project_id",

                        users_mapping: {
                            $filter: {
                                input: "$users_mapping",
                                as: "users", cond: { $in: ["$$users.role_name", ["View_Only", "Infra_Admin", "Project_Admin",]] },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        "users_mapping.created_at": new Date(),
                        "users_mapping.created_by_user_id": user_id,
                        "users_mapping.updated_at": "$$REMOVE",
                        "users_mapping.updated_by_user_id": "$$REMOVE",
                    },
                },
            ])
            return autoRoleMap;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}