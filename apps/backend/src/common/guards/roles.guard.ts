import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CODES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces/user.interface';
import { ErrorException } from '../exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    return this.matchRoles(roles, user.roles?.TEC);
  }

  private matchRoles(roles: string[], userRole: string) {
    // DEVELOPER inherits all ADMIN permissions
    const effectiveRoles = userRole === 'DEVELOPER' ? [userRole, 'ADMIN'] : [userRole];
    const isRoleMatch = roles.some(role => effectiveRoles.includes(role));

    if (!isRoleMatch) {
      throw new ErrorException(CODES.TEC_003);
    }

    return isRoleMatch;
  }
}
