import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { uploadPumpuangAdditionalImage } from '../_services/pumpuang.service';

// ----------------------------------------------------------------------

const useUploadPumpuangImage = () =>
  useMutation({
    mutationFn: (params: FormData) => uploadPumpuangAdditionalImage(params),
    onError: (error: EconomapError) => error,
  });

export default useUploadPumpuangImage;
