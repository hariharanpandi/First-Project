import { createLogger, transports as winstonTransports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Format the log messages with timestamp
 */
const customFormat = format.combine(
    format.timestamp(),
    format.printf(info => {
        return `${info["timestamp"]} - [${info.level.toUpperCase().padEnd(5)}] - ${info.message}`;
    })
);

const logLevels = {
    error: "userManagement-error.log",
    info: "userManagement-info.log",
    debug: "userManagement-debug.log",
};

const transport = Object.keys(logLevels).map(level => {
    return new DailyRotateFile({
        level,
        filename: `logs/userManagement-${level}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "1m",
        maxFiles: "1d",
        handleExceptions: true,
        format: customFormat,
    });
});
const consoleTransport = new winstonTransports.Console({
    format: customFormat,
});
/**
 * Controll log message
 */
export const logger = createLogger({
    transports: [...transport, consoleTransport],
});
