import type { DistrictOption } from 'src/modules/announcements/_types/announcements.type';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../../modules/commercials/_config';
import { getDistricts } from '../../modules/commercials/_services/commercial.service';

const useGetDistricts = () =>
  useQuery({
    queryKey: [QUERY_KEY.DISTRICTS],
    queryFn: getDistricts,
  });

export default useGetDistricts;

// --------------------------------------------------

// hashmap for the sweet O(1) performance
export const useDistrictOptionMap = () => {
  const { data: districts } = useGetDistricts();

  // for autocomplete mainly
  const options = useMemo(
    () =>
      districts?.map((district) => ({
        id: district._id,
        label: `${district.districtType}${district.districtName} ${district.provinceName}`,
        provinceName: district.provinceName,
        provinceId: district.provinceId,
      })) ?? [],
    [districts]
  );

  // for autocomplete mainly
  // to get option from selected
  const districtOptionMap = useMemo(
    () =>
      options?.reduce(
        (hashMap, district) => {
          hashMap[district.id] = district;
          return hashMap;
        },
        {} as Record<string, DistrictOption>
      ),
    [options]
  );

  return { options, districtOptionMap };
};
