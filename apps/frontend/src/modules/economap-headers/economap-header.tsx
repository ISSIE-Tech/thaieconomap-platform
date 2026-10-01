import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Menu } from './menu';
import { DesktopHeader } from './desktop-header';
import { HeaderActionButtons } from './header-action-buttons';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  menu?: ReactNode;
  actionButton?: ReactNode;
};

export function EconomapHeader({ title, menu, actionButton }: Props) {
  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DesktopHeader />
      </Box>

      <Grid container py={2} px={3} sx={{ display: { md: 'none' } }}>
        <Grid container size={4} alignContent="center">
          {menu || <Menu />}
        </Grid>

        <Grid container size={4} justifyContent="center">
          <Typography variant="body1" fontWeight="bold" whiteSpace="nowrap">
            {title}
          </Typography>
        </Grid>

        <Grid container size={4} justifyContent="flex-end">
          {actionButton || <HeaderActionButtons />}
        </Grid>
      </Grid>
    </>
  );
}
