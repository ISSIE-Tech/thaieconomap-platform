import { NotImplementedException } from '@nestjs/common';

import { Service } from '../../../shared/enums';
import {
  IAuthentikPayload,
  IFacebookPayload,
  ILinePayload,
  IOauthProfile,
} from '../../../shared/interfaces';

export abstract class AbstractBaseOauthService {
  getLoginLink(_serviceName?: Service): string {
    throw new NotImplementedException();
  }

  async verifyAuthorizationCode(
    _code: string,
    _serviceName?: Service,
  ): Promise<ILinePayload | IFacebookPayload | IAuthentikPayload> {
    throw new NotImplementedException();
  }

  async getProfile(
    _payload: ILinePayload | IFacebookPayload | IAuthentikPayload,
  ): Promise<IOauthProfile> {
    throw new NotImplementedException();
  }
}
