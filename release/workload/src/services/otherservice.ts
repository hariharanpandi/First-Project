import axios from "axios";
import { Request, Response, response } from 'express';
import AppConstants from "../utils/constant";
require('dotenv').config();
const logger = require('../helpers/logger');

const appConstant = new AppConstants();
export default class OtherService {

    /**
     * get application info
     */

    async getApplicationInfo(req: Request, application_id: any) {
        try {
            const headers = {
                Authorization: req.headers.authorization,
            };
            const response = await axios.get(`${process.env.GETAPPINFO}${application_id}`, { headers });
            return response.data;
        } catch (error: any) {
             return { error: error.response.data };
        }
    }

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

    /**
     * check if the project_id is active and get all the active cloud platforms 
     */

    async getAllCloudPlatforms(project_id: any, req: Request) {
        try {
            let finalresponse: any;
            const headers = {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            };
            const config = {
                headers: headers
            };
            await axios.get(`${process.env.GET_ALL_CLOUD_PLATFORMS}${project_id}`, config).then((response) => {
                finalresponse = response.data;
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalresponse;
        } catch (error: any) {
             return { error: error.response.data };
        }
    }

    /**
     * get application info
     */

    async getAllApplicationInfo(req: Request, body: any) {
        try {
            let finalresponse: any;
            const headers = {
                Authorization: req.headers.authorization,
            };
            await axios.post(`${process.env.GET_APPLICATION}`, body, { headers }).then((response) => {
                finalresponse = response.data;
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalresponse;
        } catch (error: any) {
             return { error: error.response.data };
        }
    }

    /*
     * price tagger get service
     */
    async priceTagger(headerData: any, data: Record<string, any>) {
        try {
            let finalresponse: any;
            const headers = {
                Authorization: headerData
            }
            await axios.post(`${process.env.PRICE_TAGGER}`, data, { headers }).then((response) => {
                finalresponse = response.data;
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalresponse;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.GET_PRICE_TAGGER_SERVICE_CALL_FAILED)
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
     * This function used to get the project
     */

    async getProject(req: Record<string, any>, userData: Record<string, any>) {
        try {
            let finalResponse: any[] = [];
            const headers = {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            };
            const config = {
                headers: headers
            };
            await axios.get(`${process.env.GET_PROJECT}`, config).then((response) => {
                finalResponse = response.data
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalResponse
        } catch (error: any) {
             return { error: error.response.data };
        }
    }


    async getCloudName(req: Request, tokenData: any, cloudAccountIds: any) {
        try {
            let finalresponse: any;
            const headers = {
                Authorization: req.headers.authorization,
            };
            await axios.post(`${process.env.GET_ALL_CLOUD_ACCOUNT_NAME}`, cloudAccountIds, { headers }).then((response) => {
                finalresponse = response.data;
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalresponse;
        } catch (error: any) {
             return { error: error.response.data };
        }
    }
    async autoRoleMap(req: Request, tokenData: Record<string, any>, project_id: string) {
        try {
            let finalresponse: any;
            const headers = {
                Authorization: req.headers.authorization,
            };
            await axios.get(`${process.env.AUTO_ROLE_MAP}?project_id=${project_id}&user_id=${tokenData._id}`, { headers }).then((response) => {
                finalresponse = response.data;
            }).catch((error: any) => {
                 return { error: error.response.data };
            });
            return finalresponse;
        } catch (error: any) {
             return { error: error.response.data };
        }
    }
}