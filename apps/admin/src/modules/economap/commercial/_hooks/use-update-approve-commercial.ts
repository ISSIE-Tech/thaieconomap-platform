import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { updateCommercials } from '../_services/commercial.service';

const useUpdateCommercial = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) => updateCommercials(id, params),
    onError: (error: EconomapError) => error,
  });

export default useUpdateCommercial;
