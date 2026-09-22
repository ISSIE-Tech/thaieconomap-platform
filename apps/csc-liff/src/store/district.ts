import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { DistrictType } from '@/types/district';

type DistrictStoreType = {
  districts: DistrictType[];
  setDistricts: (districts: DistrictType[]) => void;
};

export const useDistrictStore = create<DistrictStoreType>()((set) => ({
  districts: [],
  setDistricts: (districts) => set({ districts }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('post-store', useDistrictStore);
}
