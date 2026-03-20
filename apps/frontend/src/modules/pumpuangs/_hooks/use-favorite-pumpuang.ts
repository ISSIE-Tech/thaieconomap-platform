import { useMutation, useQueryClient } from '@tanstack/react-query';

import { favoritePumpuang } from '../_services/pumpuangs.service';

const useFavoritePumpuang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pumpuangId: string) => favoritePumpuang(pumpuangId),
    // TODO: you can invalidate in favorite hook instead of in commercial detail drawer
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate relevant queries
    },
  });
};

export default useFavoritePumpuang;
