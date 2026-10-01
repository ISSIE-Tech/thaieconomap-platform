import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';

import { QUERY_KEY } from '../_config';
import { getTinyFilteredSharings } from '../_services/sharing.service';

/**
 * Tiny sharings for the current URL filter. The map page and the desktop sidebar
 * both call this, so they share one react-query cache entry.
 */
const useGetTinySharings = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const location = searchParams.get('location');
  const district = searchParams.get('district');

  const geolocation = useGeolocationStore((state) => state.geolocation);

  // ex: location:100,latitude:13,longitude:14,district:6612345
  const propKeys = Object.entries({
    ...(location && { location }),
    ...(geolocation && {
      latitude: geolocation[0].toString(),
      longitude: geolocation[1].toString(),
    }),
    ...(status && { status }),
    ...(district && { district }),
  })
    .map(([key, value]) => `${key}:${value}`)
    .join(',');

  return useQuery({
    queryKey: [QUERY_KEY.SHARES, propKeys],
    queryFn: getTinyFilteredSharings,
  });
};

export default useGetTinySharings;
