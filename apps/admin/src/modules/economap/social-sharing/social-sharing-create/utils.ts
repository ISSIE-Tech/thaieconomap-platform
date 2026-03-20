import type { UseBooleanReturn } from 'src/hooks/use-boolean';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { EconomapError, AdditionalImageUpload } from 'src/types/economap.type';

import { getNewUrlList, mapAdditionalImage } from 'src/utils/map-additionalImage';

import type { FormSchema } from './form-schema';

export const reformatFormData = async (
  data: FormSchema,
  createAdditionalImage: UseMutateAsyncFunction<any, EconomapError, FormData, unknown>,
  loading: UseBooleanReturn,
  options?: {
    includeOldUrls?: boolean;
  }
): Promise<FormData> => {
  const formData = new FormData();

  const latlngStr = JSON.stringify(data.location);
  const bannerImage = data.thumbnail?.[0];
  const contact = { name: data.ownerName, phoneNumber: data.phoneNumber };
  const amount = { amount: data.amount, unit: data.unit };

  const { oldUrls = [], newFiles = [] } = options?.includeOldUrls
    ? getNewUrlList(data.images, 'shares/')
    : { oldUrls: [], newFiles: data.images };
  const imagesUrl = (await mapAdditionalImage(newFiles, createAdditionalImage, loading))
    .map((item: AdditionalImageUpload) => item.data)
    .flat();

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'ownerName':
      case 'phoneNumber':
      case 'amount':
      case 'unit':
        break;
      case 'thumbnail':
        if (bannerImage) {
          formData.append('image', bannerImage);
        }
        break;
      case 'location':
        if (latlngStr) {
          formData.append(key, latlngStr);
        }
        break;
      case 'images':
        formData.append('additionalImageUrl', JSON.stringify([...oldUrls, ...imagesUrl]));
        break;
      case 'types':
        formData.append(key, JSON.stringify(value));
        break;
      default:
        if (typeof value === 'string') {
          formData.append(key, value);
        }
        break;
    }
  }

  formData.append('amount', JSON.stringify(amount));
  formData.append('contact', JSON.stringify(contact));

  return formData;
};
