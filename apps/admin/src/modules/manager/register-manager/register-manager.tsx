import React from 'react';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import RegisterForm from './register-form';

const RegisterManager = () => (
    <Card sx={{ mx: 'auto', width: { xs: 720, xl: 880 } }}>
      <CardHeader title="ลงทะเบียนผู้จัดการใหม่" sx={{ mb: 3 }} />
      <Divider />

      <RegisterForm />
    </Card>
  );

export default RegisterManager;
