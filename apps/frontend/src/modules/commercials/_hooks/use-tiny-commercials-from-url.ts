import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';

import { QUERY_KEY } from '../_config';
import { getTinyFilteredCommercials } from '../_services/commercial.service';

/**
 * Tiny commercials for the current URL filter. The map page and the desktop sidebar
 * both call this, so they share one react-query cache entry.
 */
export function useTinyCommercialsFromUrl(category: keyof typeof QUERY_KEY.CATEGORY) {
  const searchParams = useSearchParams();
  const workingHour = searchParams.get('workingHour');
  const location = searchParams.get('location');
  const types = searchParams.get('types');

  const geolocation = useGeolocationStore((state) => state.geolocation);

  // ex: location=100&latitude=13&longitude=14&types=6612345
  const propKeys = Object.entries({
    ...(location && { location }),
    ...(workingHour && { workingHour }),
    ...(geolocation && {
      latitude: geolocation[0].toString(),
      longitude: geolocation[1].toString(),
    }),
    ...(types && { types }),
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery({
    queryKey: [QUERY_KEY.COMMERCIALS, QUERY_KEY.CATEGORY[category], propKeys],
    queryFn: getTinyFilteredCommercials,
  });
}
