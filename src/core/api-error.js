const httpStatus = require('http-status');
const { environment } = require('../config/config');

class ApiError extends Error {
  constructor(statusCode = httpStatus[500], message = httpStatus['500_MESSAGE'], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isDev = environment === 'development';
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;