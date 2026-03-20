import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { createCommercials } from '../_services/commercial.service';

const useCreateCommercials = () =>
  useMutation({
    mutationFn: (params: FormData) => createCommercials(params),
    onError: (error: EconomapError) => error,
  });

export default useCreateCommercials;
