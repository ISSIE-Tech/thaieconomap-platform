import { useMutation } from '@tanstack/react-query';

import { authentikLogin } from 'src/auth/services/authentik.service';

export const useAuthentikLogin = () =>
  useMutation({
    mutationFn: (authorizationCode: string) => authentikLogin(authorizationCode),
  });
