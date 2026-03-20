import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { toast } from 'src/shared/components/snackbar';

import type { FormValues } from './create-social-sharing-form/form-validators';
import type { CommercialError, additionalImageUpload } from './_types/create-social-sharing.type';

export const reformatFormData = async (
  data: FormValues,
  createAdditionalImage: UseMutateAsyncFunction<any, CommercialError, FormData, unknown>,
  loading: UseBooleanReturn,
  options?: {
    includeOldUrls?: boolean;
    oldBannerImage?: File;
  }
): Promise<FormData> => {
  const formData = new FormData();

  const latlngStr = JSON.stringify(data.location);
  const bannerImage = data.image?.[0];
  const contact = { name: data.ownerName, phoneNumber: data.phoneNumber };
  const amount = { amount: data.amount, unit: data.unit };

  const { oldUrls = [], newFiles = [] } = options?.includeOldUrls
    ? getNewUrlList(data.additionalImageUrl)
    : { oldUrls: [], newFiles: data.additionalImageUrl };

  const additionalImageUrl = (await mapAdditionalImage(newFiles, createAdditionalImage, loading))
    .map((item: additionalImageUpload) => item.data)
    .flat();

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'ownerName':
      case 'phoneNumber':
      case 'amount':
      case 'unit':
        break;
      case 'image':
        if (bannerImage.name !== options?.oldBannerImage?.name) {
          formData.append(key, bannerImage);
        }
        break;
      case 'location':
        if (latlngStr) {
          formData.append(key, latlngStr);
        }
        break;
      case 'additionalImageUrl':
        formData.append(key, JSON.stringify([...oldUrls, ...additionalImageUrl]));
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

//-------------------------------------------------------

export const mapAdditionalImage = async (
  images: File[],
  createAdditionalImage: UseMutateAsyncFunction<any, CommercialError, FormData, unknown>,
  loading: UseBooleanReturn
): Promise<additionalImageUpload[]> => {
  const imageList: File[] = [];
  const handleImageUpload = async (batch: File[]) => {
    const formData = new FormData();

    batch.forEach((image) => {
      formData.append('image', image);
    });

    return createAdditionalImage(formData, {
      onError: (error) => {
        toast.error(error.display);
        loading.onFalse();
      },
    });
  };

  const uploadPromises: Promise<additionalImageUpload>[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const image of images) {
    if (imageList.length < 5) {
      imageList.push(image);
    } else {
      uploadPromises.push(handleImageUpload([...imageList]));
      imageList.length = 0;
      imageList.push(image);
    }
  }

  if (imageList.length > 0) {
    uploadPromises.push(handleImageUpload(imageList));
  }

  const uploadResult = await Promise.all(uploadPromises);

  return uploadResult;
};

//-----------------------------------------------------------------------

const getNewUrlList = (files: File[]) => {
  const oldUrls: string[] = [];
  const newFiles: File[] = [];

  files.forEach((file) => {
    if (file.name.startsWith('shares/')) {
      oldUrls.push(file.name);
    } else {
      newFiles.push(file);
    }
  });

  return {
    oldUrls,
    newFiles,
  };
};
