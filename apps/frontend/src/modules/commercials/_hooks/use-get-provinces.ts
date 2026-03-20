import type { DistrictOption } from 'src/modules/announcements/_types/announcements.type';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getProvinces } from '../_services/commercial.service';

const useGetProvinces = () =>
  useQuery({
    queryKey: [QUERY_KEY.DISTRICTS],
    queryFn: getProvinces,
  });

export default useGetProvinces;

// --------------------------------------------------

// hashmap for the sweet O(1) performance
export const useProvinceOptionMap = () => {
  const { data: provinces } = useGetProvinces();

  // for autocomplete to filter provinceId mainly
  const provinceIdOptionMap = useMemo(
    () =>
      provinces?.reduce(
        (hashMap, province) => {
          hashMap[province.provinceId] = {
            ...province,
            label: province.provinceName,
            id: province.provinceId,
          };
          return hashMap;
        },
        {} as Record<string, DistrictOption>
      ),
    [provinces]
  );

  return { provinceIdOptionMap };
};
