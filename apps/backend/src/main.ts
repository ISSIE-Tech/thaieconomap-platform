import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter, InternalExceptionFilter } from './common/filters';
import { ApiKeyGuard } from './common/guards';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptors';
import otelSDK from './instrumentation';
import { GLOBAL_CONFIG } from './shared/constants';
import { validationExceptionFactory } from './shared/utils';

async function bootstrap() {
  otelSDK.start();

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const configService = app.get(ConfigService);
  const port = configService.get(GLOBAL_CONFIG.PORT);
  const isDev = configService.get(GLOBAL_CONFIG.IS_DEV);

  app.useLogger(
    isDev ? ['fatal', 'verbose', 'debug', 'error', 'log'] : ['fatal', 'debug', 'error', 'log'],
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  app.useGlobalFilters(new InternalExceptionFilter(configService), new HttpExceptionFilter());
  app.useGlobalGuards(new ApiKeyGuard());

  const gatewayUrl = configService.get<string>(GLOBAL_CONFIG.GATEWAY_API);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('temp')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(gatewayUrl + '/services/thai-economap')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}

bootstrap();
