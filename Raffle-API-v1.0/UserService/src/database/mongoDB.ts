import mongoose from "mongoose";
import { DBCONNECTION, ERROR_MESSAGES } from "../utils/appConstant";

import { logger } from "../utils/logger";
import CustomError from "../helpers/customError";

mongoose.set("debug", true);

// Mongo db Connections
const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env["DEV_DB_CONNECTION"]}`, {
            dbName: `${process.env["DB_NAME"]}`,
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
    } catch (error: unknown) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message);
        } else if (error instanceof Error) {
            throw new CustomError(error.message);
        } else {
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }
};

export default connectToDB;
