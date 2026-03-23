'use client';

import type { FormValues } from './form-validators';
import type { FormSteps } from '../_types/create-commercials.type';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import React, { useState, useEffect, useCallback } from 'react';
import useGetDistricts from 'src/shared/hooks/use-get-districts';
import useGetBusinessTypes from 'src/modules/commercials/_hooks/use-get-business-types';
import useGetRestaurantTypes from 'src/modules/commercials/_hooks/use-get-restaurant-types';
import { FormLoading } from 'src/shared/components/hook-form/custom-form-loading/edit-form-loading';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import CancelModal from './cancel-modal';
import EditSuccessful from './edit-successful';
import EditCommercialForm from './edit-commercial-form';
import { reformatDefaultValues } from './form-validators';
import CommercialFormHeader from '../commercial-form-header';
import ImageForm from '../create-commercials-form/image-form';
import { CommercialType } from '../_types/create-commercials.type';
import LocationForm from '../create-commercials-form/location-form';
import DateTimeForm from '../create-commercials-form/date-time-form';
import CommercialFormProgressBar from '../commercial-form-progress-bar';
import InformationForm from '../create-commercials-form/information-form';
import { informationForm } from '../create-commercials-form/form-validators';

type Props = {
  openDrawer: UseBooleanReturn;
  commercial?: Commercial | null;
};

export const EditCommercialDrawer = ({ openDrawer, commercial }: Props) => {
  const { data: districts } = useGetDistricts();
  const { data: typesRestaurant } = useGetRestaurantTypes();
  const { data: typesBusiness } = useGetBusinessTypes();

  const [defaultValue, setDefaultValue] = useState<FormValues>();
  const [progressPercentage, setProgressPercentage] = useState(25);
  const [progressStep, setProgressStep] = useState(0);

  const firstStep = 0;
  const lastStep = 3;
  const stepPercentage = 100 / (lastStep + 1);

  const isSuccess = useBoolean();
  const openCancelModal = useBoolean();
  const loading = useBoolean();

  // ------------------------------------------------------------------------------------------------

  const commercialType = () => {
    switch (commercial?.category) {
      case 'BUSINESS':
        return CommercialType.BUSINESS;
      case 'RESTAURANT':
        return CommercialType.RESTAURANT;
      default:
        return CommercialType.RESTAURANT;
    }
  };

  const types = (() => {
    switch (commercialType()) {
      case CommercialType.RESTAURANT:
        return typesRestaurant;
      case CommercialType.BUSINESS:
        return typesBusiness;
      default:
        return null;
    }
  })();

  const fetchDefaultValue = useCallback(async () => {
    const values = await reformatDefaultValues(commercial);
    setDefaultValue(values);
  }, [commercial]);

  const formSteps: FormSteps[] = [
    {
      key: 'INFORMATION',
      component: () => (
        <InformationForm
          commercialType={commercialType()}
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
      component: () => <ImageForm commercialType={commercialType()} />,
      validate: ['image', 'additionalImageUrl'],
    },
  ];

  // ------------------------------------------------------------------------------------------------

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

  // ------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (openDrawer.value) {
      fetchDefaultValue();
    }
  }, [openDrawer, fetchDefaultValue]);

  // ------------------------------------------------------------------------------------------------

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
          <CommercialFormHeader handleBackFormProgress={handleBackFormProgress} />
          <CommercialFormProgressBar
            progressPercentage={progressPercentage}
            step={progressStep}
            commercialType={commercialType()}
          />

          {commercial && defaultValue && districts && types ? (
            <Box sx={{ margin: '20px' }}>
              <EditCommercialForm
                commercial={commercial}
                commercialType={commercialType()}
                progressStep={progressStep}
                handleNextFormProgress={handleNextFormProgress}
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
