import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormButton from '../../shared/components/custom-buttons/form-button';

import type { CommercialType } from './_types/create-commercials.type';

type Props = {
  commercialType: CommercialType;
  handleFormSuccessful: () => void;
};

const RegisterSuccessful = ({ commercialType, handleFormSuccessful }: Props) => {
  const RegisterSuccessfulTitle = () => {
    switch (commercialType) {
      case 'ธุรกิจ':
        return 'ลงทะเบียนธุรกิจสำเร็จ';
      case 'ร้านอาหาร':
        return 'ลงทะเบียนร้านอาหารสำเร็จ';
      case 'พุ่มพวง':
        return '';
      default:
        return '';
    }
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      spacing={4}
    >
      <Image
        src="/assets/illustrations/success.svg"
        width={200}
        height={200}
        alt="register-successful"
      />
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Typography variant="h2" fontWeight="bold">
          {RegisterSuccessfulTitle()}
        </Typography>
        <Typography variant="h2" fontWeight="bold">
          โปรดรอการยืนยัน
        </Typography>
      </Stack>

      <Box sx={{ width: '50%' }}>
        <FormButton onClick={handleFormSuccessful} label="กลับสู่หน้าหลัก" />
      </Box>
    </Stack>
  );
};

export default RegisterSuccessful;
