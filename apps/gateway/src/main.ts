import { VERSION_NEUTRAL, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';

import { AppModule } from './app.module';
import { HttpExceptionFilter, InternalExceptionFilter } from './common/filters';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptors';
import { globalConfig } from './shared/constants';
import { validationExceptionFactory } from './shared/utils/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Apply body parser only for non-proxy routes to prevent consuming
  // the raw request stream before http-proxy-middleware can forward it.
  // This fixes "Multipart: Unexpected end of form" errors on proxied file uploads.
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.originalUrl.startsWith('/services/')) {
      return next();
    }

    express.json()(req, res, (err) => {
      if (err) return next(err);
      express.urlencoded({ extended: true })(req, res, next);
    });
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>(globalConfig.PORT);
  const allowedOrigins = configService.get<string[]>(globalConfig.ALLOWED_ORIGINS);
  const IsDev = configService.get<boolean>(globalConfig.IS_DEV);

  app.useLogger(
    IsDev ? ['fatal', 'verbose', 'debug', 'error', 'log'] : ['fatal', 'debug', 'error', 'log'],
  );

  app.enableCors({
    origin: IsDev ? '*' : allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: !IsDev,
  });

  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());
  app.useGlobalFilters(new InternalExceptionFilter(configService), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  if (IsDev) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('temp')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(port);
}

bootstrap();
