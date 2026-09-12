import {
  DeletedShareResponseDto,
  PaginationResponseDto,
  PendingShareResponseDto,
  ShareResponseDto,
  ShareTinyResponseDto,
  SubmissionStatus,
} from '@thaieconomap/contracts';

import { toRef } from '../../../shared/utils/ref.util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = any;

export class ShareMapper {
  static toResponseDto(doc: AnyDoc): ShareResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      types: obj.types?.map(toRef),
      location: obj.location,
      imageUrl: obj.imageUrl,
      createdBy: toRef(obj.createdBy),
      address: obj.address,
      district: toRef(obj.district),
      detail: obj.detail,
      contact: obj.contact,
      amount: obj.amount,
      shipping: toRef(obj.shipping),
      condition: toRef(obj.condition),
      moreDetail: obj.moreDetail,
      additionalImageUrl: obj.additionalImageUrl,
      status: obj.status,
      requests: obj.requests?.map((r: AnyDoc) => ({
        user: toRef(r.user),
        status: r.status as SubmissionStatus,
      })),
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      approvedAt: obj.approvedAt,
      approvedBy: toRef(obj.approvedBy),
      lastModifiedAt: obj.lastModifiedAt,
      lastModifiedBy: toRef(obj.lastModifiedBy),
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toTinyResponseDto(doc: AnyDoc): ShareTinyResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      types: obj.types?.map?.((t: AnyDoc) => typeof t === 'object' ? { _id: t._id?.toString(), name: t.name } : t) ?? obj.types,
      location: obj.location,
      imageUrl: obj.imageUrl,
      address: obj.address,
      district: toRef(obj.district),
      amount: obj.amount,
      status: obj.status,
      isFavorite: obj.isFavorite,
    };
  }

  static toPendingResponseDto(doc: AnyDoc): PendingShareResponseDto {
    const obj = doc?.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      types: obj.types?.map(toRef),
      location: obj.location,
      imageUrl: obj.imageUrl,
      createdBy: toRef(obj.createdBy),
      address: obj.address,
      district: toRef(obj.district),
      detail: obj.detail,
      contact: obj.contact,
      amount: obj.amount,
      shipping: toRef(obj.shipping),
      condition: toRef(obj.condition),
      moreDetail: obj.moreDetail,
      additionalImageUrl: obj.additionalImageUrl,
      submissionStatus: obj.submissionStatus,
      submissionMessage: obj.submissionMessage,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  static toDeletedResponseDto(doc: AnyDoc): DeletedShareResponseDto {
    const base = ShareMapper.toResponseDto(doc);
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
