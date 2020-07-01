const Joi = require('@hapi/joi');
const { JoiObjectId, JoiUrlEndpoint } = require('./auth-schema');

const documentSchemas = {
  id: Joi.object().keys({
    id: JoiObjectId().required()
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  authorId: Joi.object().keys({
    id: JoiObjectId().required()
  }),
  create: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(2000),
    text: Joi.string().required().max(50000),
    documentUrl: JoiUrlEndpoint().required().max(200),
  }),
  update: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    description: Joi.string().optional().min(3).max(2000),
    text: Joi.string().optional().max(50000),
    documentUrl: JoiUrlEndpoint().optional().max(200),
  })
};

module.exports = documentSchemas;