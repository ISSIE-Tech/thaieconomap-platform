import { useMutation } from '@tanstack/react-query';

import { createPendingShares } from '../_services/create-social-sharing.service';

import type { CommercialError } from '../_types/create-social-sharing.type';

const useCreatePendingShares = () =>
  useMutation({
    mutationFn: (params: FormData) => createPendingShares(params),
    onSuccess: (res) => res,
    onError: (error: CommercialError) => error,
  });

export default useCreatePendingShares;
