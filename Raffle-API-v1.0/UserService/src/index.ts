import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import connectToDB from "./database/mongoDB";
import HandleResponse from "./helpers/handleResponse";

import { DBCONNECTION, MESSAGES } from "./utils/appConstant";
import { HTTP_STATUS_CODES } from "./utils/httpStatusCodes";
import { logger } from "./utils/logger";
import ROUTER from "./routes/routes";
import { CLIENT_ERROR_MESSAGES } from "./locales/langConstant";
import CustomError from "./helpers/customError";

const app = express();
const RESPONSE = new HandleResponse();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware with custom configuration
app.use(cors({
    // Specify the allowed origins
    origin: "*"
}));

// Secure Header HTTP
app.use(helmet());

// To connect to a database, use the connectToDB function.
connectToDB()
    .then(() => logger.info(DBCONNECTION.SUCCESSFUL))
    .catch((error: CustomError) => logger.error(DBCONNECTION.UNSUCCESSFUL, error));

// Routes
app.use(`${process.env["BASE_URL"]}`, ROUTER);

app.use("*", (req: Request, res: Response) => {
    const language: string = req.headers["accept-language"] || "en";
    const errorMessages = CLIENT_ERROR_MESSAGES[language] || CLIENT_ERROR_MESSAGES["en"];
    RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, errorMessages["URL_NOT_FOUND"], res);
});

const port = process.env["PORT"] || 5001;

app.listen(port, () => {
    logger.info(MESSAGES.PORT_LISTEN + `${port}`);
});