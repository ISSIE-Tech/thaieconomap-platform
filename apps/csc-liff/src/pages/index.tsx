import { useEffect } from 'react';
import Head from 'next/head';

import {
  HomeAllJobs,
  HomeHeader,
  HomeJobTypeSelector,
  HomeNewPost,
  HomeSearchBox,
} from '@/sections/home';
import { DistrictType } from '@/types/district';
import { JobCategoryType, PostType, WageUnitType } from '@/types/post';
import { useDistrictStore, usePostStore } from '@/store';
import axios from '@/utils/axios';

export default function Home() {
  const setPosts = usePostStore((state) => state.setPosts);
  const setCategories = usePostStore((state) => state.setCategories);
  const setDistricts = useDistrictStore((state) => state.setDistricts);
  const setWageUnits = usePostStore((state) => state.setWageUnits);

  useEffect(() => {
    const fetchData = async () => {
      const [
        jobsResponse,
        categoryResponse,
        wageUnitResponse,
        districtsResponse,
      ] = await Promise.all([
        axios.get('/job-posts?perPage=9999'),
        axios.get('/job-posts/categories'),
        axios.get('/job-posts/wage-units'),
        axios.get('/districts'),
      ]);

      const jobPosts: PostType[] = jobsResponse.data.jobPosts.data;
      const jobCategories: JobCategoryType[] =
        categoryResponse.data.jobCategories;
      const wageUnits: WageUnitType[] = wageUnitResponse.data.units;
      const districts: DistrictType[] = districtsResponse.data.districts;

      setPosts(jobPosts);
      setCategories(jobCategories);
      setDistricts(districts);
      setWageUnits(wageUnits);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>เชี่ยวแชร์ JOB</title>
      </Head>

      <HomeHeader />

      <HomeSearchBox />

      <HomeJobTypeSelector />

      <HomeAllJobs />

      <HomeNewPost />
    </>
  );
}
