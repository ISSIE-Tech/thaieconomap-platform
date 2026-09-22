import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { otelSDK } from './tracing';
import * as bodyParser from 'body-parser';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { FileUrlInterceptor } from './common/interceptors/file-url.interceptor';
import { MinioClientService } from './minio-client/minio-client.service';

async function bootstrap() {
  otelSDK.start();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '10d',
        }),

        new transports.DailyRotateFile({
          filename: `logs/%DATE%-warn.log`,
          level: 'warn',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '10d',
        }),

        new transports.DailyRotateFile({
          filename: `logs/%DATE%-access.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '10d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FileUrlInterceptor(app.get(MinioClientService)));
  // CLIENT_URL is a comma-separated allowlist: the LIFF client talks to this
  // service directly, the admin reaches it through the thaieconomap gateway
  app.enableCors({
    origin: configService
      .get<string>('CLIENT_URL')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
