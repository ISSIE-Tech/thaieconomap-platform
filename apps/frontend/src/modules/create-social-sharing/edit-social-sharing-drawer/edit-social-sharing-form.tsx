import type { SubmitHandler } from 'react-hook-form';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { Sharing } from 'src/modules/sharings/_types/sharing.type';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from 'src/shared/components/hook-form';
import { toast } from 'src/shared/components/snackbar';

import { reformatFormData } from '../reformat-data';
import useUpdateSocialSharing from '../_hooks/use-update-sharing';
import FormButton from '../create-social-sharing-form/form-button';
import { formSchema } from '../create-social-sharing-form/form-validators';
import useCreateAdditionalImage from '../_hooks/use-create-additional-image';

import type { FormValues } from './form-validators';
import type { FormSteps } from '../_types/create-social-sharing.type';

type Props = {
  sharing: Sharing;
  progressStep: number;
  handleNextFormProgress: () => void;
  loading: UseBooleanReturn;
  defaultValue: FormValues;
  formSteps: FormSteps[];
};

const EditSocialSharingForm = ({
  sharing,
  progressStep,
  handleNextFormProgress,
  loading,
  defaultValue,
  formSteps,
}: Props) => {
  const createAdditionalImage = useCreateAdditionalImage();
  const updateSocialSharing = useUpdateSocialSharing();

  const methods = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema),
  });

  const { trigger } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    loading.onTrue();
    const formData = await reformatFormData(data, createAdditionalImage.mutateAsync, loading, {
      includeOldUrls: true,
      oldBannerImage: defaultValue.image[0],
    });

    await updateSocialSharing.mutateAsync(
      { id: sharing._id, params: formData },
      {
        onSuccess: () => {
          handleNextFormProgress();
        },
        onError: (error) => {
          toast.error(error.display);
          loading.onFalse();
        },
      }
    );
  };

  const handleFormValidation = async () => {
    const validateState = await trigger(formSteps[progressStep].validate);
    if (validateState) {
      handleNextFormProgress();
    }
  };

  const FormComponent = formSteps[progressStep].component;
  const buttonOnClick = progressStep === 3 ? methods.handleSubmit(onSubmit) : handleFormValidation;
  const buttonLabel = progressStep === 3 ? 'ยืนยันการแก้ไข' : 'ถัดไป';

  return (
    <Form methods={methods}>
      <FormComponent />
      <FormButton onClick={buttonOnClick} label={buttonLabel} loading={loading.value} />
    </Form>
  );
};

export default EditSocialSharingForm;
