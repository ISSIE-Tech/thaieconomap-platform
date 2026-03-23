'use client';

import { Image } from 'src/shared/components/image';
import { BackBtn } from 'src/shared/components/custom-buttons';

import Box from '@mui/material/Box';

type Props = {
  handleBackFromProgress: () => void;
};

const SocialSharingHeader = ({ handleBackFromProgress }: Props) => (
  <Box>
    <BackBtn
      onClick={handleBackFromProgress}
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
        src="/assets/illustrations/social-sharing-register-header.svg"
        alt="create-commercials-header"
        sx={{ width: 275, height: 275, zIndex: 10 }}
      />
      <Image
        src="/assets/illustrations/create-ellipse-blue.svg"
        alt="create-ellipse-blue"
        sx={{ width: 400, height: 400, position: 'absolute', left: -90, top: -50, zIndex: 1 }}
      />
      <Image
        src="/assets/illustrations/create-ellipse-blue.svg"
        alt="create-ellipse-blue"
        sx={{ width: 325, height: 325, position: 'absolute', right: -50, top: 50, opacity: '50%' }}
      />
    </Box>
  </Box>
);

export default SocialSharingHeader;
