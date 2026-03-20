import React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/shared/routes/paths.config';
import FormButton from 'src/shared/components/custom-buttons/form-button';

const EditSuccessful = () => (
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
        แก้ไขรายละเอียดสำเร็จ
      </Typography>
      <Typography variant="h2" fontWeight="bold">
        โปรดรอการยืนยัน
      </Typography>
    </Stack>

    <Box sx={{ width: '50%' }}>
      <FormButton
        onClick={() => {
          window.location.href = paths.account['form-history'];
        }}
        label="กลับสู่หน้าหลัก"
      />
    </Box>
  </Stack>
);

export default EditSuccessful;
