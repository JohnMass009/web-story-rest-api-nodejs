const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const ApiError = require('../../../src/core/api-error');
const JWT = require('../../../src/core/JWT');
const { UserFixture, insertUsers } = require('../../fixtures/user-fixture');
const { tokenService } = require('../../../src/services')
const { jwt } = require('../../../src/config/config');
const setTestDB = require('../../configTestDB');
const authentication = require('../../../src/middlewares/auth/authentication');

setTestDB();

describe('Authentication middleware', () => {
  const User = new UserFixture();
  const Admin = new UserFixture('ADMIN');

  let tokenJWT;
  let tokenAdminJWT;

  beforeAll(async () => {
    await insertUsers([ User, Admin ]);
    const tokensUser = await tokenService.create(User._id)
    const tokensAdmin = await tokenService.create(Admin._id);
    tokenJWT = await tokensUser.accessToken;
    tokenAdminJWT = await tokensAdmin.accessToken;
  });


  it('Should return unauthorized error if token is not send', async () => {
    const request = httpMocks.createRequest();
    const next = jest.fn();

    try {
      await authentication(request, next);
    } catch (error) {
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Invalid Authorization');
      expect(error).toBeInstanceOf(ApiError);
    }
  });

  it('Should return unauthorized error if jwt token is not a valid ', async () => {
    const request = httpMocks.createRequest(
      { headers: { Authorization: 'Bearer incorrectToken' } });
    const next = jest.fn();

    try {
      await authentication(request, next);
    } catch (error) {
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Invalid token. Please authenticate');
      expect(error).toBeInstanceOf(ApiError);
    }
  });

  it('Should return unauthorized error if access token is expired', async () => {
    const tokenExpires = moment().subtract(1, 'minutes');
    const accessToken = await JWT.encode(new JWT(
      jwt.issuer,
      jwt.audience,
      User._id.toString(),
      tokenExpires.unix(),
      tokenService.getFingerprint()
    ));
    const request = httpMocks.createRequest(
      { headers: { Authorization: `Bearer ${ accessToken }` } });
    const next = jest.fn();
    try {
      await authentication(request, next);
    } catch (error) {
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Invalid token. Please authenticate');
    }
  });

  it('Should return unauthorized error if user is not found', async () => {
    const accessToken = await JWT.encode(new JWT(
      jwt.issuer,
      jwt.audience,
      '5ed1636cc134da90b4bf0cd4',
      moment().add(config.jwt.accessTokenExpirationMinutes, 'minutes').unix(),
      tokenService.getFingerprint()
    ));
    const request = httpMocks.createRequest(
      { headers: { Authorization: `Bearer ${ accessToken }` } });
    const next = jest.fn();

    try {
      await authentication(request, next);
    } catch (error) {
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toBe('User not registered');
    }
  });

  it('Should return user if access token is valid', async () => {
    const request = httpMocks.createRequest(
      { headers: { Authorization: `Bearer ${ tokenJWT }` } });
    const next = jest.fn();

    await authentication(request, next);

    expect(next).toHaveBeenCalledWith();
    expect(request.user._id).toEqual(User._id);
  });
});