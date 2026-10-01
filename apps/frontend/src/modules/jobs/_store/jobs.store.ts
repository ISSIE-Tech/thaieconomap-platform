import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type JobsStore = {
  // Filter
  category: string;
  // Map
  map: LeafletMap | null;
  // Selected job (detail drawer on mobile, sidebar detail on desktop) and hovered list row
  selectedId: string;
  hoveredId: string;

  // functions
  actions: {
    // Filter
    setCategory: (categoryId: string) => void;
    toggleCategory: (categoryId: string) => void;
    // Map
    setMap: (map: LeafletMap | null) => void;
    // Selection
    setSelectedId: (id: string) => void;
    setHoveredId: (id: string) => void;
  };
};

export const useJobsStore = create<JobsStore>()(
  devtools((set) => ({
    // Filter
    category: '',
    // Map
    map: null,
    selectedId: '',
    hoveredId: '',

    // functions
    actions: {
      // Filter
      setCategory: (categoryId: string) => set({ category: categoryId }),
      toggleCategory: (categoryId: string) =>
        set((state) => ({
          category: state.category === categoryId ? '' : categoryId,
        })),
      // Map
      setMap: (map: LeafletMap | null) => set({ map }),
      setSelectedId: (selectedId: string) => set({ selectedId }),
      setHoveredId: (hoveredId: string) => set({ hoveredId }),
    },
  }))
);
