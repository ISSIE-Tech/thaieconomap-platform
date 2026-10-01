import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ErrorException } from '../../common/exceptions';
import { CODES, globalConfig } from '../../shared/constants';
import { OauthProvider, Service, UserRole } from '../../shared/enums';
import { IAuthResponse, ICredentials, ITokenPayload } from '../../shared/interfaces';
import { generateRandomString, prettyObjectString } from '../../shared/utils';
import {
  AbstractBaseOauthService,
  AuthentikOauthService,
  FacebookOauthService,
  LineOauthService,
} from '../externals/services';
import { CreateUserDto } from '../users/dto';
import { User, UserDocument } from '../users/schemas';
import { UsersService } from '../users/users.service';



@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private readonly adminRoles: Map<Service, string> = new Map([
    [Service.CSC_ADMIN, 'CSC'],
    [Service.TEC_ADMIN, 'TEC'],
  ]);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly lineOauthService: LineOauthService,
    private readonly facebookOauthService: FacebookOauthService,
    private readonly authentikOauthService: AuthentikOauthService,
  ) {}

  async bypassLogin(): Promise<IAuthResponse> {
    this.logger.debug(`{${AuthService.name}-${this.bypassLogin.name}} (called)`);

    const id = this.configService.get<string>(globalConfig.BYPASS_USER_ID);
    const user = await this.userService.findById(id, { refreshToken: 0 });

    return {
      credentials: await this.generateCredential(id),
      user,
    };
  }

  getLineLoginLink(serviceName: Service): string {
    return this.lineOauthService.getLoginLink(serviceName);
  }

  async lineLogin(authorizationCode: string, serviceName: Service): Promise<IAuthResponse> {
    return this.oauthLogin(
      authorizationCode,
      this.lineOauthService,
      OauthProvider.LINE,
      serviceName,
    );
  }

  getAuthentikLoginLink(): string {
    return this.authentikOauthService.getLoginLink();
  }

  async authentikLogin(authorizationCode: string): Promise<IAuthResponse> {
    const ctx = `${AuthService.name}-${this.authentikLogin.name}`;

    this.logger.debug(`{${ctx}} (called)`);

    const payload = await this.authentikOauthService.verifyAuthorizationCode(authorizationCode);
    const profile = await this.authentikOauthService.getProfile(payload);
    // getDeterminedRoles reads and clears the roles stored during getProfile
    const roles = this.authentikOauthService.getDeterminedRoles(profile.oauthSub);

    this.logger.verbose(
      `{${ctx}} (authentik profile) ${prettyObjectString({ ...profile, ...roles })}`,
    );

    let user = await this.userService.findUserByOauthSub(
      profile.oauthSub,
      OauthProvider.AUTHENTIK,
    );

    const userData = {
      name: profile.name,
      displayName: profile.name,
      email: profile.email,
    };

    if (!user) {
      user = await this.createNewUser({
        ...userData,
        oauth: { provider: OauthProvider.AUTHENTIK, sub: profile.oauthSub },
        profileImageUrl: profile.profileImageUrl,
        roles: undefined,
        shortId: undefined,
        phone: undefined,
        dateOfBirth: undefined,
      });
    } else {
      user = await this.userService.findOneAndUpdate(
        { _id: user._id },
        { ...userData },
        { projection: { refreshToken: 0 } },
      );
    }

    // Auto-assign roles from OIDC groups on every login; a service the user has no
    // group for is unset, so losing a group also removes access to that service
    user = await this.userService.findOneAndUpdate(
      { _id: user._id },
      { roles: { TEC: roles.TEC, CSC: roles.CSC } },
      { projection: { refreshToken: 0 } },
    );

    this.logger.verbose(`{${ctx}} (user with role) ${prettyObjectString(user)}`);

    const userId = user._id.toString();

    return {
      credentials: await this.generateCredential(userId),
      user,
    };
  }

  getFacebookLoginLink(): string {
    return this.facebookOauthService.getLoginLink();
  }

  async facebookLogin(authorizationCode: string): Promise<IAuthResponse> {
    return this.oauthLogin(authorizationCode, this.facebookOauthService, OauthProvider.FACEBOOK);
  }

  async generateCredential(sub: string, replacedRefreshToken?: string): Promise<ICredentials> {
    this.logger.debug(
      `{${AuthService.name}-${this.generateCredential.name}} (called)\
      \n[param] ${prettyObjectString({
        sub,
      })}`,
    );

    return {
      accessToken: this.generateAccessToken(sub),
      refreshToken: await this.generateRefreshToken(sub, replacedRefreshToken),
    };
  }

  async revokeToken(userId: string): Promise<UserDocument> {
    return this.userService.revokeRefreshToken(userId);
  }

  private async oauthLogin(
    authorizationCode: string,
    oauthService: AbstractBaseOauthService,
    oauthProvider: OauthProvider,
    serviceName?: Service,
  ): Promise<IAuthResponse> {
    const ctx = `${AuthService.name}-${this.oauthLogin.name}`;

    this.logger.debug(`{${ctx}} (called)\
      \n[params] ${prettyObjectString({
        hasAuthorizationCode: Boolean(authorizationCode),
        oauthService: `${oauthService.constructor.name}`,
        oauthProvider,
        serviceName,
      })}`);

    const payload = await oauthService.verifyAuthorizationCode(authorizationCode, serviceName);
    const { oauthSub, name, email, phone, profileImageUrl, dateOfBirth } =
      await oauthService.getProfile(payload);

    this.logger.verbose(
      `{${ctx}} (get oauth profile) profile:\n${prettyObjectString({
        oauthSub,
        name,
        email,
        phone,
        profileImageUrl,
        dateOfBirth,
      })}`,
    );

    let user = await this.userService.findUserByOauthSub(oauthSub, oauthProvider);

    this.logger.verbose(`{${ctx}} (get internal profile) profile:\n${prettyObjectString(user)}`);

    // Reject if email used by other user
    const emailUsedBy = email ? await this.userService.findOne({ email }) : null;
    const isEmailUsed = !emailUsedBy?._id.equals(user?._id);

    this.logger.verbose(
      `{${ctx}} (email used by) _id: ${emailUsedBy?._id}. Is internal user own the email: ${!isEmailUsed}`,
    );

    if (email && emailUsedBy && isEmailUsed) {
      throw new ErrorException(
        CODES.AGW_001,
        'มีการใช้อีเมลที่ผูกกับบัญชีของท่านในระบบของเราอยู่แล้ว',
      );
    }

    // Create user if doesn't exists otherwise update
    const userData = { displayName: name, email, phone, dateOfBirth };

    if (!user) {
      user = await this.createNewUser({
        ...userData, 
        oauth: {
          provider: oauthProvider,
          sub: oauthSub,
        },
        profileImageUrl,
        name: undefined,
        roles: undefined,
        shortId: undefined,
      });
    } else {
      user = await this.userService.findOneAndUpdate(
        { _id: user._id },
        { ...userData },
        { projection: { refreshToken: 0 } },
      );
    }

    this.logger.verbose(`{${ctx}} (current user profile) profile:\n${prettyObjectString(user)}`);
    this.checkUserIsAdminOrManager(user, serviceName);

    // Generate token and update user refresh token
    const userId = user._id.toString();

    return {
      credentials: await this.generateCredential(userId),
      user,
    };
  }

  private async createNewUser(
    userData: CreateUserDto, 
  ): Promise<UserDocument> {
    const ctx = `${AuthService.name}-${this.createNewUser.name}`;

    this.logger.debug(`{${ctx}} (called)\
      \n[params] ${prettyObjectString({
        userData,
      })}`);

    let user = undefined;

    for (let i = 0; i < 3; i++) {
      try {
        user = await this.userService.create({
          ...userData,
          shortId: generateRandomString(6),
        });

        if (user !== undefined) {
          break;
        }

      } catch(error) {
        this.logger.error(error.message);
        this.logger.verbose(`{${ctx}} failed to create user (attempt: ${i+1})`);
      }
    }

    if (user === undefined) {
      throw new ErrorException(CODES.AGW_013);
    }

    return user;
  }

  private generateAccessToken(userId: string): string {
    this.logger.debug(`{${AuthService.name}-${this.generateAccessToken.name}} (called`);

    const payload: ITokenPayload = {
      sub: userId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(globalConfig.JWT_ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(globalConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME) as any,
    });
  }

  private async generateRefreshToken(userId: string, replacedRefreshToken?: string): Promise<string> {
    this.logger.debug(`{${AuthService.name}-${this.generateRefreshToken.name}} (called)`);

    const payload: ITokenPayload = {
      sub: userId,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(globalConfig.JWT_REFRESH_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(globalConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME) as any,
    });

    await this.userService.updateRefreshToken(userId, token, replacedRefreshToken);

    return token;
  }

  private checkUserIsAdminOrManager(user: User, serviceName: Service) {
    this.logger.debug(
      `{${AuthService.name}-${this.checkUserIsAdminOrManager.name}} (called)\
      \n[param] ${prettyObjectString({
        roles: user?.roles,
        serviceName,
      })}`,
    );

    const roleKey = this.adminRoles.get(serviceName);

    if (
      roleKey &&
      user.roles[roleKey] !== UserRole.ADMIN &&
      user.roles[roleKey] !== UserRole.MANAGER &&
      user.roles[roleKey] !== UserRole.DEVELOPER
    ) {
      throw new ErrorException(CODES.AGW_003);
    }
  }
}
