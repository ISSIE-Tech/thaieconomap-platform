import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { paths } from 'src/shared/routes/paths.config';

import { commercialFilterDefault } from '../_types/commercials.type';

const defaultUrls = {
  workingHour: commercialFilterDefault.workingHour,
  location: commercialFilterDefault.location,
  types: '',
};

// filterPath: { filterType: queryParam }
// ex: restaurants: { workingHour: 'OPEN' }
const filterUrls = {
  [paths.commercials.restaurants]: { ...defaultUrls },
  [paths.commercials.businesses]: { ...defaultUrls },
  [paths.commercials.pumpuang]: { ...defaultUrls },
};

export type FilterUrlsPath = keyof typeof filterUrls;
// FilterUrlsType = 'workingHour' | 'location' | 'type'
export type FilterUrlsType = keyof typeof defaultUrls;

type CommercialStore = {
  // map
  map: LeafletMap | null;
  setMap: (map: LeafletMap) => void;
  // Filter Urls (for restaurants, businesses)
  filterUrls: typeof filterUrls;
  setFilterUrls: (path: FilterUrlsPath, type: FilterUrlsType, url: string) => void;
};

export const useCommercialStore = create<CommercialStore>()(
  devtools((set) => ({
    // map
    map: null,
    setMap: (map: LeafletMap) => set({ map }),
    // Filter Urls (for restaurants, businesses)
    filterUrls,
    setFilterUrls: (path: FilterUrlsPath, type: FilterUrlsType, url: string) =>
      // just set that path's type to new url
      set((state) => {
        const currentPathUrls = state.filterUrls[path];
        return {
          filterUrls: {
            ...state.filterUrls,
            [path]: { ...currentPathUrls, [type]: url },
          },
        };
      }),
  }))
);
