'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';

// -------------------------------------------------------------

type Props = {
  onClick: () => void;
};

export function MenuBtn({ onClick }: Props) {
  return (
    <Box sx={{ cursor: 'pointer' }} onClick={onClick}>
      <Image src="/assets/icons/menu.svg" alt="menu button" width="24" height="24" />
    </Box>
  );
}
