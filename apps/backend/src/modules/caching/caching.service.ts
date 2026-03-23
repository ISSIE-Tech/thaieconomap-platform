import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CommercialCategory, FavoriteType } from '@thaieconomap/contracts';
import { AnyBulkWriteOperation, Types } from 'mongoose';
import { Span } from 'nestjs-otel';

import { ErrorException } from '../../common/exceptions';
import { CODES } from '../../shared/constants';
import {
  ITamsangTamsongBaseShopResponse,
  ITamsangTamsongShopResponse,
} from '../../shared/interfaces';
import { getSpanName, prettyObjectString, updateOneQuery } from '../../shared/utils';
import { TamsangTamsongService } from '../externals/services';
import { FavoriteService } from '../users/services';

import { CachingMapper } from './mapper';
import { BaseRepository, ShopRepository } from './repositories';
import { ShopDocument } from './schemas';

@Injectable()
export class CachingService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly baseRepository: BaseRepository,
    private readonly tamsangTamsongService: TamsangTamsongService,
    private readonly favoriteService: FavoriteService,
  ) {}

  private readonly logger: Logger = new Logger(CachingService.name);

  private readonly favoriteTypeMap = new Map<CommercialCategory, FavoriteType>([
    [CommercialCategory.RESTAURANT, FavoriteType.RESTAURANTS],
    [CommercialCategory.BUSINESS, FavoriteType.BUSINESSES],
  ]);

  @Span('Update Shop And Base Cache')
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateShopAndBaseCache(): Promise<void> {
    try {
      const ctx = `${CachingService.name}-[${getSpanName()}]`;

      this.logger.debug(`{${ctx}} (called)`);

      const [bases, shops] = await Promise.all([
        this.tamsangTamsongService.listBases(),
        this.tamsangTamsongService.listShops(),
      ]);

      this.logger.verbose(
        `{${ctx}} (get bases and shop from tamsang-tamsong api) data:\n${prettyObjectString({
          bases,
          shops,
        })}`,
      );

      if (bases.length > 0) {
        const mapBasesData = this.mapBaseDataToUpdateOneQuery(bases);

        this.logger.verbose(
          `{${ctx}} (map base data to update one query) bases:\n${prettyObjectString({ mapBasesData })}`,
        );

        await this.updateBaseCacheData(mapBasesData);
      }

      if (shops.length > 0) {
        const cleanShopsData = this.mapShopDataToUpdateOneQuery(shops);

        this.logger.verbose(
          `{${ctx}} (map shop data to update one query) shops:\n${prettyObjectString({ cleanShopsData })}`,
        );

        await this.updateShopCacheData(cleanShopsData);
      }

      this.logger.log('Caching data updated successfully');
    } catch (_error) {
      throw new ErrorException(CODES.TEC_004);
    }
  }

  @Span('Update Base Cache Data')
  private async updateBaseCacheData(
    updatedBases: Map<string, AnyBulkWriteOperation>,
  ): Promise<void> {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        updatedBases,
      })}`,
    );

    const updatedBaseIds = Array.from(updatedBases.keys());

    if (updatedBaseIds.length > 0) {
      await this.baseRepository.deleteMany({ _id: { $nin: updatedBaseIds } });
    }

    await this.baseRepository.bulkWrite(Array.from(updatedBases.values()));
  }

  @Span('Update Shop Cache Data')
  private async updateShopCacheData(newShops: Map<string, AnyBulkWriteOperation>): Promise<void> {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        newShops,
      })}`,
    );

    const currentShops = await this.shopRepository.find({}, { _id: 1, category: 1 });
    const shopsToRemove = currentShops.filter(shop => !newShops.has(String(shop._id)));

    if (shopsToRemove.length > 0) {
      const mapShopsToRemoveByFavoriteType = this.mapShopIdsByFavoriteType(shopsToRemove);

      for (const [favoriteType, shopIds] of mapShopsToRemoveByFavoriteType) {
        await this.shopRepository.deleteMany({ _id: { $in: shopIds } });

        await this.favoriteService.deleteFavoriteByTargetId(shopIds, favoriteType);
      }
    }

    await this.shopRepository.bulkWrite(Array.from(newShops.values()));
  }

  @Span('Map Shop Ids By Favorite Type')
  private mapShopIdsByFavoriteType(shops: ShopDocument[]): Map<FavoriteType, Types.ObjectId[]> {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shops,
      })}`,
    );

    const shopMap = new Map<FavoriteType, Types.ObjectId[]>();

    for (const shop of shops) {
      if (shop.category) {
        const favoriteType = this.favoriteTypeMap.get(shop.category);

        if (shopMap.has(favoriteType)) {
          shopMap.get(favoriteType).push(shop._id);
        } else {
          shopMap.set(favoriteType, [shop._id]);
        }
      }
    }

    return shopMap;
  }

  @Span('Map Shop Data To Update One Query')
  private mapShopDataToUpdateOneQuery(
    shops: ITamsangTamsongShopResponse[],
  ): Map<string, AnyBulkWriteOperation> {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shops,
      })}`,
    );

    const shopMap = new Map<string, AnyBulkWriteOperation>();

    for (const shop of shops) {
      if (this.isValidShopData(shop)) {
        const transformedShop = CachingMapper.transformTamsangTamsongShopToShop(shop);

        shopMap.set(shop.id, updateOneQuery({ _id: shop.id }, { $set: transformedShop }));
      }
    }

    return shopMap;
  }

  @Span('Is Valid Shop Data')
  private isValidShopData(shop: ITamsangTamsongShopResponse): boolean {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        shop,
      })}`,
    );

    const { id, name, location, imgUrl, opening, profile, base, group, openDay, type } = shop;
    const { address, latitude, longitude } = location;
    const { firstname, lastname, phone } = profile;

    return Boolean(
      id &&
      name &&
      address &&
      latitude &&
      longitude &&
      imgUrl &&
      openDay &&
      opening &&
      firstname &&
      lastname &&
      phone &&
      base &&
      group &&
      type,
    );
  }

  @Span('Map Base Data To Update One Query')
  private mapBaseDataToUpdateOneQuery(
    bases: ITamsangTamsongBaseShopResponse[],
  ): Map<string, AnyBulkWriteOperation> {
    this.logger.debug(
      `{${CachingService.name}-[${getSpanName()}]} (called)\
      \n[param] ${prettyObjectString({
        bases,
      })}`,
    );

    const baseMap = new Map<string, AnyBulkWriteOperation>();

    for (const base of bases) {
      const transformedBase = CachingMapper.transformTamsangTamsongBaseShopToBase(base);

      baseMap.set(base.id, updateOneQuery({ _id: base.id }, { $set: transformedBase }));
    }

    return baseMap;
  }
}
