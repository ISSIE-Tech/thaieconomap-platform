import React, { useEffect } from 'react';
import Head from 'next/head';

import { ProfileContent, ProfileInformation } from '@/sections/profile';
import { useUserStore } from '@/store';
import axios from '@/utils/axios';
import { UserPostType, UserSubmissionType } from '@/types/post';

export default function ProfilePage() {
  const setUserPosts = useUserStore((state) => state.setUserPosts);
  const setUserSubmissions = useUserStore((state) => state.setUserSubmissions);

  useEffect(() => {
    const loadUserPosts = async () => {
      const [postsResponse, submissionsResponse] = await Promise.all([
        axios.get('/users/profile/job-posts'),
        axios.get('/users/profile/submissions'),
      ]);
      const posts: UserPostType[] = postsResponse.data.jobPosts;
      const submissions: UserSubmissionType[] =
        submissionsResponse.data.submissions;

      setUserPosts(posts);
      setUserSubmissions(submissions);
    };

    loadUserPosts();
  }, []);

  return (
    <>
      <Head>
        <title>เชี่ยวแชร์ JOB</title>
      </Head>

      <div className="h-screen flex flex-col overflow-y-hidden">
        <ProfileInformation />

        <ProfileContent />
      </div>
    </>
  );
}
