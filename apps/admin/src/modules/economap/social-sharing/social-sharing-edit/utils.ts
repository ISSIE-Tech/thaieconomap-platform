import type { SocialSharingItem } from '../types';
import type { FormSchema } from '../social-sharing-create/form-schema';

import { createFileFormUrl } from 'src/utils/get-file-form-url';

export const reformatDefaultValues = async (
  sharing?: SocialSharingItem | null
): Promise<FormSchema> => ({
  name: sharing?.name || '',
  types: sharing?.types.map((type) => type._id) || [],
  province: sharing?.district.provinceName || null,
  district: sharing?.district._id || null,
  detail: sharing?.detail || '',
  moreDetail: sharing?.moreDetail || '',
  condition: sharing?.condition._id || '',
  location: {
    latitude: sharing?.location.coordinates[1] || 0,
    longitude: sharing?.location.coordinates[0] || 0,
  },
  amount: sharing?.amount.amount || 0,
  unit: sharing?.amount.unit || '',
  ownerName: sharing?.contact.name || '',
  phoneNumber: sharing?.contact.phoneNumber || '',
  thumbnail: sharing ? await createFileFormUrl([sharing.imageUrl], 'image') : [],
  images: sharing ? await createFileFormUrl(sharing.additionalImageUrl, 'image') : [],
});
