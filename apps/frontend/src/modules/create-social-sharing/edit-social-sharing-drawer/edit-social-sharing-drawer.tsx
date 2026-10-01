'use client';

import type { FormValues } from './form-validators';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { FormSteps } from '../_types/create-social-sharing.type';
import type { Sharing } from 'src/modules/sharings/_types/sharing.type';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import React, { useState, useEffect, useCallback } from 'react';
import CancelModal from 'src/modules/create-commercials/edit-commercial-drawer/cancel-modal';
import EditSuccessful from 'src/modules/create-commercials/edit-commercial-drawer/edit-successful';
import { FormLoading } from 'src/shared/components/hook-form/custom-form-loading/edit-form-loading';

import Drawer from '@mui/material/Drawer';

import { FormWizardShell } from '../../form-wizard';
import { reformatDefaultValues } from './form-validators';
import SocialSharingHeader from '../social-sharing-header';
import useGetConditions from '../_hooks/use-get-conditions';
import useGetShareTypes from '../_hooks/use-get-share-types';
import EditSocialSharingForm from './edit-social-sharing-form';
import ImageForm from '../create-social-sharing-form/image-form';
import ContactForm from '../create-social-sharing-form/contact-form';
import LocationForm from '../create-social-sharing-form/location-form';
import InformationForm from '../create-social-sharing-form/information-form';
import SocialSharingProgress, { SHARING_STEP_TITLES } from '../social-sharing-progress';
import { ownerForm, informationForm } from '../create-social-sharing-form/form-validators';

type Props = {
  openDrawer: UseBooleanReturn;
  sharing?: Sharing | null;
};
const EditSocialSharingDrawer = ({ sharing, openDrawer }: Props) => {
  const { data: types } = useGetShareTypes();
  const { data: conditions } = useGetConditions();

  const [defaultValue, setDefaultValue] = useState<FormValues>();
  const [progressPercentage, setProgressPercentage] = useState(25);
  const [progressStep, setProgressStep] = useState(0);

  const firstStep = 0;
  const lastStep = 3;
  const stepPercentage = 100 / (lastStep + 1);

  const isSuccess = useBoolean();
  const openCancelModal = useBoolean();
  const loading = useBoolean();

  // --------------------------------------------------------

  const fetchDefaultValue = useCallback(async () => {
    if (sharing) {
      const values = await reformatDefaultValues(sharing);
      setDefaultValue(values);
    }
  }, [sharing]);

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

  const handleNextFormProgress = () => {
    switch (progressStep) {
      case lastStep:
        isSuccess.onTrue();
        loading.onFalse();
        setProgressPercentage(stepPercentage);
        setProgressStep(firstStep);
        break;
      default:
        setProgressPercentage((prev) => prev + stepPercentage);
        setProgressStep((prev) => prev + 1);
        break;
    }
  };

  const handleBackFormProgress = () => {
    switch (progressStep) {
      case firstStep:
        openDrawer.onFalse();
        break;
      default:
        setProgressPercentage((prev) => prev - stepPercentage);
        setProgressStep((prev) => prev - 1);
        break;
    }
  };

  const handleCloseDrawer = () => {
    openCancelModal.onFalse();
    openDrawer.onFalse();
    isSuccess.onFalse();
    setProgressPercentage(stepPercentage);
    setProgressStep(firstStep);
  };

  // ----------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (openDrawer.value) {
      fetchDefaultValue();
    }
  }, [openDrawer, fetchDefaultValue]);

  return (
    <Drawer
      open={openDrawer.value}
      onClose={openDrawer.onFalse}
      PaperProps={{
        sx: {
          width: '100vw',
          overflowX: 'hidden',
          overflowY: { xs: 'scroll', md: 'hidden' },
          pb: { xs: 8, md: 0 },
        },
      }}
      anchor="right"
    >
      <FormWizardShell
        title="แก้ไขสิ่งของที่แบ่งปัน"
        illustration="/assets/illustrations/social-sharing-register-header.svg"
        steps={SHARING_STEP_TITLES}
        step={progressStep}
        mobileHeader={
          <>
            <SocialSharingHeader handleBackFromProgress={handleBackFormProgress} />
            <SocialSharingProgress progressPercentage={progressPercentage} step={progressStep} />
          </>
        }
        success={isSuccess.value && <EditSuccessful />}
      >
        {types && conditions && sharing && defaultValue ? (
          <EditSocialSharingForm
            handleNextFormProgress={handleNextFormProgress}
            handleBackFormProgress={handleBackFormProgress}
            onCancel={openCancelModal.onTrue}
            sharing={sharing}
            progressStep={progressStep}
            loading={loading}
            defaultValue={defaultValue}
            formSteps={formSteps}
          />
        ) : (
          <FormLoading />
        )}
      </FormWizardShell>

      <CancelModal openModal={openCancelModal} handleCloseDrawer={handleCloseDrawer} />
    </Drawer>
  );
};

export default EditSocialSharingDrawer;
