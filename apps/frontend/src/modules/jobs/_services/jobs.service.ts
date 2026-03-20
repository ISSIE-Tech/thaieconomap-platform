import type { ApiResponse, ChialShareApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { JobPost, JobTiny, JobType } from '../_types/jobs.type';

type Params = {
  queryKey: string[];
};

// ----------------------------------------------------------------------

export const getTinyFilteredJobs = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, propKeys] = queryKey;

  const params = `?${propKeys}`;
  const { data } = await axios.get<ApiResponse<JobTiny[]>>(endpoints.jobs.filter(params));

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinyJobs = data.data.map(
    (tinyJob) =>
      ({
        ...tinyJob,
        name: tinyJob.title,
        location: {
          type: tinyJob.location.type,
          coordinates: [tinyJob.location.coordinates[1], tinyJob.location.coordinates[0]],
        },
      }) as JobTiny
  );

  return formattedTinyJobs;
};

// ----------------------------------------------------------------------

export const getJobById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, commercialId] = queryKey;

  // query data cannot be undefined
  if (commercialId === '') return null;

  const { data } = await axios.get<ChialShareApiResponse<{ jobPost: JobPost }>>(
    endpoints.jobs.details(commercialId)
  );

  return data.jobPost;
};

// ----------------------------------------------------------------------

export const getJobTypes = async () => {
  const { data } = await axios.get<ChialShareApiResponse<{ jobCategories: JobType[] }>>(
    endpoints.jobs['job-types']
  );

  return data.jobCategories;
};
