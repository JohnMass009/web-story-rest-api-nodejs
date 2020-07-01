const router = require('koa-router')();
const httpStatus = require('http-status');
const { Types } = require('mongoose');

const ApiError = require('../../../core/api-error');

const authSchema = require('../../../validation-schemes/auth-schema');
const documentSchema = require('../../../validation-schemes/documents-schema');

const { validator, ValidationSource } = require('../../../middlewares/validator');
const authentication = require('../../../middlewares/auth/authentication');
const authorization = require('../../../middlewares/auth/authorization');

const { documentService } = require('../../../services');

router.prefix('writer');
router.use('/',
  validator(authSchema.auth),
  authentication
);

const formatEndpoint = (endpoint) => endpoint.replace(/\s/g, '').replace(/\//g, '-');

router.post('/new',
  authorization('create', 'writer'),
  validator(documentSchema.create),
  async (ctx) => {
    ctx.body.documentUrl = formatEndpoint(ctx.body.documentUrl);

    const document = await documentService.findUrlIfExists(ctx.body.documentUrl);
    if (document)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Document with this url already exists.');

    const createdDocument = await documentService.create({
      title: ctx.body.title,
      description: ctx.body.description,
      draftText: ctx.body.text,
      documentUrl: ctx.body.documentUrl,
      createdBy: ctx.user,
      updatedBy: ctx.user
    });

    ctx.status = httpStatus.CREATED;
    ctx.body = createdDocument;
  }
);

router.get('/open/:id',
  authorization('read', 'writer'),
  validator(documentSchema.id, ValidationSource.PARAM),
  async (ctx) => {
    const document = await documentService.findDocumentAllDataById(new Types.ObjectId(ctx.params.id));
    if (!document)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Document does not exists.');
    if (!document.author._id.equals(ctx.user._id))
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have necessary permissions.');

    ctx.status = httpStatus.OK;
    ctx.body = document;
  }
);

router.put('/:id',
  authorization('update', 'writer'),
  validator(documentSchema.id, ValidationSource.PARAM),
  validator(documentSchema.update),
  async (ctx) => {
    const document = await documentService.findDocumentAllDataById(new Types.ObjectId(ctx.params.id));
    if (document == null) throw new ApiError(httpStatus.BAD_REQUEST, 'Document does not exists');
    if (!document.author._id.equals(ctx.user._id))
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have necessary permissions.');

    if (ctx.body.documentUrl) {
      const endpoint = formatEndpoint(ctx.body.documentUrl);
      const existingDocument = await documentService.findUrlIfExists(endpoint);
      if (existingDocument)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document URL already used.');
      if (ctx.body.documentUrl) document.documentUrl = endpoint;
    }

    if (ctx.body.title) document.title = ctx.body.title;
    if (ctx.body.description) document.description = ctx.body.description;
    if (ctx.body.text) document.draftText = ctx.body.text;

    await documentService.update(document);

    ctx.status = httpStatus.OK;
  }
);

router.delete('/:id',
  authorization('delete', 'writer'),
  validator(documentSchema.id, ValidationSource.PARAM),
  async (ctx) => {
    const document = await documentService.findDocumentAllDataById(new Types.ObjectId(ctx.user._id));
    if (!document)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Document does not exists');
    if (!document.createdBy.equals(ctx.user._id))
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have necessary permissions');

    document.status = false;

    await documentService.update(document);

    ctx.status = httpStatus.OK;
  }
);

module.exports = router.routes();