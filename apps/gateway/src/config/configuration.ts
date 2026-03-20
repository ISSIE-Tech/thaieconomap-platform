import * as Joi from 'joi';

import { Environment } from '../shared/enums';

export const configuration = Joi.object({
  PORT: Joi.number(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
  ALLOWED_ORIGINS: Joi.string()
    .custom((value: string) => value.split(','))
    .required(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  IS_DEV: Joi.boolean().when('NODE_ENV', {
    is: Joi.equal(Environment.DEVELOPMENT),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET_NAME: Joi.string().required(),
  MINIO_USE_SSL: Joi.boolean().required(),
  MINIO_REGION: Joi.string().required(),
  LINE_LOGIN_BASE_URL: Joi.string().required(),
  LINE_LOGIN_THAIECONOMAP_REDIRECT_URL: Joi.string().required(),
  LINE_LOGIN_SECRET: Joi.string().required(),
  LINE_LOGIN_ID: Joi.number().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  BYPASS_USER_ID: Joi.string(),
  THAIECONOMAP_API: Joi.string().required(),
  THAIECONOMAP_API_SECRET: Joi.string().required(),
  THAIECONOMAP_API_KEY: Joi.string().required(),
  FACEBOOK_LOGIN_ID: Joi.string().required(),
  FACEBOOK_LOGIN_SECRET: Joi.string().required(),
  FACEBOOK_LOGIN_GENERATE_LINK_URL: Joi.string().required(),
  FACEBOOK_LOGIN_REDIRECT_URL: Joi.string().required(),
  FACEBOOK_LOGIN_BASE_URL: Joi.string().required(),
  CHIAL_SHARE_API: Joi.string().required(),
  CHIAL_SHARE_API_SECRET: Joi.string().required(),
  CHIAL_SHARE_API_KEY: Joi.string().required(),
  LINE_LOGIN_THAIECONOMAP_ADMIN_REDIRECT_URL: Joi.string().required(),
  LINE_LOGIN_THAIECONOMAP_V2_REDIRECT_URL: Joi.string().required(),
  API_KEY: Joi.string().required(),
  API_KEY_SECRET: Joi.string().required(),
});
