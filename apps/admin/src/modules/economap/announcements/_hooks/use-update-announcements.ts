import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { updateAnnouncements } from '../_services/create-announcements.service';

const useUpdateAnnouncements = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updateAnnouncements(id, params),
    onError: (error: EconomapError) => error,
  });

export default useUpdateAnnouncements;
