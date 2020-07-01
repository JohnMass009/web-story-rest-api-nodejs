const router = require('koa-router')();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const httpStatus = require('http-status');

const ApiError = require('../../core/api-error');
const JWT = require('../../core/JWT');

const authSchema = require('../../validation-schemes/auth-schema');
const { validator } = require('../../middlewares/validator');

const { userService, tokenService } = require('../../services');

router.post('/register', validator(authSchema.register),
  async (ctx) => {
    const { email, name, password } = ctx.request.body;

    const user = await userService.findByEmail(email);
    if (user)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already used');

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await userService.create({
      name,
      email,
      password: passwordHash
    });

    const tokens = await tokenService.create(createdUser._id);

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      user: _.pick(createdUser, [ '_id', 'name', 'email', 'role' ]),
      tokens,
    };
  }
);

router.post('/login', validator(authSchema.login),
  async (ctx) => {
    const { email, password } = ctx.request.body;
    const user = await userService.findByEmail(email);
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password.');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password.');

    const tokens = await tokenService.create(user._id);

    ctx.status = httpStatus.OK;
    ctx.body = {
      user: _.pick(user, [ '_id', 'name', 'email', 'role' ]),
      tokens,
    };
  }
);

router.post('/token-refresh', validator(authSchema.refresh),
  async (ctx) => {
    const refreshToken = tokenService.parseJWT(ctx.refreshToken);
    const payload = JWT.decode(refreshToken);
    tokenService.validatePayload(payload);

    const user = await userService.findById(new Types.ObjectId(payload.sub));
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not registered.');

    const tokens = await tokenService.refreshTokens(payload.sub, refreshToken);
    if (!tokens)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.');

    ctx.status = httpStatus.CREATED;
    ctx.body = tokens;
  }
);

router.post('/forgot-password', validator(authSchema.forgotPassword),
  async (ctx) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(ctx.user._id);
    await emailService.sendResetPasswordEmail(ctx.user.email, resetPasswordToken);

    ctx.status = httpStatus.NO_CONTENT;
  }
);

router.post('/reset-password',
  validator(authSchema.resetPassword),
  async (ctx) => {
    if (!ctx.query.token)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Reset token password is undefined.');

    const payload = await JWT.validate(ctx.query.token);
    tokenService.validatePayload(payload);
    const user = await userService.findById(new Types.ObjectId(payload.sub));
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not registered.');

    user.password = ctx.request.body.password;
    await user.save();
    await tokenService.remove(user.id, 'resetPassword');

    ctx.status = httpStatus.OK;
  }
);

module.exports = router.routes();