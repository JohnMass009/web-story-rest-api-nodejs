const httpStatus = require('http-status');

const ApiError = require('../core/api-error');
const Logger = require('../core/logger');

const errorHandling = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const isApiError = error instanceof ApiError;
    if (!isApiError) throw error;

    let { statusCode, message, isDev } = error;
    if (!isDev) {
      ctx.throw(httpStatus[500]);
    } else {
      ctx.status = statusCode;
      ctx.body = {
        statusCode,
        message,
        ...{ stack: error.stack },
      };
    }
    Logger.error(error);
  }
};

module.exports = errorHandling;