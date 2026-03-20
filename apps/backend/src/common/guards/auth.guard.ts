import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserDocument } from '../../modules/users/schemas';
import { UsersService } from '../../modules/users/services/users.service';
import { CODES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { ErrorException } from '../exceptions';

export const OPTIONAL_AUTH = 'OPTIONAL_AUTH';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userHeader = request.headers.user || null;
    const parsedUserHeader: IUser = JSON.parse(decodeURIComponent(userHeader));
    const optionalAuth = this.reflector.get<boolean>(OPTIONAL_AUTH, context.getHandler());

    if (optionalAuth && !parsedUserHeader) {
      request.user = undefined;

      return true;
    }

    if (!parsedUserHeader) {
      throw new ErrorException(CODES.TEC_002);
    }

    let user = await this.usersService.findUserByAuthId(parsedUserHeader._id);

    if (!user) {
      user = await this.usersService.createUser({ authId: parsedUserHeader._id });
    }

    request.user = this.mapGatewayUserWithDistricts(parsedUserHeader, user);

    return true;
  }

  mapGatewayUserWithDistricts(gatewayUser: IUser, user: UserDocument): IUser {
    return {
      ...gatewayUser,
      _id: user._id.toString(),
      authId: gatewayUser._id,
      districts: user.districts,
    };
  }
}
