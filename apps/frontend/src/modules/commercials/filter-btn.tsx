'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/shared/components/iconify';

type Props = {
  filterController: UseBooleanReturn;
  isFilterDefault: boolean;
};

export function FilterBtn({ filterController, isFilterDefault }: Props) {
  const theme = useTheme();

  return (
    <Stack position="relative" zIndex={1000}>
      {!isFilterDefault && (
        <Box
          width={12}
          height={12}
          top={0}
          right={0}
          position="absolute"
          bgcolor="#FFAC0B"
          border="1px solid white"
          borderRadius="50%"
          zIndex={1200}
        />
      )}

      <Fab
        color="default"
        size="medium"
        onClick={filterController.onTrue}
        sx={
          filterController.value || !isFilterDefault
            ? { bgcolor: theme.palette.primary.main, color: 'white' }
            : { bgcolor: 'white' }
        }
      >
        <Iconify icon="mi:filter" width={24} />
      </Fab>
    </Stack>
  );
}
