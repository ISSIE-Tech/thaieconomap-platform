import {
  CommercialResponseDto,
  CommercialTinyResponseDto,
  DeletedCommercialResponseDto,
  PaginationResponseDto,
  PendingCommercialResponseDto,
} from '@thaieconomap/contracts';

import { toRef } from '../../../shared/utils/ref.util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = any;

export class CommercialMapper {
  static toResponseDto(doc: AnyDoc): CommercialResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      category: obj.category,
      location: obj.location,
      imageUrl: obj.imageUrl,
      opening: obj.opening,
      displayOpening: obj.displayOpening,
      district: toRef(obj.district),
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
      types: obj.types?.map(toRef),
      typeRefPath: obj.typeRefPath,
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      approvedAt: obj.approvedAt,
      approvedBy: toRef(obj.approvedBy),
      lastModifiedAt: obj.lastModifiedAt,
      lastModifiedBy: toRef(obj.lastModifiedBy),
      createdBy: toRef(obj.createdBy),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toTinyResponseDto(doc: AnyDoc): CommercialTinyResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      category: obj.category,
      location: obj.location,
      imageUrl: obj.imageUrl,
      displayOpening: obj.displayOpening,
      district: toRef(obj.district),
      types: obj.types?.map?.((t: AnyDoc) => typeof t === 'object' ? { _id: t._id?.toString(), name: t.name } : t) ?? obj.types,
      isFavorite: obj.isFavorite,
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
      // Shops only. Without this the client cannot offer the node's LINE OA.
      base: obj.base
        ? {
            _id: obj.base._id?.toString(),
            name: obj.base.name,
            botInfo: obj.base.botInfo,
          }
        : undefined,
    };
  }

  static toPendingResponseDto(doc: AnyDoc): PendingCommercialResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      category: obj.category,
      location: obj.location,
      imageUrl: obj.imageUrl,
      opening: obj.opening,
      displayOpening: obj.displayOpening,
      district: toRef(obj.district),
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
      types: obj.types?.map(toRef),
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      createdBy: toRef(obj.createdBy),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toDeletedResponseDto(doc: AnyDoc): DeletedCommercialResponseDto {
    const base = CommercialMapper.toResponseDto(doc);
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      ...base,
      deletedBy: toRef(obj.deletedBy) ?? '',
      deletedAutoDelete: obj.deletedAutoDelete,
      completelyDeletedAt: obj.completelyDeletedAt,
    };
  }

  static toPaginatedResponseDto<T>(
    data: AnyDoc,
    mapper: (doc: AnyDoc) => T,
  ): PaginationResponseDto<T> {
    return {
      data: data.data.map(mapper),
      metaData: {
        perPage: data.metaData.perPage,
        count: data.metaData.count,
        prevPage: data.metaData.prevPage,
        currentPage: data.metaData.currentPage,
        nextPage: data.metaData.nextPage,
        lastPage: data.metaData.lastPage,
      },
    };
  }
}
