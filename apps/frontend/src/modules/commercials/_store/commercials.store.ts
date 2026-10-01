import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { paths } from 'src/shared/routes/paths.config';

import { commercialFilterDefault } from '../_types/commercials.type';

const defaultUrls = {
  workingHour: commercialFilterDefault.workingHour,
  location: commercialFilterDefault.location,
  types: '',
  orderable: '',
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
  setMap: (map: LeafletMap | null) => void;
  // Filter Urls (for restaurants, businesses)
  filterUrls: typeof filterUrls;
  setFilterUrls: (path: FilterUrlsPath, type: FilterUrlsType, url: string) => void;
  // desktop sidebar: the commercial whose detail is open, and the list row under the cursor
  selectedId: string;
  setSelectedId: (id: string) => void;
  hoveredId: string;
  setHoveredId: (id: string) => void;
};

export const useCommercialStore = create<CommercialStore>()(
  devtools((set) => ({
    // map
    map: null,
    setMap: (map: LeafletMap | null) => set({ map }),
    // Filter Urls (for restaurants, businesses)
    filterUrls,
    selectedId: '',
    setSelectedId: (selectedId: string) => set({ selectedId }),
    hoveredId: '',
    setHoveredId: (hoveredId: string) => set({ hoveredId }),
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
