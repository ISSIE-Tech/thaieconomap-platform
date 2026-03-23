'use client';

import { StatusText } from 'src/modules/favorites';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type Props = {
  text: string;
};

export const StatusBox = ({ text }: Props) => {
  const theme = useTheme();

  return (
    <>
      {/* invisible box to align status text, aria-hidden for screen reader */}
      <Box visibility="hidden" aria-hidden="true">
        invisible
      </Box>

      <StatusText
        sx={{
          bgcolor: theme.palette.primary.main,
          right: 0,
          left: 'auto',
          transform: 'none',
        }}
      >
        <Typography color="white" variant="overline" fontWeight="bold">
          {text}
        </Typography>
      </StatusText>
    </>
  );
};
