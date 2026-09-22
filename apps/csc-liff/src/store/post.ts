import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { JobCategoryType, PostType, WageUnitType } from '@/types/post';

type PostStoreType = {
  posts: PostType[];
  setPosts: (posts: PostType[]) => void;
  categories: JobCategoryType[];
  setCategories: (categories: JobCategoryType[]) => void;
  wageUnits: WageUnitType[];
  setWageUnits: (wageUnits: WageUnitType[]) => void;
};

export const usePostStore = create<PostStoreType>()((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  categories: [],
  setCategories: (categories) => set({ categories }),
  wageUnits: [],
  setWageUnits: (wageUnits) => set({ wageUnits }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('post-store', usePostStore);
}
