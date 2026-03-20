import type { Map as LeafletMap } from 'leaflet';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type JobsStore = {
  // Filter
  category: string;
  // Map
  map: LeafletMap | null;
  // Detail drawer
  jobId: string | null;
  jobDetailDrawer: boolean;

  // functions
  actions: {
    // Filter
    setCategory: (categoryId: string) => void;
    toggleCategory: (categoryId: string) => void;
    // Map
    setMap: (map: LeafletMap) => void;
    // Detail drawer
    openJobDetailDrawer: (jobId: string) => void;
    closeJobDetailDrawer: () => void;
  };
};

export const useJobsStore = create<JobsStore>()(
  devtools((set) => ({
    // Filter
    category: '',
    // Map
    map: null,
    // Detail drawer
    jobId: null,
    jobDetailDrawer: false,

    // functions
    actions: {
      // Filter
      setCategory: (categoryId: string) => set({ category: categoryId }),
      toggleCategory: (categoryId: string) =>
        set((state) => ({
          category: state.category === categoryId ? '' : categoryId,
        })),
      // Map
      setMap: (map: LeafletMap) => set({ map }),
      openJobDetailDrawer: (jobId: string) => set({ jobId, jobDetailDrawer: true }),
      closeJobDetailDrawer: () => set({ jobDetailDrawer: false }),
    },
  }))
);
