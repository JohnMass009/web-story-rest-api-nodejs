const mongoose = require('mongoose');
const Logger = require('../core/logger');
const config = require('./config');

// remote
//const dbURI = `mongodb://${config.user}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${config.name}`;

// local
const dbURI = `mongodb://${ config.host }:${ config.portDB }/${ config.name }`;


const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000
};

Logger.debug(dbURI);

mongoose.connect(dbURI, options)
  .then(() => {
    Logger.info('Mongoose connection done');
  })
  .catch(e => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });

// Connection Events
mongoose.connection.on('connected', () => {
  Logger.info('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', err => {
  Logger.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
