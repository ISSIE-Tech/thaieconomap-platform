'use client';

import type { FormSteps } from './_types/create-social-sharing.type';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { useBoolean } from 'src/shared/hooks/use-boolean';

import { FormWizardShell } from '../form-wizard';
import RegisterSuccessful from './register-successful';
import SocialSharingHeader from './social-sharing-header';
import useGetConditions from './_hooks/use-get-conditions';
import useGetShareTypes from './_hooks/use-get-share-types';
import ImageForm from './create-social-sharing-form/image-form';
import ContactForm from './create-social-sharing-form/contact-form';
import LocationForm from './create-social-sharing-form/location-form';
import InformationForm from './create-social-sharing-form/information-form';
import SocialSharingProgress, { SHARING_STEP_TITLES } from './social-sharing-progress';
import { ownerForm, informationForm } from './create-social-sharing-form/form-validators';
import CreateSocialSharingForm from './create-social-sharing-form/create-social-sharing-form';

const CreateSocialShaing = () => {
  const router = useRouter();

  const { data: types } = useGetShareTypes();
  const { data: conditions } = useGetConditions();

  const [progressPercentage, setProgressPercentage] = useState(25);
  const [progressStep, setProgressStep] = useState(0);

  const firstStep = 0;
  const lastStep = 3;
  const stepPercentage = 100 / (lastStep + 1);

  const isSuccess = useBoolean();
  const loading = useBoolean();

  // ----------------------------------------------------------------------------------------------------------------

  const formSteps: FormSteps[] = [
    {
      key: 'INFORMATION',
      component: () => <InformationForm types={types ?? []} conditions={conditions ?? []} />,
      validate: informationForm,
    },
    { key: 'CONTACT', component: () => <ContactForm />, validate: ownerForm },
    { key: 'LOCATION', component: () => <LocationForm />, validate: ['location'] },
    { key: 'IMAGE', component: () => <ImageForm />, validate: ['image', 'additionalImageUrl'] },
  ];

  // ----------------------------------------------------------------------------------------------------------------

  const handleBackFormProgress = () => {
    switch (progressStep) {
      case firstStep:
        router.replace(paths.sharings);
        break;
      default:
        setProgressPercentage((prev) => prev - stepPercentage);
        setProgressStep((prev) => prev - 1);
        break;
    }
  };

  const handleNextFormProgress = () => {
    switch (progressStep) {
      case lastStep:
        isSuccess.onTrue();
        setProgressPercentage(stepPercentage);
        setProgressStep(0);
        loading.onFalse();
        break;
      default:
        setProgressPercentage((prev) => prev + stepPercentage);
        setProgressStep((prev) => prev + 1);
        break;
    }
  };

  const handleFormSuccessful = () => {
    router.replace(paths.sharings);
    setProgressPercentage(stepPercentage);
    setProgressStep(0);
  };

  // ----------------------------------------------------------------------------------------------------------------

  return (
    <FormWizardShell
      title="แบ่งปันสิ่งของ"
      illustration="/assets/illustrations/social-sharing-register-header.svg"
      steps={SHARING_STEP_TITLES}
      step={progressStep}
      mobileHeader={
        <>
          <SocialSharingHeader handleBackFromProgress={handleBackFormProgress} />
          <SocialSharingProgress progressPercentage={progressPercentage} step={progressStep} />
        </>
      }
      success={
        isSuccess.value && <RegisterSuccessful handleFormSuccessful={handleFormSuccessful} />
      }
    >
      <CreateSocialSharingForm
        progressStep={progressStep}
        handleNextFormProgress={handleNextFormProgress}
        handleBackFormProgress={handleBackFormProgress}
        loading={loading}
        formSteps={formSteps}
      />
    </FormWizardShell>
  );
};

export default CreateSocialShaing;
