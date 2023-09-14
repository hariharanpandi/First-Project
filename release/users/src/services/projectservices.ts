import axios from "axios";
import { Request } from 'express';
require('dotenv').config();
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

export default class ProjectService {

  async updateUserRoles(req: Request) {
    try {
      const data = req.body;
      const headers = {
        Authorization: req.headers.authorization,
      };
      const response = await axios.post(`${process.env.UPDATE_USER_ROLES}`, data, { headers });
      // Handle the response data as needed
    } catch (error: any) {
      logger.error(appConstant.LOGGER_MESSAGE.UPDATE_USER_ROLE_FAILED);
      return { error: error.response.data };
    }
  }
  async getProjectUsers(req: Record<string, any>) {
    try {
      const params = JSON.parse(JSON.stringify(req.params));
      const headers = {
        Authorization: req.headers.authorization,
      };
      const response = await axios.get(`${process.env.GET_PROJECT_USERS}${params.project_id}`, { headers });
      return response.data;
    } catch (error: any) {
      return { error: error.response.data };
    }
  }
  async checkUsersRoleMap(req: Record<string, any>, userList: Record<string, any>) {
    try {
      const headers = {
        Authorization: req.headers.authorization,
      };
      const requestBody = {
        userList
      };
      const response = await axios({
        method: 'get',
        url: `${process.env.CHECK_USERS_ROLE_MAP}`,
        headers,
        data: userList,
      });
      return response.data;
    } catch (error: any) {
      logger.error(appConstant.LOGGER_MESSAGE.GET_PROJECT_USER_FAILED);
      return { error: error.response.data };
    }
  }

}