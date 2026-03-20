'use client';

import type { FavoriteTiny } from 'src/modules/favorites/_types/favorites.type';
import type { TabValue } from 'src/modules/favorites/_constants/favourites-tabs';

import { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';

import { FavoritesTabs } from 'src/modules/favorites';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import FavoritesList from 'src/modules/favorites/favorites-list';
import { COMMERCIAL_TABS } from 'src/shared/routes/paths.config';
import { FAVORITE_TABS } from 'src/modules/favorites/_constants/favourites-tabs';
import useGetTinyFavorites from 'src/modules/favorites/_hooks/use-get-tiny-favorites';

import DrawersController from './drawers-controller';

export default function Favorite() {
  const [tab, setTab] = useState<TabValue>(FAVORITE_TABS.ECONOMAP.en); // Default to "economap"
  const { data: favorites, isLoading } = useGetTinyFavorites();

  const [selectedId, setSelectedId] = useState('');

  // drawers
  const commercialDrawerController = useBoolean();
  const pumpuangDrawerController = useBoolean();
  const sharingDrawerController = useBoolean();

  const { businesses, restaurants, shares, pumpuangs } = useMemo(() => {
    if (!favorites)
      return {
        businesses: [] as FavoriteTiny[],
        restaurants: [] as FavoriteTiny[],
        shares: [] as FavoriteTiny[],
        pumpuangs: [] as FavoriteTiny[],
      };

    return { ...favorites.commercials, shares: favorites.shares, pumpuangs: favorites.pumpuangs };
  }, [favorites]);

  return (
    <Stack minHeight="100vh">
      <Stack position="fixed" width="100%">
        <BlueRoundedHeader
          title="รายการโปรดของฉัน"
          wrapperStyle={{ pb: 0 }}
          headerStyle={{ position: 'static' }}
        />

        <FavoritesTabs tab={tab} setTab={setTab} />
      </Stack>

      <Stack flexGrow={1} mt={16} mb={8} px={3}>
        {tab === FAVORITE_TABS.ECONOMAP.en ? (
          <>
            {/* restaurant */}
            <FavoritesList
              tab={tab}
              title={COMMERCIAL_TABS.RESTAURANT}
              favorites={restaurants}
              isLoading={isLoading}
              onClick={(id: string) => {
                setSelectedId(id);
                commercialDrawerController.onTrue();
              }}
            />
            {/* business */}
            <FavoritesList
              tab={tab}
              title={COMMERCIAL_TABS.BUSINESSES}
              favorites={businesses}
              isLoading={isLoading}
              onClick={(id: string) => {
                setSelectedId(id);
                commercialDrawerController.onTrue();
              }}
            />
            {/* pumpuang */}
            <FavoritesList
              tab={tab}
              title={COMMERCIAL_TABS.PUMPUANG}
              favorites={pumpuangs}
              isLoading={isLoading}
              onClick={(id: string) => {
                setSelectedId(id);
                pumpuangDrawerController.onTrue();
              }}
              isPumpuang
            />
          </>
        ) : (
          // sharing
          <FavoritesList
            tab={tab}
            title={FAVORITE_TABS.ITEMS}
            favorites={shares}
            isLoading={isLoading}
            onClick={(id: string) => {
              setSelectedId(id);
              sharingDrawerController.onTrue();
            }}
          />
        )}
      </Stack>

      <DrawersController
        selectedId={selectedId}
        commercialController={commercialDrawerController}
        sharingController={sharingDrawerController}
        pumpuangController={pumpuangDrawerController}
      />
    </Stack>
  );
}
