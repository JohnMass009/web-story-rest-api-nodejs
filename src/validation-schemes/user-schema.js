const Joi = require('@hapi/joi');
const { JoiObjectId } = require('./auth-schema');

module.exports = {
  userId: Joi.object().keys({
    id: JoiObjectId().required()
  }),
  profile: Joi.object().keys({
    name: Joi.string().optional().min(1).max(200),
    profilePicUrl: Joi.string().optional().uri(),
  }),
};