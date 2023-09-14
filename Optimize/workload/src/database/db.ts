import mongoose from "mongoose";
import AppConstants from '../utils/constant';
require('dotenv').config();
const logger = require('../helpers/logger');

const appConstant = new AppConstants();

mongoose.set('debug', true);

const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.DEV_DB_CONNECTION}`, {
      dbName: `${process.env.DEV_DB}`
      // Other options...
    });
    const db = mongoose.connection;
    db.on('error', (error) => {
      logger.info(appConstant.DBCONNECTION.ERROR, error);
    });
    db.on('reconnected', () => {
      logger.info(appConstant.DBCONNECTION.RECONNECTED);
    });
    db.on('disconnected', () => {
      logger.info(appConstant.DBCONNECTION.DISCONNECTED);
    });
    return db;
  } catch (error) {
    logger.info(appConstant.DBCONNECTION.ERROR, error);
    throw error;
  }
};

export default connectToDB;
