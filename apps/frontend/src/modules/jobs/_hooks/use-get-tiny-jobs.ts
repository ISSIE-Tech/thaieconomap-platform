import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { useJobsStore } from '../_store/jobs.store';
import { getTinyFilteredJobs } from '../_services/jobs.service';

const useGetTinyJobs = () => {
  const category = useJobsStore((state) => state.category);

  const props = {
    ...(category && { category }),
  };

  // ex: category=somemongoid
  const propKeys = Object.entries(props)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery({
    queryKey: [QUERY_KEY.TINY_JOBS, propKeys],
    queryFn: getTinyFilteredJobs,
  });
};

export default useGetTinyJobs;
