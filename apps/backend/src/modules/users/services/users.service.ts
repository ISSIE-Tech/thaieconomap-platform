import { Injectable, Logger } from '@nestjs/common';

import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { GateWayService } from '../../../modules/externals/services';
import { MapService } from '../../../modules/map/map.service';
import { CODES } from '../../../shared/constants';
import { IGateWayPrivilegeUserReponse, IHistory, IUser } from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';
import { CreateUserDto, UpdatePrivilegeUserDto } from '../dto';
import { UsersRepository } from '../repositories';
import { UserDocument } from '../schemas';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly gateWayService: GateWayService,
    private readonly mapService: MapService,
  ) {}

  @Span('Get All Users')
  async getPrivilegeAllUsers(): Promise<IUser[]> {
    this.logger.debug(`{${UsersService.name}-[${getSpanName()}]} (called)`);

    const userMapper = new Map<string, IGateWayPrivilegeUserReponse>();
    const gateWayUser = await this.gateWayService.getPrivilegeUser();
    const privilegeIdList = gateWayUser.map(user => {
      userMapper.set(user._id, user);

      return user._id;
    });

    const internalUser = await this.usersRepository.find({ authId: privilegeIdList }, undefined, {
      populate: {
        path: 'districts',
        select: 'provinceId provinceName districtId districtType districtName',
      },
    });

    return internalUser.map(user => {
      return {
        ...userMapper.get(String(user.authId)),
        ...user,
        _id: String(user._id),
        authId: String(user.authId),
      };
    });
  }

  @Span('Update Privilege User')
  async updatePrivilegeUser(
    shortId: string,
    updatePrivilegeUserDto: UpdatePrivilegeUserDto,
  ): Promise<IUser> {
    this.logger.debug(
      `{${UsersService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shortId,
        updatePrivilegeUserDto,
      })}`,
    );

    // throw error when not found user in gateway
    const user: IUser = await this.gateWayService.updatePrivilegeUser(
      shortId,
      updatePrivilegeUserDto,
    );

    // ignore districts updating failure
    try {
      const authId = user._id.toString();
      const isUserExists = await this.usersRepository.findOne({ authId });

      if (!isUserExists) {
        await this.usersRepository.create({
          authId,
        });
      }

      const updatedThaiEcoUser = await this.updateUserDistrict(
        authId,
        updatePrivilegeUserDto.districts,
      );

      user.districts = updatedThaiEcoUser.districts;
    } catch (error) {
      this.logger.error(error);
    }

    return user;
  }

  @Span('Get History By User Id')
  async getHistoryByUserId(userId: string): Promise<IHistory[]> {
    this.logger.debug(
      `{${UsersService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId,
      })}`,
    );

    return this.usersRepository.getHistoryByUserId(userId);
  }

  @Span('Update User District')
  async updateUserDistrict(authId: string, districts: Array<string>): Promise<UserDocument> {
    this.logger.debug(
      `{${UsersService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        authId,
        districts,
      })}`,
    );

    const districtsSet = new Set(districts);
    const uniqueDistricts = [];

    districtsSet.forEach(district => uniqueDistricts.push(district));

    const { isValid, missing } = await this.mapService.isDistrictsIdValid(uniqueDistricts);

    if (!isValid) {
      throw new ErrorException(CODES.TEC_017, undefined, missing);
    }

    return this.usersRepository.findOneAndUpdate({ authId }, { districts: uniqueDistricts });
  }

  @Span('Find User By Auth Id')
  async findUserByAuthId(authId: string): Promise<UserDocument> {
    this.logger.debug(
      `{${UsersService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        authId,
      })}`,
    );

    return this.usersRepository.findOne({ authId });
  }

  @Span('Create User')
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.debug(
      `{${UsersService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        createUserDto,
      })}`,
    );

    const existsUser = await this.usersRepository.findOne({
      authId: createUserDto.authId,
    });

    if (existsUser) {
      throw new ErrorException(CODES.TEC_027);
    }

    return this.usersRepository.create(createUserDto);
  }
}
