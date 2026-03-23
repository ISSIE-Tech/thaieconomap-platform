'use client';

import type { CommercialType } from './_types/create-commercials.type';

import React from 'react';
import { common, primary } from 'src/theme/core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  progressPercentage: number;
  commercialType: CommercialType;
  step: number;
};

const CommercialFormProgressBar = ({ progressPercentage, commercialType, step }: Props) => {
  const progressTitle = [
    `กรอกข้อมูลลงทะเบียน${commercialType}`,
    'ช่วงเวลาทำการ',
    `เพิ่มตำแหน่ง${commercialType}`,
    `เพิ่มรูปภาพ${commercialType}`,
  ];

  // because step start at 0 but when display on progress bar is start at 1
  const progressStep = step + 1;

  return (
    <Stack>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ height: '56px', width: 'full', marginLeft: '20px' }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: '50%',
            height: '24px',
            width: '24px',
            bgcolor: primary.main,
            color: common.white,
          }}
        >
          <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'center' }}>
            {progressStep}
          </Typography>
        </Stack>

        <Typography variant="body1" fontWeight="bold">
          {progressTitle[step]}
        </Typography>
      </Stack>

      <Box sx={{ bgcolor: (theme) => theme.palette.grey[200], height: '4px' }}>
        <Box sx={{ height: '4px', bgcolor: primary.dark, width: `${progressPercentage}%` }} />
      </Box>
    </Stack>
  );
};

export default CommercialFormProgressBar;
