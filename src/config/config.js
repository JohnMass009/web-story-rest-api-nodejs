const dotenv = require('dotenv');
const Joi = require('@hapi/joi');

dotenv.config({ path: './.env' });

const envSchema = Joi.object().keys({
  DOMAIN_NAME: Joi.string().default('localhost'),

  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(7000),

  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_USER_PWD: Joi.string().required(),

  ACCESS_TOKEN_EXPIRATION_MINUTES: Joi.number().default(30),
  REFRESH_TOKEN_EXPIRATION_DAYS: Joi.number().default(60),
  TOKEN_ISSUER: Joi.string().required(),
  TOKEN_AUDIENCE: Joi.string().required(),

  LOG_DIR: Joi.string(),

  RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),

  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.number(),
  SMTP_USERNAME: Joi.string(),
  SMTP_PASSWORD: Joi.string(),
  EMAIL_FROM: Joi.string(),
}).unknown();

const { value, error } = envSchema.validate(process.env);

if (error)
  throw new Error(`Config validation error: ${error.message}`);

module.exports = {
  environment: value.NODE_ENV,
  domain: value.DOMAIN_NAME === 'localhost' ?
    `http://localhost:${value.PORT}`
    : value.DOMAIN_NAME,
  port: value.PORT,
  database: {
    name: value.DB_NAME,
    host: value.DB_HOST,
    portDB: value.DB_PORT,
    user: value.DB_USER,
    password: value.DB_USER_PWD
  },
  jwt: {
    accessTokenExpirationMinutes: parseInt(value.ACCESS_TOKEN_EXPIRATION_MINUTES),
    refreshTokenExpirationDays: parseInt(value.REFRESH_TOKEN_EXPIRATION_DAYS),
    issuer: value.TOKEN_ISSUER,
    audience: value.TOKEN_AUDIENCE,
  },
  logDirectory: value.LOG_DIR,
  resetPasswordExpirationMinutes: parseInt(value.RESET_PASSWORD_EXPIRATION_MINUTES),
  smtp: {
    host: value.SMTP_HOST,
    port: value.SMTP_PORT,
    auth: {
      user: value.SMTP_USERNAME,
      pass: value.SMTP_PASSWORD,
    },
    from: value.EMAIL_FROM,
  }
};