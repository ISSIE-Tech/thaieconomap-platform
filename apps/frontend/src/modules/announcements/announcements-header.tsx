'use client';

import Image from 'next/image';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { EconomapHeader } from 'src/modules/economap-headers';
import { MenuDrawer } from 'src/modules/economap-headers/menu/menu-drawer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import DistrictsAutocomplete from './districts-autocomplete/districts-autocomplete';

export default function AnnoucementsHeader() {
  return (
    <Stack
      spacing={1}
      position="fixed"
      width="100%"
      sx={{
        color: 'white',
        pb: '1rem',
        bgcolor: (theme) => theme.palette.primary.dark,
        borderBottomRightRadius: '3rem',
      }}
    >
      <EconomapHeader title="ประกาศทั่วไป" menu={<MenuWhite />} />

      <Stack px={3}>
        <DistrictsAutocomplete />
      </Stack>
    </Stack>
  );
}

// -------------------------------------------------------------

function MenuWhite() {
  const menuController = useBoolean(false);

  return (
    <>
      <Box sx={{ cursor: 'pointer' }} onClick={menuController.onToggle}>
        <Image src="/assets/icons/menu-white.svg" alt="menu button" width="24" height="24" />
      </Box>

      <MenuDrawer menuController={menuController} />
    </>
  );
}
