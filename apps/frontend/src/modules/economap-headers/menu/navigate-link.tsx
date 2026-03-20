'use client';

import type { TypographyProps } from '@mui/material/Typography';

import Typography from '@mui/material/Typography';

// -------------------------------------------------------------

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
} & TypographyProps;

export default function NavigateLink({ text, onClick, disabled = false, ...props }: Props) {
  return (
    <Typography
      variant="body1"
      fontWeight="bold"
      onClick={disabled ? undefined : onClick}
      color={disabled ? 'text.disabled' : ''}
      sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      {...props}
    >
      {text}
    </Typography>
  );
}
