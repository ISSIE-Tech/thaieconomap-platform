import { useMutation } from '@tanstack/react-query';
import { toast } from 'src/shared/components/snackbar';

import { getLineLoginUrl } from '../_services/line.service';

export const useGetLineLoginUrl = () =>
  useMutation({
    mutationFn: getLineLoginUrl,
    onError: (error) => {
      console.log(error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับบัญชี Line');
    },
  });
