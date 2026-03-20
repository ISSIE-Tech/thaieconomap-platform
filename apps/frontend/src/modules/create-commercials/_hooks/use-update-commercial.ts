import { useMutation } from '@tanstack/react-query';

import { updatePendingCommercials } from '../_services/update-commercial.service';

import type { CommercialError } from '../_types/create-commercials.type';

const useUpdateCommercial = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updatePendingCommercials(id, params),
    onError: (error: CommercialError) => [],
  });

export default useUpdateCommercial;
