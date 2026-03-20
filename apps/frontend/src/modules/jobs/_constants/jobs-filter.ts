export const JOBS_FILTER_BY = {
  CATEGORY: 'category',
} as const;

export const jobsFilterDefault = {
  category: '',
};

export const getIsDefault = (jobsFilter: Partial<typeof jobsFilterDefault>) =>
  Object.entries(jobsFilter).every(
    ([key, value]) => jobsFilterDefault[key as keyof typeof jobsFilterDefault] === value
  );
