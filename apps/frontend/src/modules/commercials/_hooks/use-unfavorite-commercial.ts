import { QUERY_KEY } from 'src/modules/favorites/_config';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { unfavoriteCommercial } from '../_services/commercial.service';

const useUnfavoriteCommercial = () => {
  const queryClient = useQueryClient(); // To access and invalidate the cache

  return useMutation({
    mutationFn: (commercialId: string) => unfavoriteCommercial(commercialId),
    onSuccess: (res) => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAVORITES] }), // Invalidate queries related to the profile,
  });
};

export default useUnfavoriteCommercial;
