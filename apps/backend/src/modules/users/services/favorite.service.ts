import { Injectable, Logger } from '@nestjs/common';

import { FavoriteCategories, FavoriteType } from '@thaieconomap/contracts';
import { isNumber } from 'class-validator';
import { Types } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../../common/exceptions';
import { CONFIG } from '../../../config';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { CODES } from '../../../shared/constants';
import {
  FavoriteTarget,
  IFavoriteList,
  IFavoriteListResponse,
  IUser,
} from '../../../shared/interfaces';
import { getSpanName, prettyObjectString, transformFileUrlsInArray } from '../../../shared/utils';
import { GetFavoriteDto } from '../dto/get-favorite.dto';
import { FavoriteRepository } from '../repositories';
import { FavoriteCategoriesMapper, FavoriteDocument, FavoriteTypeMapper } from '../schemas';

@Injectable()
export class FavoriteService {
  private readonly logger: Logger = new Logger(FavoriteService.name);

  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly minioClientService: MinioClientService,
  ) {}

  @Span('Favorite')
  async favorite(
    user: IUser,
    target: FavoriteTarget,
    type: FavoriteType,
  ): Promise<FavoriteDocument> {
    const ctx = `{${FavoriteService.name}-[${getSpanName()}]}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        targetId: target._id,
        type,
      })}`,
    );

    const newFavorite = {
      userId: user._id,
      type,
    };

    const favoriteAmount = await this.favoriteRepository.countDocuments(newFavorite);

    this.logger.verbose(
      `{${ctx}} (current user favorite amount) favoriteAmount:${favoriteAmount}})}`,
    );

    if (favoriteAmount >= CONFIG.MAXIMUM_FAVORITE) {
      throw new ErrorException(CODES.TEC_039);
    }

    newFavorite['targetId'] = target._id;

    const isFavorite = await this.isFavoriteTheTarget(user, target);

    this.logger.verbose(
      `{${ctx}} (is favorite) is favorite the target (${target._id}): ${isFavorite})}`,
    );

    if (isFavorite) {
      throw new ErrorException(CODES.TEC_038);
    }

    return this.favoriteRepository.create(newFavorite);
  }

  @Span('Unfavorite')
  async unfavorite(user: IUser, target: FavoriteTarget, type: FavoriteType): Promise<void> {
    this.logger.debug(
      `{${FavoriteService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        targetId: target._id,
        type,
      })}`,
    );

    const deletedFavorite = await this.favoriteRepository.findOneAndDelete({
      userId: user._id,
      targetId: target._id,
      type,
    });

    if (!deletedFavorite) {
      throw new ErrorException(CODES.TEC_037);
    }
  }

  @Span('Get Favorite By User Id')
  async getFavoriteByUserId(
    userId: string,
    getFavoriteDto: GetFavoriteDto,
  ): Promise<IFavoriteListResponse> {
    this.logger.debug(
      `{${FavoriteService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId,
        getFavoriteDto,
      })}`,
    );

    const favoriteList: IFavoriteList[] = await this.favoriteRepository.getFavoriteByUserId(userId);

    return this.formatFavoriteList(favoriteList, getFavoriteDto.category);
  }

  @Span('Get Favorite By Target Id')
  async deleteFavoriteByTargetId(targetId: Types.ObjectId[], type: FavoriteType): Promise<boolean> {
    this.logger.debug(
      `{${FavoriteService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        targetId,
        type,
      })}`,
    );

    return this.favoriteRepository.deleteMany({ targetId, type });
  }

  @Span('Is Favorite The Target')
  async isFavoriteTheTarget(user: IUser, target: FavoriteTarget): Promise<boolean> {
    this.logger.debug(
      `{${FavoriteService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        userId: user._id,
        targetId: target._id,
      })}`,
    );

    return Boolean(
      await this.favoriteRepository.findOne({ userId: user._id, targetId: target._id }),
    );
  }

  @Span('Format Favorite List')
  private async formatFavoriteList(
    favoriteList: IFavoriteList[],
    categoryQuery?: string,
  ): Promise<IFavoriteListResponse> {
    this.logger.debug(
      `{${FavoriteService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        favoriteListLenght: favoriteList?.length,
        categoryQuery,
      })}`,
    );

    const results: IFavoriteListResponse = this.createDefaultFavoriteList();

    favoriteList.forEach(async group => {
      const { _id: type, ...item } = group;
      const typeName = FavoriteTypeMapper.get(type);
      const isCommercials = type === FavoriteType.BUSINESSES || type === FavoriteType.RESTAURANTS;
      const groupCategory = FavoriteCategoriesMapper.get(type);

      if (!typeName) {
        //logging
        return;
      }

      if (!groupCategory) {
        //logging
        return;
      }

      if (categoryQuery && groupCategory !== categoryQuery) {
        return;
      }

      const category = groupCategory.toLowerCase();
      const responseCategory = results[category];
      const formattedItem = await transformFileUrlsInArray(this.minioClientService, item.targets);

      if (isCommercials) {
        responseCategory[typeName].push(...formattedItem);
      } else {
        results[category].push(...formattedItem);
      }
    });

    return results;
  }

  @Span('Create Default Favorite List')
  private createDefaultFavoriteList(): IFavoriteListResponse {
    this.logger.debug(`{${FavoriteService.name}-[${getSpanName()}]} (called)`);

    const results = {} as IFavoriteListResponse;

    Object.values(FavoriteCategories).forEach(category => {
      const isNotCommercials =
        category === FavoriteCategories.SHARES || category === FavoriteCategories.PUMPUANGS;

      results[category.toLowerCase()] = isNotCommercials ? [] : {};
    });

    const favoriteType = Object.values(FavoriteType).filter(type => isNumber(Number(type)));

    favoriteType.forEach((type: number) => {
      const mappedType = FavoriteTypeMapper.get(type);
      const isNotCommercials = type === FavoriteType.SHARES || type === FavoriteType.PUMPUANGS;
      const commercialsCategories = FavoriteCategories.COMMERCIALS.toLowerCase();

      if (!isNotCommercials) {
        Object.assign(results[commercialsCategories], { [mappedType]: [] });
      }
    });

    return results;
  }
}
