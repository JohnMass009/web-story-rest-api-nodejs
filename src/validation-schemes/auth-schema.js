const Joi = require('@hapi/joi');

const JoiAuthBearer = () => Joi.string().custom((value, helpers) => {
  if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
  if (!value.split(' ')[1]) return helpers.error('any.invalid');
  return value;
}, 'Authorization Header Validation');

const JoiObjectId = () => Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Object Id Validation');

const JoiUrlEndpoint = () => Joi.string().custom((value, helpers) => {
  if (value.includes('://')) return helpers.error('any.invalid');
  return value;
}, 'Url Endpoint Validation');

const auth = Joi.object().keys({
  'authorization': JoiAuthBearer().required()
}).unknown(true);

const register = Joi.object().keys({
  name: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

const login = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
})

const refresh = Joi.object().keys({
  refreshToken: Joi.string().required().min(1),
});

const forgotPassword = Joi.object().keys({
  email: Joi.string().email().required(),
});

const resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  JoiAuthBearer,
  JoiObjectId,
  JoiUrlEndpoint,
  auth,
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword
};