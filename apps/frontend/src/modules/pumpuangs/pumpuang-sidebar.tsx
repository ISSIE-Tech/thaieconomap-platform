'use client';

import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { DATA_NAME_THAI } from 'src/shared/components/constants';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  inBounds,
  ResultRow,
  ResultList,
  EmptyResults,
  useMapBounds,
  SidebarSearch,
  ResultsHeader,
} from 'src/shared/components/map-sidebar';

import Box from '@mui/material/Box';

import { QUERY_KEY } from './_config';
import { PumpuangFilterDrawer } from './filter-drawer';
import { getPumpuangById } from './_services/pumpuangs.service';
import useGetTinyPumpuangs from './_hooks/use-get-tiny-pumpuangs';
import { useCommercialStore } from '../commercials/_store/commercials.store';
import { getIsDefault, commercialFilterDefault } from '../commercials/_types/commercials.type';

// Pumpuang pins carry only a live position, so names come from one detail request per
// visible truck (react-query caches them).
// ponytail: N detail requests, add name/types to the tiny endpoint if the fleet grows large
export function PumpuangSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterController = useBoolean();
  const [query, setQuery] = useState('');

  const filterActive = !getIsDefault(
    (searchParams.get('workingHour') || commercialFilterDefault.workingHour) as never,
    (searchParams.get('location') || commercialFilterDefault.location) as never,
    searchParams.get('types') ?? ''
  );

  const map = useCommercialStore((state) => state.map);
  const setSelectedId = useCommercialStore((state) => state.setSelectedId);
  const bounds = useMapBounds(map);

  const { data } = useGetTinyPumpuangs();
  const visible = inBounds(data ?? [], bounds, (p) => p.current.location.coordinates);

  const details = useQueries({
    queries: visible.map((p) => ({
      queryKey: [QUERY_KEY.PUMPUANG, p._id],
      queryFn: getPumpuangById,
      staleTime: 60_000,
    })),
  });

  // name/plate live in the detail requests, so filter after they load
  const q = query.trim();
  const rows = visible
    .map((p, i) => ({ p, detail: details[i]?.data }))
    .filter(({ detail }) => !q || `${detail?.name ?? ''}${detail?.licensePlate ?? ''}`.includes(q));

  return (
    <>
      <Box px={2.5} pt={2}>
        <SidebarSearch
          value={query}
          onChange={setQuery}
          placeholder="พิมพ์ชื่อเขต/อำเภอ หรือชื่อรถ"
          filterActive={filterActive}
          onFilterClick={filterController.onTrue}
          map={map}
        />
      </Box>

      <ResultsHeader label={`พบ ${rows.length} ${DATA_NAME_THAI.PUMPUANG}`} />

      <ResultList>
        {rows.map(({ p, detail }) => (
          <ResultRow
            key={p._id}
            name={detail?.name ?? DATA_NAME_THAI.PUMPUANG}
            imageUrl={detail?.imageUrl}
            fallbackIcon="mdi:truck"
            subtitle={detail?.types?.map((t) => t.name).join(', ')}
            status={{ label: 'วิ่งอยู่', tone: 'success' }}
            meta={detail?.licensePlate}
            onClick={() => {
              map?.flyTo(p.current.location.coordinates, Math.max(map.getZoom(), 16));
              setSelectedId(p._id);
            }}
          />
        ))}
        {rows.length === 0 && (
          <EmptyResults
            onClear={() => {
              setQuery('');
              // explicit defaults: an empty query string makes the search bar restore the saved filter
              router.replace(`${pathname}?workingHour=ANYTIME&location=ANYWHERE&types=`);
            }}
          />
        )}
      </ResultList>

      <PumpuangFilterDrawer controller={filterController} />
    </>
  );
}
