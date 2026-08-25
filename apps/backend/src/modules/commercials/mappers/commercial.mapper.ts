import {
  CommercialResponseDto,
  CommercialTinyResponseDto,
  DeletedCommercialResponseDto,
  PaginationResponseDto,
  PendingCommercialResponseDto,
} from '@thaieconomap/contracts';

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
      district: obj.district?.toString(),
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
      types: obj.types?.map((t: AnyDoc) => t?.toString()),
      typeRefPath: obj.typeRefPath,
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      approvedAt: obj.approvedAt,
      approvedBy: obj.approvedBy?.toString(),
      lastModifiedAt: obj.lastModifiedAt,
      lastModifiedBy: obj.lastModifiedBy?.toString(),
      createdBy: obj.createdBy?.toString(),
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
      district: obj.district?.toString(),
      types: obj.types?.map?.((t: AnyDoc) => typeof t === 'object' ? { _id: t._id?.toString(), name: t.name } : t) ?? obj.types,
      isFavorite: obj.isFavorite,
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
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
      district: obj.district?.toString(),
      commercialOwner: obj.commercialOwner,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      additionalImageUrl: obj.additionalImageUrl,
      types: obj.types?.map((t: AnyDoc) => t?.toString()),
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      createdBy: obj.createdBy?.toString(),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toDeletedResponseDto(doc: AnyDoc): DeletedCommercialResponseDto {
    const base = CommercialMapper.toResponseDto(doc);
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      ...base,
      deletedBy: obj.deletedBy?.toString() ?? '',
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
