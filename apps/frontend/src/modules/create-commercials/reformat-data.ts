import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { toast } from 'sonner';

import { CommercialTypeLabel } from './_types/create-commercials.type';

import type { DateSchema, FormValues } from './create-commercials-form/form-validators';
import type {
  Opening,
  CommercialType,
  CommercialError,
  additionalImageUpload,
} from './_types/create-commercials.type';

export const reformatFormData = async (
  data: FormValues,
  commercialType: CommercialType,
  createAdditionalImage: UseMutateAsyncFunction<any, CommercialError, FormData, unknown>,
  loading: UseBooleanReturn,
  options?: {
    includeOldUrls?: boolean;
    oldBannerImage?: File;
  }
): Promise<FormData> => {
  const formData = new FormData();
  const category = CommercialTypeLabel[commercialType];
  const newDate = data.opening ? JSON.stringify(reformatDateData(data.opening)) : null;
  const latlngStr = data.location ? JSON.stringify(data.location) : null;
  const bannerImage = data.image?.[0];

  const { oldUrls = [], newFiles = [] } = options?.includeOldUrls
    ? getNewUrlList(data.additionalImageUrl)
    : { oldUrls: [], newFiles: data.additionalImageUrl };

  const additionalImageUrl = (await mapAdditionalImage(newFiles, createAdditionalImage, loading))
    .map((item: additionalImageUpload) => item.data)
    .flat();

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'image':
        if (bannerImage.name !== options?.oldBannerImage?.name) {
          formData.append(key, bannerImage);
        }
        break;
      case 'opening':
        if (newDate) {
          formData.append(key, newDate);
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

  formData.append('category', category);

  return formData;
};

//---------------------------------------------------------------------------

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

//---------------------------------------------------------------------------

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(/[:.]/).map(Number);

  return hours * 60 + minutes;
};

export const reformatDateData = (dateData: DateSchema[]): Opening[] => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formattedData: Opening[] = daysOfWeek.map((day) => ({
    enable: false,
    day,
    hours: [],
  }));

  dateData.forEach((entry) => {
    entry.day.forEach((day) => {
      const dayEntry = formattedData.find((formattedDay) => formattedDay.day === day);

      if (dayEntry) {
        dayEntry.enable = true;
        dayEntry.hours.push({
          open: timeToMinutes(entry.openTime),
          close: timeToMinutes(entry.closeTime),
        });
      }
    });
  });

  return formattedData;
};

//-------------------------------------------------

const getNewUrlList = (files: File[]) => {
  const oldUrls: string[] = [];
  const newFiles: File[] = [];

  files.forEach((file) => {
    if (file.name.startsWith('commercials/')) {
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
