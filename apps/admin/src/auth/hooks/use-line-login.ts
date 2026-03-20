import { useMutation } from '@tanstack/react-query';

import { lineLogin } from 'src/auth/services/line.service';

export const useLingLogin = () =>
  useMutation({
    mutationFn: (authorizationCode: string) => lineLogin(authorizationCode),
  });
