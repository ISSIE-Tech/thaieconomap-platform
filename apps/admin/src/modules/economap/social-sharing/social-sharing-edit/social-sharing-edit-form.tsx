import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form } from 'src/components/hook-form';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { reformatFormData } from '../social-sharing-create/utils';
import { formSchema } from '../social-sharing-create/form-schema';
import { ECONOMAP_STATUS } from '../../_config/economap-status.config';
import useCreateAdditionalImage from '../_hooks/use-create-additional-image';
import useUpdateSocialSharing from '../_hooks/use-update-approve-social-sharing';
import useUpdatePendingSocialSharing from '../_hooks/use-update-pending-social-sharing';
import useCreatePendingAdditionalImage from '../_hooks/use-create-pending-additional-image';
import { SocialSharingInfoForm } from '../social-sharing-create/components/social-sharing-info-form';
import SocialSharingLocationForm from '../social-sharing-create/components/social-sharing-location-form';
import { SocialSharingContactForm } from '../social-sharing-create/components/social-sharing-contact-form';

import type { SocialSharingItem } from '../types';
import type { FormSchema } from '../social-sharing-create/form-schema';

type Props = {
  defaultValue: FormSchema;
  socialSharing: SocialSharingItem;
};

const SocialSharingEditForm = ({ defaultValue, socialSharing }: Props) => {
  const router = useRouter();

  const { mutate: updateApproveSocialSharing } = useUpdateSocialSharing();
  const { mutate: updatePendingSocialSharing } = useUpdatePendingSocialSharing();

  const { mutateAsync: createApproveAdditionalImage } = useCreateAdditionalImage();
  const { mutateAsync: createPendingAdditionalImage } = useCreatePendingAdditionalImage();

  const loading = useBoolean();

  const updateSocialSharing =
    socialSharing.submissionStatus === ECONOMAP_STATUS.APPROVED
      ? updateApproveSocialSharing
      : updatePendingSocialSharing;

  const createAdditionalImage =
    socialSharing.submissionStatus === ECONOMAP_STATUS.APPROVED
      ? createApproveAdditionalImage
      : createPendingAdditionalImage;

  const methods = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    loading.onTrue();
    const formatteddata = await reformatFormData(data, createAdditionalImage, loading, {
      includeOldUrls: true,
    });

    await updateSocialSharing(
      { id: socialSharing._id, params: formatteddata },
      {
        onSuccess: () => {
          toast.success(`แก้ไข${socialSharing.name}สำเร็จ`);
          router.replace(paths['social-sharing'].dashboard.list);
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
        <SocialSharingInfoForm />

        <SocialSharingContactForm />

        <SocialSharingLocationForm />

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

export default SocialSharingEditForm;
