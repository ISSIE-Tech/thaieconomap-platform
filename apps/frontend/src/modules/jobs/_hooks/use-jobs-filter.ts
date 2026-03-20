import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useJobsStore } from '../_store/jobs.store';
import { JOBS_FILTER_BY } from '../_constants/jobs-filter';

// TODO: consider creating an auto url hook for every filter (commercial, sharing, announcement)
export const useJobsFilterAutoUrl = () => {
  const category = useJobsStore((state) => state.category);
  const { setCategory } = useJobsStore((state) => state.actions);
  const searchParams = useSearchParams();
  const router = useRouter();

  // when url query params change, save it to store
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());

    if (query.has(JOBS_FILTER_BY.CATEGORY)) {
      setCategory(query.get(JOBS_FILTER_BY.CATEGORY) ?? '');
    }
  }, [searchParams, setCategory]);

  // when filter in store change, save it to query params
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());

    query.set(JOBS_FILTER_BY.CATEGORY, category);
    router.replace(`?${query.toString()}`);
  }, [category, router, searchParams]);

  return null;
};
