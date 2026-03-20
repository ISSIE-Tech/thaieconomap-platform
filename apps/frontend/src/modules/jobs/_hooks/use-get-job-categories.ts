import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getJobTypes } from '../_services/jobs.service';

const useGetJobCategories = () =>
  useQuery({
    queryKey: [QUERY_KEY.JOB_TYPES],
    queryFn: getJobTypes,
  });

export default useGetJobCategories;
