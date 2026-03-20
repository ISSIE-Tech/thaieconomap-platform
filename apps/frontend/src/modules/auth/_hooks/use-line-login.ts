import { useMutation } from '@tanstack/react-query';

import { lineLogin } from '../_services/line.service';

export const useLingLogin = () =>
  useMutation({
    mutationFn: (authorizationCode: string) => lineLogin(authorizationCode),
  });
