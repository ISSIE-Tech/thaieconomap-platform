import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthenticateDto } from './dtos/authenticate.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ILineProfile } from './interfaces/line-profile.interface';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dtos/register.dto';
import ShortUniqueId from 'short-unique-id';
import { ILineTokens } from './interfaces/line-tokens.interface';
import { UserRole } from 'src/users/schemas/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { tokenId } = registerDto;
    const { sub: lineId, picture: profileImageUrl } =
      await this.getLineUserProfileByTokenId(tokenId);

    const shortId = await this.generateShortId();
    const { name, birthDate, phoneNumber, experiences } = registerDto;

    // explicit fields: the body is not whitelisted, never spread it into the user
    const user = await this.usersService.create({
      lineId,
      shortId,
      profileImageUrl,
      name,
      birthDate,
      phoneNumber,
      experiences,
    });

    return {
      profile: user,
      accessToken: this.generateAccessToken(user._id.toString()),
    };
  }

  async authenticate({ tokenId }: AuthenticateDto) {
    const { sub: lineId, picture: profileImageUrl } =
      await this.getLineUserProfileByTokenId(tokenId);

    const user = await this.usersService.getUserByLineId(lineId);

    if (!user) {
      return null;
    }

    const updatedUser = await this.usersService.update(user._id.toString(), {
      profileImageUrl,
    });

    return {
      profile: updatedUser,
      accessToken: this.generateAccessToken(user._id.toString()),
    };
  }

  private async generateShortId() {
    const uid = new ShortUniqueId({ length: 6 });
    let shortId = uid.randomUUID();
    let userWithSameShortId = await this.usersService.getUserByShortId(shortId);
    while (userWithSameShortId) {
      shortId = uid.randomUUID();
      userWithSameShortId = await this.usersService.getUserByShortId(shortId);
    }

    return shortId;
  }

  private generateAccessToken(userId: string) {
    const payload: ITokenPayload = {
      userId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '7d',
    });

    return token;
  }

  private async getLineUserProfileByTokenId(tokenId: string) {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const profilePayload = new URLSearchParams({
      id_token: tokenId,
      client_id: this.configService.get<string>('LINE_CLIENT_ID'),
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.line.me/oauth2/v2.1/verify',
          profilePayload,
          config,
        ),
      );

      const profile: ILineProfile = response.data;

      return profile;
    } catch ({ error, error_description }) {
      throw new ConflictException(error);
    }
  }
}
