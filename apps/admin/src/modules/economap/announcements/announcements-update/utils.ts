import { createFileFormUrl } from 'src/utils/get-file-form-url';

import type { AnnouncementItem } from '../types';
import type { FormSchema } from '../announcements-create/form-schema';

export const reformatDefaultValues = async (
  announcement: AnnouncementItem
): Promise<FormSchema> => ({
  name: announcement.name,
  detail: announcement.detail,
  districts: announcement.districts.map((district) => district._id),
  subDistricts: announcement.subDistricts || '',
  startAt: announcement.startAt,
  endAt: announcement.endAt,
  announcer: announcement.announcer,
  phoneNumber: announcement.phoneNumber,
  pdf: await createFileFormUrl([announcement.pdfUrl], 'pdf'),
});
