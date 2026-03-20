'use client';

import Image from 'next/image';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// -------------------------------------------------------------

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function NavigateLink({ text, onClick, disabled = false }: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      onClick={disabled ? undefined : onClick}
      sx={{ cursor: 'pointer' }}
    >
      <Typography
        variant="body1"
        color={disabled ? 'text.disabled' : ''}
        sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {text}
      </Typography>

      <Image src="/assets/icons/right-arrow.svg" alt="cross icon" width="24" height="24" />
    </Stack>
  );
}
