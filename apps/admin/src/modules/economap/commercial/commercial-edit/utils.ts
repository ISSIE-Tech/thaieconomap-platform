import type { CommercialItem } from '../types';
import type { FormSchema } from '../commercial-create/form-schema';

import { createFileFormUrl } from 'src/utils/get-file-form-url';

//--------------------------------------------------------------

const thaiToEnglishDayMap: Record<string, string> = {
  วันจันทร์: 'Monday',
  วันอังคาร: 'Tuesday',
  วันพุธ: 'Wednesday',
  วันพฤหัสบดี: 'Thursday',
  วันศุกร์: 'Friday',
  วันเสาร์: 'Saturday',
  วันอาทิตย์: 'Sunday',
};

const groupOpeningByTime = (
  displayOpening: CommercialItem['displayOpening']
): { day: string[]; openTime: string; closeTime: string }[] => {
  const openingMap = displayOpening.reduce<
    Record<string, { days: string[]; open: string; close: string }>
  >((acc, entry) => {
    const open = entry.time[0]?.open.toString().split('.').join(':') || '';
    const close = entry.time[0]?.close.toString().split('.').join(':') || '';
    const timeKey = `${open}-${close}`;

    if (!acc[timeKey]) {
      acc[timeKey] = { days: [], open, close };
    }

    const englishDay = thaiToEnglishDayMap[entry.days] || entry.days;
    acc[timeKey].days.push(englishDay);

    return acc;
  }, {});

  return Object.values(openingMap).map((item) => ({
    day: item.days,
    openTime: item.open,
    closeTime: item.close,
  }));
};

//-----------------------------------------------------------------------------------------------

export const reformatDefaultValues = async (
  commercial?: CommercialItem | null
): Promise<FormSchema> => ({
  name: commercial?.name || '',
  types: commercial?.types.map((type) => type._id) || [],
  commercialOwner: commercial?.commercialOwner || '',
  phoneNumber: commercial?.phoneNumber || '',
  province: commercial?.district.provinceName || null,
  district: commercial?.district._id || null,
  moreInfo: commercial?.moreInfo || '',
  opening: commercial ? groupOpeningByTime(commercial.displayOpening) : [],
  location: {
    latitude: commercial?.location.coordinates[1] || 0,
    longitude: commercial?.location.coordinates[0] || 0,
  },
  thumbnail: commercial ? await createFileFormUrl([commercial.imageUrl], 'image') : [],
  images: commercial ? await createFileFormUrl(commercial.additionalImageUrl, 'image') : [],
});

//------------------------------------------------------------------------------------------------
