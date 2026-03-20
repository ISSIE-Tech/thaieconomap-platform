import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type LocationType, ANNOUNCEMENTS_FILTER_TYPES } from '../_constants/location';

type AnnouncementsStore = {
  // district/province autocomplete
  searchLocationFilter: string | null;
  locationType: LocationType;
  // date select
  dateFilter: string | null;
  // autocomplete
  locationAutocompleteOpen: boolean;
  actions: {
    setSearchLocationFilter: (searchLocationFilter: string, locationType: LocationType) => void;
    resetSearchLocationFilter: () => void;
    setDateFilter: (dateFilter: string) => void;
    openLocationAutocomplete: () => void;
    closeLocationAutocomplete: () => void;
  };
};

export const useAnnouncementsStore = create<AnnouncementsStore>()(
  devtools((set) => ({
    // handle query param searching for district/province autocomplete
    // the autocomplete needs the value from this
    searchLocationFilter: null,
    locationType: ANNOUNCEMENTS_FILTER_TYPES.DISTRICT,
    // date select
    dateFilter: null,
    // autocomplete
    locationAutocompleteOpen: false,
    actions: {
      setSearchLocationFilter: (searchLocationFilter: string, locationType: LocationType) =>
        set({ searchLocationFilter, locationType }),
      resetSearchLocationFilter: () => set({ searchLocationFilter: null }),
      setDateFilter: (dateFilter: string) => set({ dateFilter }),
      openLocationAutocomplete: () => set({ locationAutocompleteOpen: true }),
      closeLocationAutocomplete: () => set({ locationAutocompleteOpen: false }),
    },
  }))
);
