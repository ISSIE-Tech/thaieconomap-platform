import { Injectable } from '@nestjs/common';

import { Express } from 'express';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import { ErrorException } from '../../common/exceptions';
import { CODES, minioFolder } from '../../shared/constants';
import { BackofficeServiceDto } from '../../shared/dto';
import { OauthProvider, UserRole } from '../../shared/enums';
import { formatPhoneNumber, generateSha256Hash } from '../../shared/utils';
import { MinioClientService } from '../minio-client/minio-client.service';

import {
  CreateUserDto,
  UpdatePrivilegeRoleDto,
  UpdatePrivilegeUserDto,
  UpdateProfileDto,
} from './dto';
import { OauthRepository, UsersRepository } from './repositories';
import { UserDocument } from './schemas';

const MAX_REFRESH_TOKENS = 10;

@Injectable()
export class UsersService {
  private readonly baseProjection = { refreshToken: 0 };

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly oauthRepository: OauthRepository,
    private readonly minioClientService: MinioClientService,
  ) {}

  async findOne(
    filterQuery: FilterQuery<UserDocument>,
    projection: Record<string, unknown> = {},
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.usersRepository.findOne(filterQuery, projection, options);
  }

  async findById(
    id: string,
    projection?: Record<string, unknown>,
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument> {
    return this.usersRepository.findById(id, projection, options);
  }

  async findAllPrivilegeUser(backofficeServiceDto: BackofficeServiceDto): Promise<UserDocument[]> {
    const filter = {};

    filter[`roles.${backofficeServiceDto.service}`] = { $ne: UserRole.CUSTOMER };

    return this.usersRepository.find(filter, { refreshToken: 0 }, {
      populate: { path: 'oauth', select: 'provider' },
    });
  }

  async findUserByOauthSub(sub: string, oauthProvider: OauthProvider): Promise<UserDocument> {
    return this.usersRepository.findUserByOauthSub(sub, oauthProvider);
  }

  async findOneWithOauth(filterQuery: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.usersRepository.findOneWithOauth(filterQuery);
  }

  async create({ oauth, ...createUserDto }: CreateUserDto): Promise<UserDocument> {
    const craetedOauth = await this.oauthRepository.create(oauth);
    const phone = formatPhoneNumber(createUserDto.phone);
    const profileImageUrl = createUserDto.profileImageUrl
      ? createUserDto.profileImageUrl
      : this.randomUserProfileImage();

    return this.usersRepository.create({
      ...createUserDto,
      phone,
      profileImageUrl,
      oauth: craetedOauth._id,
    });
  }

  async updateUserRole(
    userId: string,
    updateUserRoleDto: UpdatePrivilegeRoleDto,
  ): Promise<UserDocument> {
    const updateQuery = {};

    updateQuery[`roles.${updateUserRoleDto.service}`] = updateUserRoleDto.role;

    return this.findOneAndUpdate({ _id: userId }, updateQuery);
  }

  async findUserByShortId(shortId: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ shortId });

    if (!user) {
      throw new ErrorException(CODES.AGW_005);
    }

    return user;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<UserDocument>,
    updateQuery: UpdateQuery<unknown>,
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument> {
    if (updateQuery.phone) {
      updateQuery.phone = formatPhoneNumber(updateQuery.phone);
    }

    return this.usersRepository.findOneAndUpdate(filterQuery, updateQuery, options);
  }

  async updatePrivilegeUser(
    shortId: string,
    updatePrivilegeUserDto: UpdatePrivilegeUserDto,
  ): Promise<UserDocument> {
    const { privilege, ...updateQuery } = updatePrivilegeUserDto;
    
    await this.findUserByShortId(shortId);

    if (
      !updatePrivilegeUserDto.privilege &&
      !updatePrivilegeUserDto.name &&
      !updatePrivilegeUserDto.phone
    ) {
      throw new ErrorException(CODES.AGW_001);
    }

    if (updatePrivilegeUserDto.privilege) {
      const { service, role } = updatePrivilegeUserDto.privilege;

      updateQuery[`roles.${service}`] = role;
    }

    return this.findOneAndUpdate({ shortId }, updateQuery, { projection: { refreshToken: 0 } });
  }

  async updateProfile(
    user: UserDocument,
    updateProfileDto: UpdateProfileDto,
    profileImage: Express.Multer.File,
  ): Promise<UserDocument> {
    let profileImageUrl = undefined;

    if (profileImage) {
      profileImageUrl = await this.minioClientService.upload(minioFolder.profile, profileImage);
    }

    const userId = user._id.toString();
    const updatedUser = await this.usersRepository.findByIdAndUpdate(
      userId,
      { ...updateProfileDto, profileImageUrl },
      { projection: this.baseProjection, new: true },
    );

    // Delete old profile image on minio
    if (user.profileImageUrl && !user.profileImageUrl.startsWith('http')) {
      await this.minioClientService.deleteFile(user.profileImageUrl);
    }

    return updatedUser;
  }

  // One refresh token hash per signed-in device, so signing in elsewhere doesn't
  // sign the others out. A refresh swaps out only the token it used; the oldest
  // sessions drop off past MAX_REFRESH_TOKENS.
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    replacedRefreshToken?: string,
  ): Promise<UserDocument> {
    const hashedToken = generateSha256Hash(refreshToken);
    const replacedHash = replacedRefreshToken ? generateSha256Hash(replacedRefreshToken) : null;
    // pipeline update so it stays atomic and also converts the legacy single-string value
    const current = {
      $cond: [
        { $isArray: '$refreshToken' },
        '$refreshToken',
        { $cond: [{ $eq: [{ $type: '$refreshToken' }, 'string'] }, ['$refreshToken'], []] },
      ],
    };

    const kept = { $filter: { input: current, cond: { $ne: ['$$this', replacedHash] } } };

    return this.usersRepository.findByIdAndUpdate(
      userId,
      [
        {
          $set: {
            refreshToken: { $slice: [{ $concatArrays: [kept, [hashedToken]] }, -MAX_REFRESH_TOKENS] },
          },
        },
      ] as UpdateQuery<unknown>,
      { projection: this.baseProjection },
    );
  }

  async revokeRefreshToken(userId: string): Promise<UserDocument> {
    return this.usersRepository.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { projection: this.baseProjection },
    );
  }

  // TODO: implement random image
  private randomUserProfileImage() {
    return 'user-profile/8619c1c5309d58d90d9572488ceb5454.png';
  }
}
