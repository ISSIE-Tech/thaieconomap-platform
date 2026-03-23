import { QUERY_KEY } from 'src/modules/favorites/_config';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { favoriteCommercial } from '../_services/commercial.service';

const useFavoriteCommercial = () => {
  const queryClient = useQueryClient(); // To access and invalidate the cache

  return useMutation({
    mutationFn: (commercialId: string) => favoriteCommercial(commercialId),
    onSuccess: (res) => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAVORITES] }), // Invalidate queries related to the profile,,
  });
};

export default useFavoriteCommercial;
