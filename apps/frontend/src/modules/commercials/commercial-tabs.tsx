'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';

import { paths, COMMERCIAL_TABS } from 'src/shared/routes/paths.config';

export default function CommercialTabs() {
  const pathname = usePathname();

  const router = useRouter();

  const theme = useTheme();

  const handleTabChanged = useCallback(
    (event: React.SyntheticEvent, newPath: string) => {
      router.replace(newPath);
    },
    [router]
  );

  return (
    <Tabs
      value={pathname}
      onChange={handleTabChanged}
      variant="fullWidth"
      TabIndicatorProps={{
        style: {
          backgroundColor: theme.palette.primary.main,
          height: '0.3rem',
          borderRadius: '1rem 1rem 0 0',
        },
      }}
      sx={{
        borderTop: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Tab label={COMMERCIAL_TABS.RESTAURANT.th} value={paths.commercials.restaurants} />
      <Tab label={COMMERCIAL_TABS.BUSINESSES.th} value={paths.commercials.businesses} />
      <Tab label={COMMERCIAL_TABS.PUMPUANG.th} value={paths.commercials.pumpuang} />
    </Tabs>
  );
}
