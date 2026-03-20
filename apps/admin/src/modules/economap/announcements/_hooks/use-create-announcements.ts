import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { createAnnouncements } from '../_services/create-announcements.service';

const useCreateAnnouncements = () =>
  useMutation({
    mutationFn: (params: FormData) => createAnnouncements(params),
    onError: (error: EconomapError) => error,
  });

export default useCreateAnnouncements;
