import axios from "axios";
import { Request, Response } from 'express';
import AppConstants from "../utils/constant";
const logger = require('../helpers/logger');
require('dotenv').config();
const _ = require("lodash");
const redis = require('redis');
const IORedis = require('ioredis');


const appConstant = new AppConstants();
const redisClient = new IORedis({
    host: process.env.REDIS_SERVER_IP,
    port: process.env.REDIS_SERVER_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_SERVER_DEFAULT_DB,
});

export default class OtherService {

    /**
     * get the Role by id service
     */
    async getAllRole(req: Request) {
        try {
            let role: any[] = [];
            const headers = {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            };
            const config = {
                headers: headers
            };
            await axios.get(`${process.env.GET_ALL_ROLE}`, config).then((response) => {
                role = response.data
            }).catch((e) => {
                role = e.response.data
            });
            return role
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    async workloadUserMap(req: Request, projectData: Record<string, any>, project_app_map_ids: any[]) {
        try {
            const data = {
                projectData,
                project_app_map_ids
            };
            const headers = {
                Authorization: req.headers.authorization,
            };
            const response = await axios.post(`${process.env.WORKLOAD_USER_MAP}`, data, { headers });
            return response.data; // Assuming you want to return the response to the caller
        } catch (error: any) {
            // Handle any errors that occur during the request
            return { error: error.response.data };
        }
    }

    /**
     * get the Role by id service
     */
    async getUser(req: Request) {
        try {
            let users: Record<string, string> | undefined;
            const query = JSON.parse(JSON.stringify(req.query));
            const headers = {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            };
            const config = {
                headers: headers
            };
            await axios.get(`${process.env.GET_USERS}${query._id}`, config).then((response) => {
                users = response.data
            }).catch((e) => {
                users = e.response.data
            });
            if (users === undefined) {
                return { error: 'Failed to fetch user data.' };
            }
            return users
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    /**
     * Get regions - Mist api call 
     */
    async getRegionsMist(req: Request, foundUserToken: Record<string, any>) {
        try {
            delete req.body.project_id;
            const headers = {
                Authorization: foundUserToken.mistToken
            }
            const response = await axios.post(`${process.env.GET_REGIONS_MIST_API}`, req.body, { headers });
            logger.info(appConstant.LOG_MESSAGES.MIST_API_SUCCESS);
            return response.data;
        } catch (error: any) {
            logger.error(appConstant.LOG_MESSAGES.MIST_API_FAILED, error.message);
            return { error: error.response.data };
        }
    }
    /*
     * generate MIST token service
     */
    async generateAuthTokeMist(req: Record<string, any>, userData: Record<string, any>) {
        try {
            const data = userData;
            const response = await axios.post(`${process.env.MIST_TOKEN_IP}`, data);
            return response.data;
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    /**
     * validating cloud credentials 
     */
    async verifyCloudCredntial(body: Record<string, any>, foundUserToken: Record<string, any>) {
        try {
            const headers = {
                Authorization: foundUserToken.mistToken,
            };
            const response = await axios.post(`${process.env.MIST_VALIDATE_CLOUD}`, body, { headers });
            if (response.data === appConstant.SCHEMA.SUCCESS) {
                return appConstant.MESSAGES.MIST_VERIFY_COMPLETED
            } else {
                return response.data;
            }
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    /**
     * Get Cloud discovery
     */

    async getCloudDiscovery(body: Record<string, any>, foundUserToken: Record<string, any>) {
        try {
            const headers = {
                Authorization: foundUserToken.mistToken,
            };
            const response = await axios.put(`${process.env.DISCOVERY_CLOUD}`, body, { headers });
            if (response.data === appConstant.SCHEMA.SUCCESS) {
                return appConstant.MESSAGES.MIST_VERIFY_COMPLETED
            } else {
                return response.data;
            }
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    async usersList(req: Request, userIds: any[]) {
        try {
            const headers = {
                Authorization: req.headers.authorization,
            };
            const data = {
                userIds: userIds
            };
            const response = await axios.post(`${process.env.GET_USERS_LIST}`, data, { headers });
            return response.data;
        } catch (error: any) {
            // Handle any errors that occur during the request
            return { error: error.response.data }
        }
    }

    async getSubscriptionList(requestData: Record<string, any>, foundUserToken: Record<string, any>) {
        try {
            const headers = {
                Authorization: foundUserToken.mistToken,
            }
            const response = await axios.post(`${process.env.GET_SUBSCRIPTION_LIST}`, requestData, { headers });
            return response.data
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    async getProgressForSingleCloud(request: string, tokenData: Record<string, any>, mistToken: string) {
        try {
            const headers = {
                Authorization: mistToken,
            }
            const response = await axios.post(`${process.env.GET_PROGRESS_SINGLE_CLOUD}`, request, { headers });
            return response.data;
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    /**
     * Discover sync update
     */
    async discoverSyncUpdate(req: Request) {
        try {
            const headers = {
                Authorization: req.headers.authorization
            }
            const response = await axios.put(`${process.env.WORKLOAD_SYNC_UPDATE}`, req.body, { headers });
            logger.info(appConstant.LOG_MESSAGES.MIST_API_SUCCESS);
            return response.data;
        } catch (error: any) {
            logger.error(appConstant.LOG_MESSAGES.MIST_API_FAILED, error.message);
            return { error: error.response.data };
        }
    }

    /**
     * Get All Workload
     */
    async getAllWorkload(req: Request, tokenData: Record<string, any>, params: any) {
        try {
            const headers = {
                Authorization: req.headers.authorization,
            }
            const response = await axios.get(`${process.env.GET_ALL_WORKLOAD_PROJECTID}${params._id}`, { headers });
            return response.data;
        } catch (error: any) {
            return { error: error.response.data };
        }
    }

    /**
     * Get All mapped Workload
     */
    async getAllMappedWorkload(req: Request, tokenData: Record<string, any>, params: any) {
        try {
            const headers = {
                Authorization: req.headers.authorization,
            }
            const response = await axios.get(`${process.env.GET_ALL_WORKLOAD_MAPPED_PROJECTID}${params._id}`, { headers });
            return response.data;
        } catch (error: any) {
            return { error: error.response.data };
        }
    }
}