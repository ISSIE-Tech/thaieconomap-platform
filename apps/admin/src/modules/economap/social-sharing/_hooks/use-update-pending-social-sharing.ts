import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { updatePendingSocialSharing } from '../_services/pending-social-sharing.service';

const useUpdatePendingSocialSharing = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updatePendingSocialSharing(id, params),
    onError: (error: EconomapError) => error,
  });

export default useUpdatePendingSocialSharing;
