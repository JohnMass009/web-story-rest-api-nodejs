const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const ApiError = require('../../../src/core/api-error');
const { UserFixture } = require('../../fixtures/user-fixture');
const authorization = require('../../../src/middlewares/auth/authorization');

describe('Authorization middleware', () => {
  const User = new UserFixture();

  it('Should return unauthorized error if user not exists or user is not authenticated', async () => {
    const request = httpMocks.createRequest();
    const next = jest.fn();

    try {
      await authorization('read', 'documents')(request, next);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toMatch(/You must be logged in/);
    }
  });

  it('Should return forbidden error if user has not permission', async () => {
    const request = httpMocks.createRequest({
      user: User,
      isAuthenticated: true
    });
    const next = jest.fn();

    try {
      await authorization('read', 'documents')(request, next);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(httpStatus.FORBIDDEN);
      expect(error.message).toMatch(/Permission denied/);
    }
  });
});