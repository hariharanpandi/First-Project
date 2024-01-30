import mongoose from "mongoose";
import { DBCONNECTION } from "../utils/appConstant";

import { logger } from "../utils/logger";

// mongoose.set('debug', true);

// Mongo db Connections
const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env["DEV_DB_CONNECTION"]}`, {
            dbName: `${process.env["DB_NAME"]}`
            // Other options...
        });
        const db = mongoose.connection;
        db.on("error", (error: Error) => {
            logger.error(DBCONNECTION.ERROR, error);
        });
        db.on("reconnected", () => {
            logger.warn(DBCONNECTION.RECONNECTED);
        });
        db.on("disconnected", () => {
            logger.error(DBCONNECTION.DISCONNECTED);
        });
        return db;
    } catch (error: unknown ) {
        logger.error(DBCONNECTION.ERROR, error);
        throw new Error(error as string);
    }
};

export default connectToDB;
