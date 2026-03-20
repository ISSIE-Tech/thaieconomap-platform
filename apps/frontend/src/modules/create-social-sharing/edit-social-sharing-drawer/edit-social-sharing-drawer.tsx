'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { Sharing } from 'src/modules/sharings/_types/sharing.type';

import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import CancelModal from 'src/modules/create-commercials/edit-commercial-drawer/cancel-modal';
import EditSuccessful from 'src/modules/create-commercials/edit-commercial-drawer/edit-successful';
import { FormLoading } from 'src/shared/components/hook-form/custom-form-loading/edit-form-loading';

import { reformatDefaultValues } from './form-validators';
import SocialSharingHeader from '../social-sharing-header';
import useGetConditions from '../_hooks/use-get-conditions';
import useGetShareTypes from '../_hooks/use-get-share-types';
import SocialSharingProgress from '../social-sharing-progress';
import EditSocialSharingForm from './edit-social-sharing-form';
import ImageForm from '../create-social-sharing-form/image-form';
import ContactForm from '../create-social-sharing-form/contact-form';
import LocationForm from '../create-social-sharing-form/location-form';
import InformationForm from '../create-social-sharing-form/information-form';
import { ownerForm, informationForm } from '../create-social-sharing-form/form-validators';

import type { FormValues } from './form-validators';
import type { FormSteps } from '../_types/create-social-sharing.type';

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
          width: { xs: '100vw', md: 480 },
          overflowX: 'hidden',
          overflowY: 'scroll',
          pb: 8,
        },
      }}
      anchor="right"
    >
      {isSuccess.value ? (
        <EditSuccessful />
      ) : (
        <>
          <SocialSharingHeader handleBackFromProgress={handleBackFormProgress} />
          <SocialSharingProgress progressPercentage={progressPercentage} step={progressStep} />

          {types && conditions && sharing && defaultValue ? (
            <Box sx={{ flexGrow: 1, margin: '20px' }}>
              <EditSocialSharingForm
                handleNextFormProgress={handleNextFormProgress}
                sharing={sharing}
                progressStep={progressStep}
                loading={loading}
                defaultValue={defaultValue}
                formSteps={formSteps}
              />
              <Button
                variant="contained"
                sx={{
                  width: '100%',
                  marginTop: '20px',
                  py: 1.5,
                  px: 2.5,
                  borderRadius: 4,
                  justifyContent: 'center',
                  color: (theme) => theme.palette.error.main,
                  '&:disabled': {
                    color: (theme) => theme.palette.error.main,
                    backgroundColor: (theme) => theme.palette.common.background,
                  },
                }}
                onClick={openCancelModal.onTrue}
                disabled={loading.value}
              >
                ยกเลิก
              </Button>
            </Box>
          ) : (
            <FormLoading />
          )}

          <CancelModal openModal={openCancelModal} handleCloseDrawer={handleCloseDrawer} />
        </>
      )}
    </Drawer>
  );
};

export default EditSocialSharingDrawer;
