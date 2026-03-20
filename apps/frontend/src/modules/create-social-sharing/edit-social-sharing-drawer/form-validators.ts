import type { z } from 'zod';
import type { Sharing } from 'src/modules/sharings/_types/sharing.type';

import type { formSchema } from '../create-social-sharing-form/form-validators';

export type FormValues = z.infer<typeof formSchema>;

export const reformatDefaultValues = async (sharing: Sharing): Promise<FormValues> => ({
  name: sharing.name || '',
  types: sharing.types.map((type) => type._id) || [],
  province: sharing.district.provinceName || null,
  district: sharing.district._id || null,
  detail: sharing.detail || '',
  moreDetail: sharing.moreDetail || '',
  condition: sharing.condition._id || '',
  location: {
    latitude: sharing.location.coordinates[1] || 0,
    longitude: sharing.location.coordinates[0] || 0,
  },
  amount: sharing.amount.amount || 0,
  unit: sharing.amount.unit || '',
  ownerName: sharing.contact.name || '',
  phoneNumber: sharing.contact.phoneNumber || '',
  image: (await createFileFormUrl([sharing.imageUrl])) || [],
  additionalImageUrl: (await createFileFormUrl(sharing.additionalImageUrl)) || [],
});

const createFileFormUrl = async (urlList: string[]): Promise<File[]> =>
  Promise.all(urlList.map(getFile));

const getFile = async (url: string) => {
  const thaiEcoUrl = 'https://storage.thaieconomap.com/thaieconomap-backend-dev/';
  const resp = await fetch(url);
  const blob = await resp.blob();
  const mimeType = `image/${getImageType(url)}`;
  const newUrl = url.split(thaiEcoUrl)[1].split('?')[0];
  return new File([blob], newUrl, { type: mimeType });
};

const getImageType = (url: string) => {
  const match = url.match(/\.(\w+)(?:\?|$)/);
  return match ? match[1] : 'Unknown';
};
