const httpStatus = require('http-status');
const { Types } = require('mongoose')

const ApiError = require('../../core/api-error');
const JWT = require('../../core/JWT');

const { userService, tokenService } = require('../../services');

const authentication = async (ctx, next) => {
  if(!ctx.headers.authorization)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authorization.')
  ctx.JWT = tokenService.parseJWT(ctx.headers.authorization);

  const payload = await JWT.validate(ctx.JWT);
  tokenService.validatePayload(payload);

  const user = await userService.findById(new Types.ObjectId(payload.sub));
  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not registered.');

  ctx.user = user;
  ctx.isAuthenticated = true;

  await next();
};

module.exports = authentication;