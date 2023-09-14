import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import AppConstants from "./utils/constant";
const routes = require('./routes/routes');
const connections = require('./database/db')
require('dotenv').config();
const logger = require('./helpers/logger');
import swaggerDocs from './helpers/swagger';
import connectToDB from './database/db';
const session = require('express-session');
const  IORedis =  require('ioredis');

const app = express();
const appConstant = new AppConstants();
const port = process.env.PORT ?? 6001;

// Create a Redis client
const redisClient = new IORedis({
  host: process.env.REDIS_SERVER_IP,
  port: process.env.REDIS_SERVER_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_SERVER_DEFAULT_DB,
});

// Redis client error handling
redisClient.on('error', (error: Error) => {
  console.error('Redis Error:', error);
});

// Helper function for handling Redis client events
function handleRedisEvents() {
  const events = {
    connect: appConstant.REDIS_CONNECTION.CONNECT,
    ready: appConstant.REDIS_CONNECTION.READY,
    end: appConstant.REDIS_CONNECTION.END,
    reconnecting: appConstant.REDIS_CONNECTION.RECONNECTING,
    close: appConstant.REDIS_CONNECTION.CLOSE,
  };

  Object.entries(events).forEach(([event, message]) => {
    redisClient.on(event, () => {
      logger.info(message);
    });
  });
}

// Call the helper function to handle Redis events
handleRedisEvents();

connectToDB()
  .then((db:any) => {
    logger.info(appConstant.DBCONNECTION.SUCCESSFUL);
  })
  .catch((error:any) => {
    logger.error(appConstant.DBCONNECTION.UNSUCCESSFUL, error);
  });

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); 

app.use(helmet());
app.use(cors());

// Overall routes
app.use('/api', routes.route);

app.listen(port, () => {
  logger.info(appConstant.MESSAGES.PORT_LISTEN + `${port}`);
  swaggerDocs(app, 4000);
});
