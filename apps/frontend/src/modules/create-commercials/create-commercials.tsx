'use client';

import type { FormSteps } from './_types/create-commercials.type';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import useGetDistricts from 'src/shared/hooks/use-get-districts';

import { FormWizardShell } from '../form-wizard';
import RegisterSuccessful from './register-successful';
import CommercialFormHeader from './commercial-form-header';
import ImageForm from './create-commercials-form/image-form';
import { CommercialType } from './_types/create-commercials.type';
import LocationForm from './create-commercials-form/location-form';
import DateTimeForm from './create-commercials-form/date-time-form';
import InformationForm from './create-commercials-form/information-form';
import { informationForm } from './create-commercials-form/form-validators';
import useGetBusinessTypes from '../commercials/_hooks/use-get-business-types';
import useGetRestaurantTypes from '../commercials/_hooks/use-get-restaurant-types';
import CreateCommercialForm from './create-commercials-form/create-commercial-form';
import CommercialFormProgressBar, { commercialStepTitles } from './commercial-form-progress-bar';

type Props = {
  commercialType: CommercialType;
};

export const CreateCommercials = ({ commercialType }: Props) => {
  const router = useRouter();

  const { data: districts } = useGetDistricts();
  const { data: typesRestaurant } = useGetRestaurantTypes();
  const { data: typesBusiness } = useGetBusinessTypes();

  const [progressPercentage, setProgressPercentage] = useState(25);
  const [progressStep, setProgressStep] = useState(0);

  const firstStep = 0;
  const lastStep = 3;
  const stepPercentage = 100 / (lastStep + 1);

  const isSuccess = useBoolean();
  const loading = useBoolean();

  const defaultPage =
    commercialType === 'ร้านอาหาร' ? paths.commercials.restaurants : paths.commercials.businesses;

  // ------------------------------------------------------------------------------------------------
  const types = (() => {
    switch (commercialType) {
      case CommercialType.RESTAURANT:
        return typesRestaurant;
      case CommercialType.BUSINESS:
        return typesBusiness;
      case CommercialType.PUMPUANG:
        return null;
      default:
        return null;
    }
  })();

  const formSteps: FormSteps[] = [
    {
      key: 'INFORMATION',
      component: () => (
        <InformationForm
          commercialType={commercialType}
          districts={districts ?? []}
          types={types ?? []}
        />
      ),
      validate: informationForm,
    },
    { key: 'DATE_TIME', component: () => <DateTimeForm />, validate: ['opening'] },
    { key: 'LOCATION', component: () => <LocationForm />, validate: ['location'] },
    {
      key: 'IMAGE',
      component: () => <ImageForm commercialType={commercialType} />,
      validate: ['image', 'additionalImageUrl'],
    },
  ];

  // ------------------------------------------------------------------------------------------------

  const handleBackFormProgress = () => {
    switch (progressStep) {
      case firstStep:
        router.replace(defaultPage);
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
    router.replace(defaultPage);
    setProgressPercentage(stepPercentage);
    setProgressStep(0);
  };

  // ------------------------------------------------------------------------------------------------

  return (
    <FormWizardShell
      title={`ลงทะเบียน${commercialType}`}
      illustration="/assets/illustrations/create-header.svg"
      steps={commercialStepTitles(commercialType)}
      step={progressStep}
      mobileHeader={
        <>
          <CommercialFormHeader handleBackFormProgress={handleBackFormProgress} />
          <CommercialFormProgressBar
            progressPercentage={progressPercentage}
            step={progressStep}
            commercialType={commercialType}
          />
        </>
      }
      success={
        isSuccess.value && (
          <RegisterSuccessful
            commercialType={commercialType}
            handleFormSuccessful={handleFormSuccessful}
          />
        )
      }
    >
      <CreateCommercialForm
        handleNextFormProgress={handleNextFormProgress}
        handleBackFormProgress={handleBackFormProgress}
        progressStep={progressStep}
        commercialType={commercialType}
        loading={loading}
        formSteps={formSteps}
      />
    </FormWizardShell>
  );
};
