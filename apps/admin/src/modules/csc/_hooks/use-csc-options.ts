import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CSC_QUERY_KEYS } from '../_configs/csc-query-keys.config';
import {
  getWageUnits,
  createWageUnit,
  deleteWageUnit,
  getJobCategories,
  createJobCategory,
  deleteJobCategory,
  arrangeJobCategories,
} from '../_services/csc.service';

export const useGetJobCategories = () =>
  useQuery({ queryKey: [CSC_QUERY_KEYS.JOB_CATEGORIES], queryFn: getJobCategories });

export const useGetWageUnits = () =>
  useQuery({ queryKey: [CSC_QUERY_KEYS.WAGE_UNITS], queryFn: getWageUnits });

const useOptionMutation = <T>(key: string, mutationFn: (params: T) => Promise<unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
};

export const useCreateJobCategory = () =>
  useOptionMutation(CSC_QUERY_KEYS.JOB_CATEGORIES, createJobCategory);

export const useDeleteJobCategory = () =>
  useOptionMutation(CSC_QUERY_KEYS.JOB_CATEGORIES, deleteJobCategory);

export const useArrangeJobCategories = () =>
  useOptionMutation(CSC_QUERY_KEYS.JOB_CATEGORIES, arrangeJobCategories);

export const useCreateWageUnit = () => useOptionMutation(CSC_QUERY_KEYS.WAGE_UNITS, createWageUnit);

export const useDeleteWageUnit = () => useOptionMutation(CSC_QUERY_KEYS.WAGE_UNITS, deleteWageUnit);
