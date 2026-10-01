import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormButton from './create-social-sharing-form/form-button';

type Props = {
  handleFormSuccessful: () => void;
};

const RegisterSuccessful = ({ handleFormSuccessful }: Props) => (
  <Stack
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ width: { xs: '100vw', md: '100%' }, height: { xs: '100vh', md: 'auto' } }}
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
        เพิ่มสิ่งของสำเร็จ
      </Typography>
      <Typography variant="h2" fontWeight="bold">
        โปรดรอการยืนยัน
      </Typography>
    </Stack>

    <Box sx={{ width: { xs: '50%', md: 280 } }}>
      <FormButton onClick={handleFormSuccessful} label="กลับสู่หน้าหลัก" />
    </Box>
  </Stack>
);

export default RegisterSuccessful;
