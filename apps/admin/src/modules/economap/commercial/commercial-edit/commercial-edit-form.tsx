import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form } from 'src/components/hook-form/form-provider';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { reformatFormData } from '../commercial-create/utils';
import { formSchema } from '../commercial-create/form-schema';
import { ECONOMAP_STATUS } from '../../_config/economap-status.config';
import useUpdateCommercial from '../_hooks/use-update-approve-commercial';
import useCreateAdditionalImage from '../_hooks/use-create-additional-images';
import useUpdatePendingCommercial from '../_hooks/use-update-pending-commercial';
import { CommercialInfoForm } from '../commercial-create/components/commercial-info-form';
import useCreatePendingAdditionalImage from '../_hooks/use-create-pending-additional-images';
import CommercialLocationForm from '../commercial-create/components/commercial-location-form';
import CommercialOpeningDaysForm from '../commercial-create/components/commercial-opening-days-form';

import type { CommercialItem } from '../types';
import type { CommercialType } from '../commercial-create/types';
import type { FormSchema } from '../commercial-create/form-schema';

type Props = {
  defaultValue: FormSchema;
  commercialType: CommercialType;
  commercial: CommercialItem;
};
const CommercialEditForm = ({ defaultValue, commercialType, commercial }: Props) => {
  const router = useRouter();
  const { mutate: updateApproveCommercial } = useUpdateCommercial();
  const { mutate: updatePendingCommercial } = useUpdatePendingCommercial();

  const { mutateAsync: createApproveAdditionalImage } = useCreateAdditionalImage();
  const { mutateAsync: createPendingAdditionalImage } = useCreatePendingAdditionalImage();

  const loading = useBoolean();

  const updateCommercial =
    commercial.submissionStatus === ECONOMAP_STATUS.APPROVED
      ? updateApproveCommercial
      : updatePendingCommercial;

  const createAdditionalImage =
    commercial.submissionStatus === ECONOMAP_STATUS.APPROVED
      ? createApproveAdditionalImage
      : createPendingAdditionalImage;

  const methods = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    loading.onTrue();
    const formatteddata = await reformatFormData(
      data,
      commercialType,
      createAdditionalImage,
      loading,
      {
        includeOldUrls: true,
      }
    );

    await updateCommercial(
      { id: commercial._id, params: formatteddata },
      {
        onSuccess: () => {
          toast.success(`แก้ไข${commercial.name}สำเร็จ`);
          router.replace(paths.commercial.dashboard.list);
        },
        onError: (error) => {
          toast.error(error.display);
          loading.onFalse();
        },
      }
    );
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 }, marginBottom: '80px' }}
      >
        <CommercialInfoForm commercialType={commercialType} />

        <CommercialOpeningDaysForm commercialType={commercialType} />

        <CommercialLocationForm />

        <ImagesForm
          name="thumbnail"
          title="รูปภาพแบนเนอร์"
          subheader="เพิ่มรูปภาพแบนเนอร์ของร้าน (1 รูปภาพ)"
        />

        <ImagesForm
          name="images"
          title="รูปภาพเพิ่มเติม"
          subheader="เพิ่มรูปภาพเพิ่มเติมของร้าน (ไม่เกิน 20 รูปภาพ)"
        />

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={loading.value}>
            ยืนยันการแก้ไข
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
};

export default CommercialEditForm;
