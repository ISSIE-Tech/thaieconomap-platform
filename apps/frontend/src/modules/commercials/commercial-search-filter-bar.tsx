'use client';

import type { LocationFilter, WorkingHourFilter } from './_types/commercials.type';

import { useMemo, useState, useEffect } from 'react';
// import { CONFIG } from 'src/config-global';
import { paths } from 'src/shared/routes/paths.config';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { SearchInput } from 'src/shared/components/custom-inputs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Stack from '@mui/material/Stack';

import { FilterBtn } from './filter-btn';
import { CommercialFilterDrawer } from './filter-drawer';
import { useCommercialStore } from './_store/commercials.store';
import { PumpuangFilterDrawer } from '../pumpuangs/filter-drawer';
import { DistrictSearchDrawer } from './search-drawer/district-search-drawer';
import { getIsDefault, commercialFilterDefault } from './_types/commercials.type';

export default function CommercialSearchFilterBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterController = useBoolean();
  const searchController = useBoolean();
  const [searchedDistrict, setSearchedDistrict] = useState('');

  const map = useCommercialStore((state) => state.map);
  const isPumpuang = useBoolean();

  // query filter
  const workingHour = searchParams.get('workingHour');
  const location = searchParams.get('location');
  const types = searchParams.get('types');

  // check if filter default
  const isFilterDefault = useMemo(() => {
    const isDefault = getIsDefault(
      (workingHour as WorkingHourFilter) ?? commercialFilterDefault.workingHour,
      (location as LocationFilter) ?? commercialFilterDefault.location,
      types ?? ''
    );

    switch (pathname) {
      case paths.commercials.restaurants:
      case paths.commercials.businesses:
        isPumpuang.onFalse();
        return isDefault;
      default:
        isPumpuang.onTrue();
        return isDefault;
    }
  }, [isPumpuang, location, pathname, types, workingHour]);

  // TODO: when changing tabs after filter, user HAVE to wait for fetch from filter to complete before the tabs change
  // maybe use cancel signal to cancel fetch or something
  // TODO: should probably have a hash map of queryParams like 'workingHour' and 'location'

  // saving filter
  const filterUrls = useCommercialStore((state) => state.filterUrls);
  const setFilterUrls = useCommercialStore((state) => state.setFilterUrls);
  const hasNoParams = !workingHour && !location && !types;
  const router = useRouter();

  // ========== USED FOR: if there's no query params, set it to whatever is in zustand state ==========
  useEffect(() => {
    if (!hasNoParams) return;
    // Load the existing filter URLs if there are no search parameters
    const newSearchParams = new URLSearchParams(window.location.search);

    const commercialPath = pathname as keyof typeof filterUrls;
    if (filterUrls[commercialPath].workingHour !== commercialFilterDefault.workingHour)
      newSearchParams.set('workingHour', filterUrls[commercialPath].workingHour);
    if (filterUrls[commercialPath].location !== commercialFilterDefault.location)
      newSearchParams.set('location', filterUrls[commercialPath].location);
    if (filterUrls[commercialPath].types !== '')
      newSearchParams.set('types', filterUrls[commercialPath].types);

    // Create a new URL with updated search parameters using pathname
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.replace(newUrl);
  }, [filterUrls, hasNoParams, pathname, router]);

  // ========== USED FOR: if there're query params, save them in zustand state ==========
  useEffect(() => {
    if (hasNoParams) return;

    const commercialPath = pathname as keyof typeof filterUrls;
    // If there are search parameters, save them
    if (workingHour) setFilterUrls(commercialPath, 'workingHour', workingHour);
    if (location) setFilterUrls(commercialPath, 'location', location);
    if (types) setFilterUrls(commercialPath, 'types', types);
  }, [setFilterUrls, workingHour, location, types, hasNoParams, pathname]);

  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        width="100vw"
        position="absolute"
        px={2}
        pt={2}
        alignItems="center"
        zIndex={1000}
        bgcolor="transparent"
      >
        <SearchInput
          value={searchedDistrict}
          placeholder="พิมพ์ชื่อเขต/อำเภอ"
          onClick={searchController.onTrue}
        />

        <FilterBtn filterController={filterController} isFilterDefault={isFilterDefault} />
      </Stack>

      {map && (
        <DistrictSearchDrawer
          controller={searchController}
          map={map}
          onClose={(district: string) => setSearchedDistrict(district)}
        />
      )}

      {isPumpuang.value ? (
        <PumpuangFilterDrawer controller={filterController} />
      ) : (
        <CommercialFilterDrawer controller={filterController} />
      )}
    </>
  );
}
