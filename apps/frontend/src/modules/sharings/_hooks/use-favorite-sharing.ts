import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from 'src/modules/favorites/_config';

import { favoriteSharing } from '../_services/sharing.service';

const useFavoriteSharing = () => {
  const queryClient = useQueryClient(); // To access and invalidate the cache

  return useMutation({
    mutationFn: (sharingId: string) => favoriteSharing(sharingId),
    onSuccess: (res) => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAVORITES] }), // Invalidate queries related to the profile,,
  });
};

export default useFavoriteSharing;
