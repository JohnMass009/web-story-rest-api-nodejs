const Koa = require('koa');
const Logger = require('./core/logger');
const cors = require('@koa/cors');
const helmet = require("koa-helmet");
const errorHandling = require('./middlewares/error-handling');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

require('./config/config');
const routesV1 = require('./routes/v1').prefix('/api')

process.on('uncaughtException', e => {
  Logger.error(e);
});

const app = new Koa();

// Middlewares
app.use(errorHandling);
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(logger());

// Routes
app.use(routesV1.routes()).use(routesV1.allowedMethods());

module.exports = app;