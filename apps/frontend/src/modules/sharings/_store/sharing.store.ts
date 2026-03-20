import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type SharingStore = {
  // map
  map: LeafletMap | null;
  setMap: (map: LeafletMap) => void;
};

export const useSharingStore = create<SharingStore>()(
  devtools((set) => ({
    // map
    map: null,
    setMap: (map: LeafletMap) => set({ map }),
  }))
);
