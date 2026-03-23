'use client';

import type { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

// -------------------------------------------------------------

export type BaseBtnProps = {
  onClick?: () => void;
  sx?: SxProps<Theme>;
};

export default function BaseBtn({ onClick, sx, children }: PropsWithChildren<BaseBtnProps>) {
  return (
    <Box onClick={onClick} sx={{ cursor: 'pointer', ...sx }}>
      {children}
    </Box>
  );
}
