import { useMutation, useQueryClient } from '@tanstack/react-query';

import { unfavoritePumpuang } from '../_services/pumpuangs.service';

const useUnfavoritePumpuang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pumpuangId: string) => unfavoritePumpuang(pumpuangId),
    // TODO: you can invalidate in favorite hook instead of in commercial detail drawer
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate relevant queries
    },
  });
};

export default useUnfavoritePumpuang;
