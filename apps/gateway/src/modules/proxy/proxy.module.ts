import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthMiddleware, serviceProxy } from '../../common/middlewares';
import { globalConfig, servicePath } from '../../shared/constants';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
})
export class ProxyModule implements NestModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const thaiEconomap = serviceProxy(
      this.config.get(globalConfig.THAIECONOMAP_API),
      servicePath.thaiEconomap,
      this.config.get(globalConfig.THAIECONOMAP_API_KEY),
      this.config.get(globalConfig.THAIECONOMAP_API_SECRET),
    );
    const chialShare = serviceProxy(
      this.config.get(globalConfig.CHIAL_SHARE_API),
      servicePath.chialShare,
      this.config.get(globalConfig.CHIAL_SHARE_API_KEY),
      this.config.get(globalConfig.CHIAL_SHARE_API_SECRET),
    );

    consumer.apply(thaiEconomap).forRoutes({
      path: `${servicePath.thaiEconomap}/pumpuangs/app/*`,
      method: RequestMethod.ALL,
    });

    consumer
      .apply(AuthMiddleware, thaiEconomap)
      .forRoutes({ path: `${servicePath.thaiEconomap}/*`, method: RequestMethod.ALL });

    consumer
      .apply(AuthMiddleware, chialShare)
      .forRoutes({ path: `${servicePath.chialShare}/*`, method: RequestMethod.ALL });
  }
}
