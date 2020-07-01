const httpStatus = require('http-status');
const ApiError = require('../core/api-error');
const roles = require('../config/role-config');

const getRole = (roleId = '') => {
  if (!roleId)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role in not found.')

  return roles.find(role => role.id === roleId);
};

const getRoles = () => {
  return roles.map((role) => role.id)
};

module.exports = { getRole, getRoles };