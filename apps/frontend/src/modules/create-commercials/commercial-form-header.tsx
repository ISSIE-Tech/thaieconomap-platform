'use client';

import Box from '@mui/material/Box';

import { Image } from 'src/shared/components/image';
import { BackBtn } from 'src/shared/components/custom-buttons';

type Props = {
  handleBackFormProgress: () => void;
};

const CommercialFormHeader = ({ handleBackFormProgress }: Props) => (
  <Box>
    <BackBtn
      onClick={handleBackFormProgress}
      sx={{ position: 'absolute', top: 56, left: 16, zIndex: 10 }}
    />

    <Box
      sx={{
        width: 'full',
        height: '224px',
        marginTop: '55px',
        overflow: 'hidden',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Image
        src="/assets/illustrations/create-header.svg"
        alt="create-commercials-header"
        sx={{ width: 275, height: 275, zIndex: 10 }}
      />
      <Image
        src="/assets/illustrations/create-ellipse-blue.svg"
        alt="create-ellipse-blue"
        sx={{ width: 325, height: 325, position: 'absolute', left: -50, zIndex: 1 }}
      />
      <Image
        src="/assets/illustrations/create-ellipse-yellow.svg"
        alt="create-ellipse-blue"
        sx={{ width: 325, height: 325, position: 'absolute', right: 0 }}
      />
    </Box>
  </Box>
);

export default CommercialFormHeader;
