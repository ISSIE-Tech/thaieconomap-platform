import { useMutation } from '@tanstack/react-query';

import { getAuthentikLoginUrl } from 'src/auth/services/authentik.service';

// ----------------------------------------------------------------------

export const useGetAuthentikLoginUrl = () =>
  useMutation({
    mutationFn: getAuthentikLoginUrl,
  });
