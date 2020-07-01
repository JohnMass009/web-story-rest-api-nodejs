const fs = require('fs');
const path = require('path');
const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { environment, logDirectory } = require('../config/config');

let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logLevel = environment === 'development' ? 'debug' : 'warn';

const options = {
  file: {
    level: logLevel,
    filename: dir + '/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d'
  }
};

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => info.stack ? `${ info.timestamp } ${ info.level }: ${ info.stack }`
      : `${ info.timestamp } ${ info.level }: ${ info.message }`)
  ),
  transports: [
    new transports.Console(),
  ],
  exceptionHandlers: [
    new DailyRotateFile(options.file),
  ],
  exitOnError: false
});

module.exports = logger;