import { useMutation } from '@tanstack/react-query';

import { updateSocialSharing } from '../_services/update-social-sharing.service';

import type { CommercialError } from '../_types/create-social-sharing.type';

const useUpdateSocialSharing = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updateSocialSharing(id, params),
    onError: (error: CommercialError) => {},
  });

export default useUpdateSocialSharing;
