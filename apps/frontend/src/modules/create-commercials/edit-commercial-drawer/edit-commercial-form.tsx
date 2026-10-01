import type { FormValues } from './form-validators';
import type { SubmitHandler } from 'react-hook-form';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';
import type { FormSteps, CommercialType } from '../_types/create-commercials.type';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormActions } from 'src/modules/form-wizard';
import { toast } from 'src/shared/components/snackbar';
import { Form } from 'src/shared/components/hook-form/form-provider';

import { reformatFormData } from '../reformat-data';
import useUpdateCommercial from '../_hooks/use-update-commercial';
import { formSchema } from '../create-commercials-form/form-validators';
import useCreateAdditionalImage from '../_hooks/use-create-additional-images';

type Props = {
  commercial: Commercial;
  commercialType: CommercialType;
  progressStep: number;
  handleNextFormProgress: () => void;
  handleBackFormProgress: () => void;
  onCancel: () => void;
  loading: UseBooleanReturn;
  defaultValue: FormValues;
  formSteps: FormSteps[];
};

const EditCommercialForm = ({
  commercial,
  commercialType,
  progressStep,
  handleNextFormProgress,
  handleBackFormProgress,
  onCancel,
  loading,
  defaultValue,
  formSteps,
}: Props) => {
  const createAdditionalImage = useCreateAdditionalImage();
  const updateCommercial = useUpdateCommercial();

  const methods = useForm({ defaultValues: defaultValue, resolver: zodResolver(formSchema) });

  const { trigger } = methods;

  const handleFormValidation = async () => {
    const validateState = await trigger(formSteps[progressStep].validate);
    if (validateState) {
      handleNextFormProgress();
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    loading.onTrue();
    const formData = await reformatFormData(
      data,
      commercialType,
      createAdditionalImage.mutateAsync,
      loading,
      {
        includeOldUrls: true,
        oldBannerImage: defaultValue.image[0],
      }
    );

    await updateCommercial.mutateAsync(
      { id: commercial._id, params: formData },
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

  const buttonLabel = progressStep === 3 ? 'ยืนยันการแก้ไข' : 'ถัดไป';
  const FormComponent = formSteps[progressStep].component;
  const buttonOnClick = progressStep === 3 ? methods.handleSubmit(onSubmit) : handleFormValidation;

  return (
    <Form methods={methods}>
      <FormComponent />
      <FormActions
        label={buttonLabel}
        onNext={buttonOnClick}
        onBack={handleBackFormProgress}
        onCancel={onCancel}
        loading={loading.value}
      />
    </Form>
  );
};

export default EditCommercialForm;
