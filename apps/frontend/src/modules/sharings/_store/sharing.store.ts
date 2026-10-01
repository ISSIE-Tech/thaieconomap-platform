import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type SharingStore = {
  // map
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
  // desktop sidebar: the sharing whose detail is open, and the list row under the cursor
  selectedId: string;
  setSelectedId: (id: string) => void;
  hoveredId: string;
  setHoveredId: (id: string) => void;
};

export const useSharingStore = create<SharingStore>()(
  devtools((set) => ({
    // map
    map: null,
    setMap: (map: LeafletMap | null) => set({ map }),
    selectedId: '',
    setSelectedId: (selectedId: string) => set({ selectedId }),
    hoveredId: '',
    setHoveredId: (hoveredId: string) => set({ hoveredId }),
  }))
);
