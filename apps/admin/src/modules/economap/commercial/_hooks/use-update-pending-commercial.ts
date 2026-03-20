import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { updatePendingCommercials } from '../_services/pending-commercial.service';

const useUpdatePendingCommercial = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updatePendingCommercials(id, params),
    onError: (error: EconomapError) => error,
  });

export default useUpdatePendingCommercial;
