const Logger = require('./core/logger');
const { port } = require('./config/config');
const app = require('./app');

app.listen(7000, () => {
  Logger.info(`Running server on the port: ${ port }`);
});