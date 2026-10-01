import type { FormValues } from './form-validators';
import type { SubmitHandler } from 'react-hook-form';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { FormSteps, CommercialType } from '../_types/create-commercials.type';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormActions } from 'src/modules/form-wizard';
import { Form } from 'src/shared/components/hook-form';
import { toast } from 'src/shared/components/snackbar';

import { reformatFormData } from '../reformat-data';
import { formSchema, defaultValue } from './form-validators';
import useCreateAdditionalImage from '../_hooks/use-create-additional-images';
import useCreatePendingCommercials from '../_hooks/use-create-pending-commercials';

type Props = {
  handleNextFormProgress: () => void;
  handleBackFormProgress: () => void;
  progressStep: number;
  commercialType: CommercialType;
  loading: UseBooleanReturn;
  formSteps: FormSteps[];
};

const CreateCommercialForm = ({
  handleNextFormProgress,
  handleBackFormProgress,
  progressStep,
  commercialType,
  loading,
  formSteps,
}: Props) => {
  const methods = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
  const { trigger } = methods;

  const createAdditionalImage = useCreateAdditionalImage();

  const createPendingCommercials = useCreatePendingCommercials();

  const handleFormValidation = async () => {
    const validateState = await trigger(formSteps[progressStep].validate);
    if (validateState) {
      handleNextFormProgress();
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    loading.onTrue();
    const formatteddata = await reformatFormData(
      data,
      commercialType,
      createAdditionalImage.mutateAsync,
      loading
    );

    await createPendingCommercials.mutateAsync(formatteddata, {
      onSuccess: handleNextFormProgress,
      onError: (error) => {
        toast.error(error.display);
        loading.onFalse();
      },
    });
  };

  const FormComponent = formSteps[progressStep].component;
  const buttonOnClick = progressStep === 3 ? methods.handleSubmit(onSubmit) : handleFormValidation;
  const buttonLabel = progressStep === 3 ? 'ยืนยันการลงทะเบียน' : 'ถัดไป';

  return (
    <Form methods={methods}>
      <FormComponent />
      <FormActions
        label={buttonLabel}
        onNext={buttonOnClick}
        onBack={handleBackFormProgress}
        loading={loading.value}
      />
    </Form>
  );
};

export default CreateCommercialForm;
