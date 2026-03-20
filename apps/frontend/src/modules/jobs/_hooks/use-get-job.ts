import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getJobById } from '../_services/jobs.service';

type Props = {
  jobId: string;
};

const useGetJob = ({ jobId }: Props) =>
  useQuery({
    queryKey: [QUERY_KEY.JOB, jobId],
    queryFn: getJobById,
  });

export default useGetJob;
