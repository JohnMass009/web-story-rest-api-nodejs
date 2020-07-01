const mongoose = require('mongoose');
const { database } = require('../src/config/config');

const configTestDB = () => {
  const dbURI = `mongodb://${ database.host }:${ database.portDB }/${ database.name }`;
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

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbURI, options)
        .then(() => Object.values(mongoose.connection.collections)
          .map(async (collection) => collection.deleteMany()))
        .catch(e => {
          Logger.info('Mongoose connection error');
          Logger.error(e);
        });
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = configTestDB;