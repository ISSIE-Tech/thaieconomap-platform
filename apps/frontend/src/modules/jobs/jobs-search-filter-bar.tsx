'use client';

import { useMemo, useState } from 'react';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { SearchInput } from 'src/shared/components/custom-inputs';

import Stack from '@mui/material/Stack';

import { JobsFilterDrawer } from './filter-drawer';
import { useJobsStore } from './_store/jobs.store';
import { FilterBtn } from '../commercials/filter-btn';
import { useJobsFilterAutoUrl } from './_hooks/use-jobs-filter';
import { getIsDefault, JOBS_FILTER_BY } from './_constants/jobs-filter';
import { DistrictSearchDrawer } from '../commercials/search-drawer/district-search-drawer';

export default function JobsSearchFilterBar() {
  // district searching
  const map = useJobsStore((state) => state.map);
  const [searchedDistrict, setSearchedDistrict] = useState('');
  const searchController = useBoolean();

  // filtering
  const category = useJobsStore((state) => state.category);
  const isFilterDefault = useMemo(
    () => getIsDefault({ [JOBS_FILTER_BY.CATEGORY]: category }),
    [category]
  );

  const filterController = useBoolean();
  
  // automatically save url to store and vice versa
  useJobsFilterAutoUrl();

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

      <JobsFilterDrawer controller={filterController} />
    </>
  );
}
