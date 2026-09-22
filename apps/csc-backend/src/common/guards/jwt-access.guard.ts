import { createHmac, timingSafeEqual } from 'crypto';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Connection } from 'mongoose';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { User } from 'src/users/schemas/user.schema';

export const verifyApiKey = (key: string, secret: string, hash: string) => {
  if (!key || !secret || typeof hash !== 'string') return false;
  const expected = Buffer.from(
    createHmac('sha256', secret).update(key).digest('hex'),
  );
  const given = Buffer.from(hash);
  return expected.length === given.length && timingSafeEqual(expected, given);
};

// gateway roles.CSC -> csc role (DEVELOPER inherits ADMIN, same as the admin UI)
export const mapGatewayRole = (role?: string): UserRole =>
  role === 'DEVELOPER'
    ? UserRole.Admin
    : Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : UserRole.Customer;

/**
 * Two ways in:
 * - via thaieconomap gateway: `api-key` (HMAC) + `user` header -> csc user keyed by authId
 * - direct (LIFF): csc LINE JWT, unchanged
 */
@Injectable()
export default class JwtAccessGuard extends AuthGuard('jwt-access-token') {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    if (!apiKey) {
      return super.canActivate(context) as Promise<boolean>;
    }

    const valid = verifyApiKey(
      this.config.get('API_KEY'),
      this.config.get('API_KEY_SECRET'),
      apiKey,
    );
    if (!valid || !request.headers.user) {
      throw new UnauthorizedException();
    }

    request.user = await this.resolveGatewayUser(
      JSON.parse(decodeURIComponent(request.headers.user)),
    );
    return true;
  }

  private async resolveGatewayUser(gatewayUser: Record<string, any>) {
    const users = this.connection.model(User.name);
    const role = mapGatewayRole(gatewayUser.roles?.CSC);
    const user = await users.findOne({ authId: gatewayUser._id });

    if (!user) {
      return users.create({
        authId: gatewayUser._id,
        // ponytail: gateway strips oauth, so no real LINE id here; link accounts by lineId if admins also need LIFF identity
        lineId: `gateway:${gatewayUser._id}`,
        shortId: gatewayUser.shortId,
        name: gatewayUser.name || gatewayUser.displayName,
        birthDate: gatewayUser.dateOfBirth ?? new Date(0),
        phoneNumber: gatewayUser.phone ?? '-',
        profileImageUrl: gatewayUser.profileImageUrl,
        role,
      });
    }

    if (user.get('role') !== role) {
      user.set('role', role);
      await user.save();
    }
    return user;
  }
}
