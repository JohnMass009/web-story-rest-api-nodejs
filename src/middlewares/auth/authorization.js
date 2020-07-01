const httpStatus = require('http-status');

const ApiError = require('../../core/api-error');
const { getRole } = require('../../helpers/role-helper')

const authorization = (action, resource) =>
  async (ctx, next) => {
    if (!ctx.user|| !ctx.isAuthenticated) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in.');
    }

    const authRole = getRole(ctx.user.role);
    const checkPermission = authRole.resources.find(currentResource =>
      currentResource.id === resource
      && currentResource.permissions.indexOf(action) !== -1)

    if (!checkPermission)
      throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied.');

    await next();
  };

module.exports = authorization;