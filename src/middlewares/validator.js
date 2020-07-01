const httpStatus = require('http-status');

const Logger = require('../core/logger');
const ApiError = require('../core/api-error');

const ValidationSource = {
  BODY: 'body',
  HEADER: 'headers',
  QUERY: 'query',
  PARAM: 'params'
};

const validator = (schema, source = ValidationSource.BODY) =>
  async (ctx, next) => {
    const { error } = schema.validate(ctx.request[source]);
    if (error) {
      const { details } = error;
      const message = details.map(i => i.message.replace(/['"]+/g, '')).join(',');
      Logger.error(message);
      throw new ApiError(httpStatus.BAD_REQUEST, message);
    }

    await next();
  };

module.exports = {
  ValidationSource,
  validator
};