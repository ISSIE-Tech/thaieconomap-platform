import { useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ANNOUNCEMENTS_FILTER_TYPES } from '../_constants/location';
import { useAnnouncementsStore } from '../_stores/announcements.store';

import type { LocationType } from '../_constants/location';

export const useAnnouncementsFilter = () => {
  const {
    searchLocationFilter: announcementsLocation,
    dateFilter: announcementsDate,
    locationType,
    actions,
  } = useAnnouncementsStore();
  const { setSearchLocationFilter, resetSearchLocationFilter, setDateFilter } = actions;

  const searchParams = useSearchParams();
  const router = useRouter();

  const today = useMemo(() => new Date(), []);

  // set state in store from url query params
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());

    // if url has no date, set date to today
    setDateFilter(
      !query.has(ANNOUNCEMENTS_FILTER_TYPES.DATE)
        ? today.toISOString()
        : (query.get(ANNOUNCEMENTS_FILTER_TYPES.DATE) as string)
    );

    if (query.has(ANNOUNCEMENTS_FILTER_TYPES.DISTRICT)) {
      setSearchLocationFilter(
        query.get(ANNOUNCEMENTS_FILTER_TYPES.DISTRICT) as string,
        ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
      );
    } else if (query.has(ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID)) {
      setSearchLocationFilter(
        query.get(ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID) as string,
        ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID
      );
    }
  }, [searchParams, setDateFilter, setSearchLocationFilter, today]);

  // set state and replace url based on date cards (or whatever call this)
  const setAnnouncementsDate = useCallback(
    (date: string) => {
      const query = new URLSearchParams(searchParams.toString());
      query.set(ANNOUNCEMENTS_FILTER_TYPES.DATE, date);

      setDateFilter(date);

      router.replace(`?${query.toString()}`);
    },
    [router, searchParams, setDateFilter]
  );

  // set state and replace url based on autocomplete (or whatever call this)
  const setAnnouncementsLocation = useCallback(
    (value: string, type: LocationType) => {
      const query = new URLSearchParams(searchParams.toString());

      // Determine the parameter names
      const currentParam =
        type === ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
          ? ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
          : ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID;
      const otherParam =
        type === ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
          ? ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID
          : ANNOUNCEMENTS_FILTER_TYPES.DISTRICT;

      // Remove the other parameter if it exists
      if (query.has(otherParam)) {
        query.delete(otherParam);
      }

      // Set the new value for the current parameter
      query.set(currentParam, value);

      // Update the URL and state
      setSearchLocationFilter(value, type);
      router.replace(`?${query.toString()}`);
    },
    [router, searchParams, setSearchLocationFilter]
  );

  // reset in store and replace url (for clearing autocomplete)
  const resetAnnouncementsLocation = useCallback(() => {
    const query = new URLSearchParams(searchParams.toString());

    // Remove both 'district' and 'province' parameters if they exist
    query.delete(ANNOUNCEMENTS_FILTER_TYPES.DISTRICT);
    query.delete(ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID); // assuming you meant 'provinceId'

    // Reset the filter in the store and update the URL
    resetSearchLocationFilter();
    router.replace(`?${query.toString()}`);
  }, [resetSearchLocationFilter, router, searchParams]);

  return {
    announcementsLocation,
    locationType,
    announcementsDate,
    setAnnouncementsDate,
    setAnnouncementsLocation,
    resetAnnouncementsLocation,
  };
};
