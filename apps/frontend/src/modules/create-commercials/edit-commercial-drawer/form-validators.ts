import type { z } from 'zod';
import type { formSchema } from '../create-commercials-form/form-validators';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';

export type FormValues = z.infer<typeof formSchema>;

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
  displayOpening: Commercial['displayOpening']
): { day: string[]; openTime: string; closeTime: string }[] => {
  const openingMap = displayOpening.reduce<
    Record<string, { days: string[]; openTime: string; closeTime: string }>
  >((acc, entry) => {
    const openTime = entry.time[0]?.open.split('.').join(':') || '';
    const closeTime = entry.time[0]?.close.split('.').join(':') || '';
    const timeKey = `${openTime}-${closeTime}`;

    if (!acc[timeKey]) {
      acc[timeKey] = { days: [], openTime, closeTime };
    }

    const englishDay = thaiToEnglishDayMap[entry.days] || entry.days;
    acc[timeKey].days.push(englishDay);

    return acc;
  }, {});

  return Object.values(openingMap).map((item) => ({
    day: item.days,
    openTime: item.openTime,
    closeTime: item.closeTime,
  }));
};

//-----------------------------------------------------------------------------------------------

export const reformatDefaultValues = async (
  commercial?: Commercial | null
): Promise<FormValues> => ({
  name: commercial?.name || '',
  types: commercial?.types.map((type) => type._id) || [],
  commercialOwner: commercial?.commercialOwner || '',
  phoneNumber: commercial?.phoneNumber || '',
  province: commercial?.district.provinceName || null,
  district: commercial?.district._id || null,
  address: commercial?.address || '',
  moreInfo: commercial?.moreInfo || '',
  opening: commercial ? groupOpeningByTime(commercial.displayOpening) : [],
  location: {
    latitude: commercial?.location.coordinates[1] || 0,
    longitude: commercial?.location.coordinates[0] || 0,
  },
  image: commercial ? await createFileFormUrl([commercial.imageUrl]) : [],
  additionalImageUrl: commercial ? await createFileFormUrl(commercial.additionalImageUrl) : [],
});

//------------------------------------------------------------------------------------------------

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
