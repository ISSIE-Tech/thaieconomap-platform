import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  AuthMiddleware,
  ChialShareProxyMiddleware,
  ThaiEconomapProxyMiddleware,
} from '../../common/middlewares';
import { servicePath } from '../../shared/constants';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ThaiEconomapProxyMiddleware).forRoutes({
      path: `${servicePath.thaiEconomap}/pumpuangs/app/*`,
      method: RequestMethod.ALL,
    });

    consumer
      .apply(AuthMiddleware, ThaiEconomapProxyMiddleware)
      .forRoutes({ path: `${servicePath.thaiEconomap}/*`, method: RequestMethod.ALL });

    consumer
      .apply(AuthMiddleware, ChialShareProxyMiddleware)
      .forRoutes({ path: `${servicePath.chialShare}/*`, method: RequestMethod.ALL });
  }
}
