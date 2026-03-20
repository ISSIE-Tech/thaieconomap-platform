import {
  DeletedPumpuangResponseDto,
  PaginationResponseDto,
  PendingPumpuangResponseDto,
  PumpuangResponseDto,
  PumpuangTinyResponseDto,
} from '@thaieconomap/contracts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = any;

export class PumpuangMapper {
  static toResponseDto(doc: AnyDoc): PumpuangResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      licensePlate: obj.licensePlate,
      owner: obj.owner,
      color: obj.color,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      imageUrl: obj.imageUrl,
      additionalImageUrl: obj.additionalImageUrl,
      opening: obj.opening,
      displayOpening: obj.displayOpening,
      types: obj.types?.map((t: AnyDoc) => t?.toString()),
      status: obj.status,
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

  static toTinyResponseDto(doc: AnyDoc): PumpuangTinyResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      current: obj.current,
    };
  }

  static toPendingResponseDto(doc: AnyDoc): PendingPumpuangResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      licensePlate: obj.licensePlate,
      owner: obj.owner,
      color: obj.color,
      phoneNumber: obj.phoneNumber,
      moreInfo: obj.moreInfo,
      imageUrl: obj.imageUrl,
      additionalImageUrl: obj.additionalImageUrl,
      opening: obj.opening,
      displayOpening: obj.displayOpening,
      types: obj.types?.map((t: AnyDoc) => t?.toString()),
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      createdBy: obj.createdBy?.toString(),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toDeletedResponseDto(doc: AnyDoc): DeletedPumpuangResponseDto {
    const base = PumpuangMapper.toResponseDto(doc);
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
