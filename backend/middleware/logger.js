const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { createLogger, format, transports } = require("winston");

// Vercel's filesystem is read-only outside /tmp, so skip file logging there
const isServerless = !!process.env.VERCEL;

const loggerTransports = [new transports.Console()];
let requestLoggerStream;

if (!isServerless) {
    const logDirectory = path.join(__dirname, "../logs");
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    loggerTransports.push(
        new transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
        new transports.File({ filename: path.join(logDirectory, "access.log") })
    );
    requestLoggerStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });
}

// Create a Winston logger instance
const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: loggerTransports,
});

// Morgan middleware to log HTTP requests
const requestLogger = morgan("combined", {
    stream: requestLoggerStream, // undefined stream defaults morgan to stdout
});

module.exports = { logger, requestLogger };
