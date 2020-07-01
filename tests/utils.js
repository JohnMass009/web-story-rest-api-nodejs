const { Types } = require('mongoose');

const generateId = () => new Types.ObjectId();

const addHeaders = (request, key, value) => request
  .set('Content-Type', 'application/json')
  .set(key, value);

module.exports = {
  generateId,
  addHeaders
};