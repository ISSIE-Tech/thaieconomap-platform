import { useMemo } from 'react';

export default function useGetToday() {
  // Memoize the date so that it does not update on every render
  const today = useMemo(() => new Date(), []);

  return today;
}
