import { Environment } from '@thaieconomap/contracts';
import * as Joi from 'joi';


export const configuration = Joi.object({
  MONGO_URI: Joi.string().required(),
  TAMSANG_TAMSONG_API: Joi.string().required(),
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET: Joi.string().required(),
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.number().required(),
  MINIO_USE_SSL: Joi.string()
    .custom(value => value === 'true')
    .required(),
  MINIO_REGION: Joi.string().required(),
  API_KEY: Joi.string().required(),
  API_KEY_SECRET: Joi.string().required(),
  IS_DEV: Joi.boolean().when('NODE_ENV', {
    is: Joi.equal(Environment.DEVELOPMENT),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  GATEWAY_API: Joi.string().required(),
  GATEWAY_API_KEY: Joi.string().required(),
  GATEWAY_API_SECRET: Joi.string().required(),
  APP_JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  APP_JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  APP_JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  APP_JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  THAIBULKSMS_APP_KEY: Joi.string().required(),
  THAIBULKSMS_APP_SECRET: Joi.string().required(),
  THAIBULKSMS_API_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_USE_TLS: Joi.string()
    .custom(value => value === 'true')
    .required(),
  SESSION_SECRET: Joi.string().required(),
  BYPASS_PUMPUANG_PHONE_NUMBER: Joi.string(),
  BYPASS_PUMPUANG_OTP: Joi.string(),
  ANALYTICS_WEBHOOK_URL: Joi.string(),
  ANALYTICS_WEBHOOK_API_KEY: Joi.string(),
  FCM_PROJECT_ID: Joi.string().required(),
  FCM_CLIENT_EMAIL: Joi.string().required(),
  FCM_PRIVATE_KEY: Joi.string().required(),
});
