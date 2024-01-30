import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ERROR_MESSAGES, DBCONNECTION, MESSAGES } from "./utils/appConstant";
import { logger } from "./utils/logger";
import connectToDB from "./database/mongoDB";
// import router from "./routes/routes.js";
import HandleResponse from "./helpers/handleResponse";
import { HTTP_STATUS_CODES } from "./utils/httpStatusCodes";

const app = express();
const RESPONSE = new HandleResponse();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(cors());

// app.use(`${process.env["BASE_URL"]}`, router);

app.use("*", (_req, res) => {
    RESPONSE.handleErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND, res);
});

const port = process.env["PORT"] || 5001;

// To connect to a database, use the connectToDB function.
connectToDB()
    .then(() => logger.info(DBCONNECTION.SUCCESSFUL))
    .catch((error: Error) => logger.error(DBCONNECTION.UNSUCCESSFUL, error));

app.listen(port, () => {
    logger.info(MESSAGES.PORT_LISTEN + `${port}`);
});