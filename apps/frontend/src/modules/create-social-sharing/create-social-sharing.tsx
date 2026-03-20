'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { paths } from 'src/shared/routes/paths.config';
import { useBoolean } from 'src/shared/hooks/use-boolean';

import RegisterSuccessful from './register-successful';
import SocialSharingHeader from './social-sharing-header';
import useGetConditions from './_hooks/use-get-conditions';
import useGetShareTypes from './_hooks/use-get-share-types';
import SocialSharingProgress from './social-sharing-progress';
import ImageForm from './create-social-sharing-form/image-form';
import ContactForm from './create-social-sharing-form/contact-form';
import LocationForm from './create-social-sharing-form/location-form';
import InformationForm from './create-social-sharing-form/information-form';
import { ownerForm, informationForm } from './create-social-sharing-form/form-validators';
import CreateSocialSharingForm from './create-social-sharing-form/create-social-sharing-form';

import type { FormSteps } from './_types/create-social-sharing.type';

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
    <Stack sx={{ height: '100vh' }}>
      {isSuccess.value ? (
        <RegisterSuccessful handleFormSuccessful={handleFormSuccessful} />
      ) : (
        <>
          <SocialSharingHeader handleBackFromProgress={handleBackFormProgress} />
          <SocialSharingProgress progressPercentage={progressPercentage} step={progressStep} />

          <Box sx={{ flexGrow: 1, margin: '20px', paddingBottom: '100px' }}>
            <CreateSocialSharingForm
              progressStep={progressStep}
              handleNextFormProgress={handleNextFormProgress}
              loading={loading}
              formSteps={formSteps}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default CreateSocialShaing;
