const router = require('koa-router')();
const authentication = require('./authentication-route');
const documents = require('./file-manager/documents-route');
const writer = require('./file-manager/writer-route');
const user = require('./user-route');

router.prefix('/v1');

router.use(
  authentication,
  documents,
  writer,
  user,
)

module.exports = router;