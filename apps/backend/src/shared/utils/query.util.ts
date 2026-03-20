import { AnyBulkWriteOperation, Document, FilterQuery, UpdateQuery } from 'mongoose';

import { EntityRepository } from '../database';
import { GeoJsonType } from '../enums';
import { IValidEntity } from '../interfaces';

export type IsFavorite = {
  isFavorite: boolean;
};

export const createGeoNearQuery = (
  latitude: number,
  longitude: number,
  maxDistance: number,
  minDistance: number,
) => {
  return {
    $geoNear: {
      key: 'location',
      near: {
        type: GeoJsonType.POINT,
        coordinates: [longitude, latitude],
      },
      distanceField: 'distance',
      maxDistance,
      minDistance,
      spherical: true,
    },
  };
};

export const updateOneQuery = <T>(
  filterQuery: FilterQuery<T>,
  updateQuery: UpdateQuery<T>,
): AnyBulkWriteOperation => {
  return {
    updateOne: {
      filter: filterQuery,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: updateQuery as any,
      upsert: true,
    },
  };
};

export const createNearQuery = (
  latitude: number,
  longitude: number,
  maxDistance: number,
  minDistance: number,
) => {
  return {
    $near: {
      $geometry: {
        type: GeoJsonType.POINT,
        coordinates: [longitude, latitude],
      },
      $maxDistance: maxDistance,
      $minDistance: minDistance,
    },
  };
};

export const isEntitiesIdValid = async <T extends Document>(
  entitiesId: string[],
  entityRepository: EntityRepository<T>,
): Promise<IValidEntity> => {
  const uniqueEntities = new Set(entitiesId);
  const validEntities = await entityRepository.find({ _id: entitiesId });
  const isValid = validEntities.length === uniqueEntities.size;
  const missing: string[] = [];

  if (!isValid) {
    const validEntitiesId = validEntities.map(entity => String(entity._id));

    missing.push(...getDiffValidEntities(entitiesId, validEntitiesId));
  }

  return {
    isValid,
    missing,
  };
};

export const getDiffValidEntities = (entitiesId: string[], validEntities: string[]): string[] => {
  const existsIdSet = new Set(validEntities);

  return entitiesId.filter(id => !existsIdSet.has(id));
};
