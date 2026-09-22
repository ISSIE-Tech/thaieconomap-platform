import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobPostsModule } from './job-posts/job-posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedsModule } from './common/seeds/seeds.module';
import { DistrictsModule } from './districts/districts.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { AppLoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGO_URI');
        const database = configService.get('MONGO_DATABASE_NAME');
        return {
          uri,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    JobPostsModule,
    SeedsModule,
    DistrictsModule,
    SubmissionsModule,
    MinioClientModule,
    BackofficeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
