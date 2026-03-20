import { useMutation } from '@tanstack/react-query';

import { getLineLoginUrl } from 'src/auth/services/line.service';

// ----------------------------------------------------------------------

export const useGetLineLoginUrl = () =>
  useMutation({
    mutationFn: getLineLoginUrl,
  });
