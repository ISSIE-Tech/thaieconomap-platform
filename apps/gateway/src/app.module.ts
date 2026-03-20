import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config';
import { AuthModule, ExternalModule, MinioClientModule, ProxyModule, UsersModule } from './modules';
import { globalConfig } from './shared/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configuration,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>(globalConfig.MONGO_DB_URI);
        const dbName = configService.get<string>(globalConfig.MONGO_DB_NAME);

        return {
          uri,
          dbName,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ExternalModule,
    HttpModule,
    MinioClientModule,
    UsersModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
