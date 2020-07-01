const router = require('koa-router')();
const httpStatus = require('http-status');
const _ = require('lodash');

const ApiError = require('../../core/api-error');

const authSchema = require('../../validation-schemes/auth-schema');
const userSchema = require('../../validation-schemes/user-schema');
const { validator, ValidationSource } = require('../../middlewares/validator');
const authentication = require('../../middlewares/auth/authentication');
const authorization = require('../../middlewares/auth/authorization');

const { userService } = require('../../services');

router.prefix('profile');
router.use('/',
	validator(authSchema.auth),
	authentication
);

router.get('/personal',
	authorization('read', 'profile'),
	validator(userSchema.userId, ValidationSource.PARAM),
  async (ctx) => {
    const user = await userService.findProfileById(ctx.user._id);
    if (!user)
    	throw new ApiError(httpStatus.BAD_REQUEST, 'User not registered');

    ctx.status = httpStatus.OK;
    ctx.body = _.pick(user, [ 'name', 'email', 'role' ]);
  });

router.put('/',
	authorization('update', 'profile'),
	validator(userSchema.profile),
	async (ctx) => {
		const user = await userService.findProfileById(ctx.user._id);
		if (!user)
			throw new ApiError(httpStatus.BAD_REQUEST, 'User not registered');

		if (ctx.body.name) user.name = ctx.body.name;

		await userService.updateInfo(user);

		ctx.status = httpStatus.OK;
		ctx.body = _.pick(user, ['name', 'email', 'role']);
	}
);

module.exports = router.routes();