import { create } from 'zustand';
import { UserPostType, UserSubmissionType } from '@/types/post';

type UserStoreType = {
  userPosts: UserPostType[];
  setUserPosts: (posts: UserPostType[]) => void;
  userSubmissions: UserSubmissionType[];
  setUserSubmissions: (submissions: UserSubmissionType[]) => void;
};

export const useUserStore = create<UserStoreType>()((set) => ({
  userPosts: [],
  setUserPosts: (posts) => set({ userPosts: posts }),
  userSubmissions: [],
  setUserSubmissions: (submissions) => set({ userSubmissions: submissions }),
}));
