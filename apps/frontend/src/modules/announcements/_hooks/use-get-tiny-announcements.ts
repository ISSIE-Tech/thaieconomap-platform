import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { ANNOUNCEMENTS_FILTER_TYPES } from '../_constants/location';
import { useAnnouncementsFilter } from './use-announcements-filter';
import { getTinyAnnouncements } from '../_services/announcements.service';

const useGetTinyAnnouncements = () => {
  const { announcementsLocation, locationType, announcementsDate } = useAnnouncementsFilter();

  // ex: date=2024-11-11T17:19:52Z&provinceId=10&district=66506b632c35732f0159133f
  // NOTE: when you click the Autocomplete (or whatever use this), the queryKey will change because the announcementsDate change every second, so it just fetches again, not really a bug
  // in case you want to check for announcement at 18:00 today or something
  const queryString = useMemo(
    () =>
      Object.entries({
        date: announcementsDate,
        ...(locationType === ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
          ? { district: announcementsLocation }
          : { provinceId: announcementsLocation }),
      })
        .filter(([_, value]) => value) // filter out entries with falsy values
        .map(([key, value]) => `${key}=${value}`)
        .join('&'),
    [announcementsDate, announcementsLocation, locationType]
  );

  return useQuery({
    queryKey: [QUERY_KEY.ANNOUNCEMENTS, queryString],
    queryFn: getTinyAnnouncements,
  });
};

export default useGetTinyAnnouncements;
