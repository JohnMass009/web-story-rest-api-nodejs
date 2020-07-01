const router = require('koa-router')();

const authSchema = require('../../../validation-schemes/auth-schema');
const documentSchema = require('../../../validation-schemes/documents-schema');

const { validator, ValidationSource } = require('../../../middlewares/validator');
const authentication = require('../../../middlewares/auth/authentication');
const authorization = require('../../../middlewares/auth/authorization');

const { documentService } = require('../../../services');

router.prefix('/documents');
router.use('/',
  validator(authSchema.auth),
  authentication
);

router.get('/',
  authorization('read', 'documents'),
  validator(documentSchema.pagination, ValidationSource.QUERY),
  async (ctx) => {
    const documents = await documentService.findWithTitleByUser(ctx.user._id);

    ctx.status = httpStatus.OK;
    ctx.body = !documents ? {} : {...documents};
  }
);

module.exports = router.routes();