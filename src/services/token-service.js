const httpStatus = require('http-status');
const moment = require('moment');
const { Types } = require('mongoose');
const crypto = require('crypto');

const ApiError = require('../core/api-error');
const JWT = require('../core/JWT');

const { jwt, resetPasswordExpirationMinutes } = require('../config/config');

const { TokenModel } = require('../models');

const findByKey = async (client, key) => {
  return TokenModel.findOne({
    userId: client,
    refreshToken: key
  })
    .lean();
};

const parseJWT = (authorization) => {
  if (!authorization || (!authorization.startsWith('Bearer ')))
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authorization');
  return authorization.split(' ')[1];
};

const getFingerprint = () => {
  return crypto.randomBytes(64).toString('hex');
};

const validatePayload = (payload) => {
  if (!payload || !payload.iss
    || !payload.sub || !payload.aud || !payload.prm
    || payload.iss !== jwt.issuer
    || payload.aud !== jwt.audience
    || !Types.ObjectId.isValid(payload.sub)
  )
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');

  return true;
};

const encodeToken = async (userId, fingerprint, expiration) => {
  if(!fingerprint)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Fingerprint of token is not defined.')

  if(!expiration)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Expiration of token is not defined.')

  const token = JWT.encode(
    new JWT(
      jwt.issuer,
      jwt.audience,
      userId,
      expiration,
      fingerprint
    )
  );

  if (!token)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);

  return token;
};

const create = async (userId) => {
  const fingerprintAccess = getFingerprint();
  const fingerprintRefresh = getFingerprint();

  const expirationAccess = moment().add(jwt.accessTokenExpirationMinutes, 'minutes').unix();
  const expirationRefresh = moment().add(jwt.refreshTokenExpirationDays, 'days').unix();

  const accessToken = await encodeToken(userId, fingerprintAccess, expirationAccess);
  const refreshToken = await encodeToken(userId, fingerprintRefresh, expirationRefresh);

  save(
    userId,
    refreshToken,
    jwt.refreshTokenExpirationDays,
    fingerprintRefresh
  );

  return { accessToken, refreshToken };
};

const save = async (userId, refreshToken, expiredAt, fingerprint) => {
  return await TokenModel.create({
    userId,
    refreshToken,
    expiredAt,
    fingerprint
  });
};

const remove = (id, type) => {
  return TokenModel.remove({ userId: id, type });
};

const refreshTokens = async (userId, token) => {
  const session = await findByKey(userId, token).delete;
  if (!session) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
  }
  await remove(session._id, 'refresh');

  return create(userId);
};

const generateResetPasswordToken = async (userId) => {
  const fingerprintResetPassword = getFingerprint();

  const expirationResetPassword = moment().add(resetPasswordExpirationMinutes, 'minutes').unix();

  return await encodeToken(userId, fingerprintResetPassword, expirationResetPassword);
};

module.exports = {
  findByKey,
  parseJWT,
  getFingerprint,
  validatePayload,
  create,
  save,
  remove,
  refreshTokens,
  generateResetPasswordToken
};