import { common, primary } from 'src/theme/core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  progressPercentage: number;
  step: number;
};

const SocialSharingProgress = ({ progressPercentage, step }: Props) => {
  const progressTitle = [
    'กรอกข้อมูลเพื่อแบ่งปันสิ่งของ',
    'กรอกข้อมูลเพื่อแบ่งปันสิ่งของ',
    'เพิ่มตำแหน่งสิ่งของ',
    'เพิ่มรูปสิ่งของ',
  ];
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

export default SocialSharingProgress;
