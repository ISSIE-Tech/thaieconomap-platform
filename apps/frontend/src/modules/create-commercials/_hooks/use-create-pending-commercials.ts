import { useMutation } from '@tanstack/react-query';

import { createPendingCommercials } from '../_services/create-commercials.service';

import type { CommercialError } from '../_types/create-commercials.type';

const useCreatePendingCommercials = () =>
  useMutation({
    mutationFn: (params: FormData) => createPendingCommercials(params),
    onSuccess: (res) => res,
    onError: (error: CommercialError) => error,
  });

export default useCreatePendingCommercials;
