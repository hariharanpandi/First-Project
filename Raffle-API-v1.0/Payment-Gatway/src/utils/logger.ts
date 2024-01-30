import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Format the log messages with timestamp
 */
const customFormat = format.combine(format.timestamp(), format.printf((info) => {
    return `${info["timestamp"]} - [${info.level.toUpperCase().padEnd(5)}] - ${info.message}`;
}));

const logLevels = {
    error: "userManagement-error.log",
    info: "userManagement-info.log",
    debug: "userManagement-debug.log"
};

const transport = Object.keys(logLevels).map(level => {
    return new DailyRotateFile({
        level,
        filename: `logs/userManagement-${level}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        handleExceptions: true,
        format: customFormat
    });
});

/**
 * Controll log message
 */
export const logger = createLogger({
    transports: transport
});
