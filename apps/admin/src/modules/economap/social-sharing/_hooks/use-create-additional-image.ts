import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { uploadSocialSharingAdditionalImage as uploadAdditionalImage } from '../_services/social-sharing.service';

const useCreateAdditionalImage = () =>
  useMutation({
    mutationFn: (params: FormData) => uploadAdditionalImage(params),
    onError: (error: EconomapError) => error,
  });

export default useCreateAdditionalImage;
