import type { Opening, CommercialType } from './types';
import type { DateSchema, FormSchema } from './form-schema';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';

import type { UseBooleanReturn } from 'src/hooks/use-boolean';

import { getNewUrlList, mapAdditionalImage } from 'src/utils/map-additionalImage';

import type { EconomapError, AdditionalImageUpload } from 'src/types/economap.type';

import { CommercialTypeLabel } from './types';

export const reformatFormData = async (
  data: FormSchema,
  commercialType: CommercialType,
  createAdditionalImage: UseMutateAsyncFunction<any, EconomapError, FormData, unknown>,
  loading: UseBooleanReturn,
  options?: {
    includeOldUrls?: boolean;
  }
): Promise<FormData> => {
  const formData = new FormData();
  const category = CommercialTypeLabel[commercialType];
  const newDate = data.opening ? JSON.stringify(reformatDateData(data.opening)) : null;
  const latlngStr = data.location ? JSON.stringify(data.location) : null;
  const bannerImage = data.thumbnail?.[0];
  const { oldUrls = [], newFiles = [] } = options?.includeOldUrls
    ? getNewUrlList(data.images, 'commercials/')
    : { oldUrls: [], newFiles: data.images };
  const additionalImageUrl = (await mapAdditionalImage(newFiles, createAdditionalImage, loading))
    .map((item: AdditionalImageUpload) => item.data)
    .flat();

   
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'thumbnail':
        if (bannerImage) {
          formData.append('image', bannerImage);
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
      case 'images':
        formData.append('additionalImageUrl', JSON.stringify([...oldUrls, ...additionalImageUrl]));
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
