import { AnnouncementResponseDto } from '@thaieconomap/contracts';

import { toRef } from '../../../shared/utils/ref.util';
import { AnnouncementDocument } from '../schemas/announcement.schema';

export class AnnouncementMapper {
  static toResponseDto(doc: AnnouncementDocument): AnnouncementResponseDto {
    const obj = doc.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      name: obj.name,
      pdfUrl: obj.pdfUrl,
      detail: obj.detail,
      districts: obj.districts?.map(toRef),
      subDistricts: obj.subDistricts,
      startAt: obj.startAt,
      endAt: obj.endAt,
      announcer: obj.announcer,
      phoneNumber: obj.phoneNumber,
      createdBy: toRef(obj.createdBy),
      expiredAutoDelete: obj.expiredAutoDelete,
      isAvailable: (obj as Record<string, unknown>).isAvailable as boolean | undefined,
      status: (obj as Record<string, unknown>).status as AnnouncementResponseDto['status'],
      createdAt: (obj as Record<string, unknown>).createdAt as Date,
      updatedAt: (obj as Record<string, unknown>).updatedAt as Date,
    };
  }
}
