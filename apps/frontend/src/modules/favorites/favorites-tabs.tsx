'use client';

import type { SyntheticEvent } from 'react';
import type { TabValue } from './_constants/favourites-tabs';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';

import { FAVORITE_TABS } from './_constants/favourites-tabs';

type Props = {
  tab: TabValue;
  setTab: (tab: TabValue) => void;
};

export default function FavoritesTabs({ tab, setTab }: Props) {
  const theme = useTheme();

  const handleTabChange = (event: SyntheticEvent, newValue: TabValue) => {
    setTab(newValue);
  };

  return (
    <Tabs
      value={tab}
      onChange={handleTabChange}
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
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        bgcolor: 'white',
      }}
    >
      <Tab label={FAVORITE_TABS.ECONOMAP.th} value={FAVORITE_TABS.ECONOMAP.en} />
      <Tab label={FAVORITE_TABS.ITEMS.th} value={FAVORITE_TABS.ITEMS.en} />
    </Tabs>
  );
}
