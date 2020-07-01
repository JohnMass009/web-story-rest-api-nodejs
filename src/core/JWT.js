const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const ApiError = require('./api-error');
const Logger = require('./logger');
const config = require('../config/config');

class JWT {
  constructor(issuer, audience, subject, validityTime, param) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = validityTime
    this.prm = param;
  }

  static readPublicKey() {
    return fs.readFileSync(path.join(__dirname, '../../keys/public.pem'), 'utf8');
  }

  static readPrivateKey() {
    return fs.readFileSync(path.join(__dirname, '../../keys/private.pem'), 'utf8');
  }

  static async encode(payload) {
    const cert = await this.readPrivateKey();
    if (!cert)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Token generation failure');

    return jwt.sign({ ...payload }, cert, { algorithm: 'RS256' });
  }

  static async decode(token) {
    try {
      const cert = await this.readPublicKey();

      return await jwt.verify(token, cert, { ignoreExpiration: true });
    } catch (error) {
      if(config.environment === 'development')
        Logger.debug(error);

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Token generation failure');
    }
  }

  static async validate(token) {
    try {
      const cert = await this.readPublicKey();

      return await jwt.verify(token, cert);
    } catch (error) {
      Logger.debug(error);
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token. Please authenticate');
    }
  }
}

module.exports = JWT;