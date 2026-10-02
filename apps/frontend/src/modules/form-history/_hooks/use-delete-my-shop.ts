import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { deleteMyShop } from '../_services/user.service';

const useDeleteMyShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyShop,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.HISTORY] }),
  });
};

export default useDeleteMyShop;
