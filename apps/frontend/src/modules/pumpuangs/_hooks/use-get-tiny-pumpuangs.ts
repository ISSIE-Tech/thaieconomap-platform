import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

// import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import { QUERY_KEY } from '../_config';
import { getTinyPumpuangs } from '../_services/pumpuangs.service';

const useGetTinyPumpuangs = () => {
  const searchParams = useSearchParams();
  // query filter
  const workingHour = searchParams.get('workingHour');
  const location = searchParams.get('location');
  const types = searchParams.get('types');
  // const geolocation = useGeolocationStore((state) => state.geolocation);

  // TODO: only types work for now on the backend... (25 Nov 2024)
  const props = {
    ...(location && { location }),
    ...(workingHour && { workingHour }),
    // ...(geolocation && {
    //   latitude: geolocation[0].toString(),
    //   longitude: geolocation[1].toString(),
    // }),
    ...(types && { types }),
  };

  // ex: location=100&latitude=13&longitude=14&types=6612345
  const propKeys = Object.entries(props)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery({
    queryKey: [QUERY_KEY.TINY_PUMPUANGS, propKeys],
    queryFn: getTinyPumpuangs,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
};

export default useGetTinyPumpuangs;
