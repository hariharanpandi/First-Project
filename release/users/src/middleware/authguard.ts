import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import AppConstants from '../utils/constant';
import { findAuthByAuthTokenFields } from '../models/authtokenmodel';
require('dotenv').config();
const logger = require('../helpers/logger');

const appConstant = new AppConstants();

export default class AuthGuard {
  /**
   * Verify auth token all API calls except login API
   */
  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(appConstant.LOGGER_MESSAGE.AUTHGURD_VALIDATEING);
      const authHeader: string | undefined = req.headers.authorization;
      if (!authHeader) {
        logger.error(appConstant.LOGGER_MESSAGE.MISSING_TOKEN);
        res.status(401).send(appConstant.MESSAGES.EMPTY_TOKEN);
        return;
      }
      if (authHeader && authHeader.startsWith(appConstant.TOKEN.PERFIX_TOKEN)) {
        const token = authHeader.split(' ')[1];
        // jwt.verify(token, `${process.env.SECRET_KEY}` as string, (error: Error | null, decoded: any) => {
        //   if (error) {
        //     logger.error(`${appConstant.LOGGER_MESSAGE.VERIFICATION_FAILED} ${error.message}`);
        //     res.status(401).send(appConstant.MESSAGES.UNAUTHORIZED_USER);
        //     return;
        //   }
        //   next();
        // });
        const decodedToken: any = jwt.decode(token);
        const findToken = await findAuthByAuthTokenFields({ email: decodedToken.email });
        if (findToken?.token === token) {
          next();
        } else {
          logger.error(`${appConstant.LOGGER_MESSAGE.VERIFICATION_FAILED}`);
          res.status(401).send(appConstant.MESSAGES.UNAUTHORIZED_USER);
          return;
        }
      } else {
        logger.error(appConstant.LOGGER_MESSAGE.INVALID_FORMAT);
        res.status(401).send(appConstant.MESSAGES.INVALID_TOKEN);
      }
    } catch (error: any) {
      logger.info(appConstant.LOGGER_MESSAGE.VALIDATION_FAILED);
      res.status(400).send(appConstant.MESSAGES.INVALID_TOKEN);
    }
  }

  /**
   * Get data from auth token using jwt decode method
   */
  async getDataByToken(req: Request) {
    try {
      const authHeader: string | undefined = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      if (!token) {
        logger.error(appConstant.LOGGER_MESSAGE.GET_DATA_TOKEN_INVALID);
        return appConstant.MESSAGES.INVALID_TOKEN;
      }
      const decodedToken: any = jwt.decode(token);
      return decodedToken;
    } catch (error: any) {
      logger.error(`${appConstant.LOGGER_MESSAGE.GET_DATA_TOKEN_FAILED} ${error.message}`);
      return appConstant.MESSAGES.INVALID_TOKEN;
    }
  }
}