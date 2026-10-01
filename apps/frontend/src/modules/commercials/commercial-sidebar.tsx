'use client';

import type { CommercialTiny } from './_types/commercials.type';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  inBounds,
  ResultRow,
  QuickChip,
  DetailHero,
  MapSidebar,
  DetailLine,
  ResultList,
  DetailBlock,
  DetailPanel,
  DetailTitle,
  EmptyResults,
  useMapBounds,
  DetailActions,
  SidebarSearch,
  ResultsHeader,
} from 'src/shared/components/map-sidebar';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import CommercialTabs from './commercial-tabs';
import { CommercialFilterDrawer } from './filter-drawer';
import useGetCommercial from './_hooks/use-get-commercial';
import { useCommercialStore } from './_store/commercials.store';
import { PumpuangSidebar } from '../pumpuangs/pumpuang-sidebar';
import { CommercialActionButtons } from './commercial-detail-drawer';
import { useTinyCommercialsFromUrl } from './_hooks/use-tiny-commercials-from-url';
import {
  isOrderable,
  getIsDefault,
  commercialFilter,
  CommercialCategory,
  commercialFilterDefault,
  CommercialWorkingStatus,
} from './_types/commercials.type';

// ----------------------------------------------------------------------

export const STATUS_TONE = { OPEN: 'success', CLOSED: 'error', NEAR_OPEN: 'warning' } as const;

export const commercialIcon = (category: keyof typeof CommercialCategory) =>
  category === 'RESTAURANT' ? 'fluent:food-24-filled' : 'solar:shop-2-bold';

const TamsangBadge = () => (
  <Box
    component="img"
    src="/assets/images/logo-tamsang-tamsong.png"
    alt="สั่งผ่านตามสั่งตามส่งได้"
    title="สั่งผ่านตามสั่งตามส่งได้"
    sx={{ height: 22, width: 'auto', flexShrink: 0 }}
  />
);

export function CommercialSidebar() {
  const pathname = usePathname();
  const selectedId = useCommercialStore((state) => state.selectedId);
  const setSelectedId = useCommercialStore((state) => state.setSelectedId);

  const isPumpuang = pathname === paths.commercials.pumpuang;

  // switching tabs closes the open detail (not on mount: the shop page's "ดูบนแผนที่" preselects)
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) setSelectedId('');
    prevPathname.current = pathname;
  }, [pathname, setSelectedId]);

  return (
    <MapSidebar>
      {selectedId && !isPumpuang ? (
        <CommercialDetailPanel id={selectedId} onBack={() => setSelectedId('')} />
      ) : (
        <>
          <CommercialTabs />
          {isPumpuang ? (
            <PumpuangSidebar />
          ) : (
            <CommercialResults
              category={pathname === paths.commercials.businesses ? 'BUSINESS' : 'RESTAURANT'}
            />
          )}
        </>
      )}
    </MapSidebar>
  );
}

// ----------------------------------------------------------------------

function CommercialResults({ category }: { category: keyof typeof CommercialCategory }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterController = useBoolean();

  const [query, setQuery] = useState('');
  const [onlyNew, setOnlyNew] = useState(false);

  const map = useCommercialStore((state) => state.map);
  const setSelectedId = useCommercialStore((state) => state.setSelectedId);
  const setHoveredId = useCommercialStore((state) => state.setHoveredId);
  const bounds = useMapBounds(map);

  const { data } = useTinyCommercialsFromUrl(category);

  const workingHour = searchParams.get('workingHour') || commercialFilterDefault.workingHour;
  const location = searchParams.get('location') || commercialFilterDefault.location;
  const types = searchParams.get('types') ?? '';
  const orderable = searchParams.get('orderable');
  const filterDirty =
    onlyNew || !getIsDefault(workingHour as never, location as never, types, orderable);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // explicit defaults: an empty query string makes the search bar restore the saved filter
  const clearFilter = () => {
    setQuery('');
    setOnlyNew(false);
    router.replace(`${pathname}?workingHour=ANYTIME&location=ANYWHERE&types=`);
  };

  const q = query.trim();
  const items = inBounds(data ?? [], bounds, (c) => c.location.coordinates).filter(
    (c) =>
      (!q || `${c.name}${c.district?.districtName ?? ''}`.includes(q)) &&
      (!onlyNew || c.isNewlyOpened)
  );

  const select = (c: CommercialTiny) => {
    setHoveredId('');
    setSelectedId(c._id);
    map?.flyTo(c.location.coordinates, Math.max(map.getZoom(), 16));
  };

  return (
    <>
      <Stack spacing={1.5} px={2.5} pt={2}>
        <SidebarSearch
          value={query}
          onChange={setQuery}
          placeholder="พิมพ์ชื่อเขต/อำเภอ หรือชื่อร้าน"
          filterActive={filterDirty}
          onFilterClick={filterController.onTrue}
          map={map}
        />

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {Object.entries(commercialFilter.workingHour).map(([key, label]) => (
            <QuickChip
              key={key}
              label={label}
              selected={workingHour === key}
              onClick={() => setParam('workingHour', key)}
            />
          ))}
          <QuickChip
            label={commercialFilter.location.NEAR_ME}
            selected={location === 'NEAR_ME'}
            onClick={() => setParam('location', location === 'NEAR_ME' ? 'ANYWHERE' : 'NEAR_ME')}
          />
          <QuickChip label="ร้านใหม่แกะกล่อง" selected={onlyNew} onClick={() => setOnlyNew(!onlyNew)} />
          <QuickChip
            label="สั่งผ่านตามสั่งตามส่ง"
            selected={!!orderable}
            onClick={() => setParam('orderable', orderable ? '' : '1')}
          />
        </Stack>
      </Stack>

      <ResultsHeader label={`พบ ${items.length} ${CommercialCategory[category]}`} />

      <ResultList>
        {items.map((c) => (
          <ResultRow
            key={c._id}
            name={c.name}
            imageUrl={c.imageUrl}
            fallbackIcon={commercialIcon(c.category)}
            isNew={c.isNewlyOpened}
            badge={isOrderable(c) && <TamsangBadge />}
            subtitle={c.types?.map((t) => t.name).join(', ')}
            status={
              c.workingStatus && {
                label: CommercialWorkingStatus[c.workingStatus],
                tone: STATUS_TONE[c.workingStatus],
              }
            }
            meta={c.district && `เขต${c.district.districtName}`}
            onClick={() => select(c)}
            onHover={(hovering) => setHoveredId(hovering ? c._id : '')}
          />
        ))}
        {items.length === 0 && <EmptyResults onClear={clearFilter} />}
      </ResultList>

      <CommercialFilterDrawer controller={filterController} />
    </>
  );
}

// ----------------------------------------------------------------------

function CommercialDetailPanel({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: commercial } = useGetCommercial({ commercialId: id });

  return (
    <DetailPanel
      onBack={onBack}
      footer={
        <Button
          fullWidth
          component={Link}
          href={paths.shop(id)}
          endIcon={<Iconify icon="eva:arrow-forward-fill" width={20} />}
          sx={{
            height: 48,
            borderRadius: '9999px',
            border: 2,
            borderColor: 'primary.lighter',
            color: 'primary.dark',
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          ดูหน้าร้านแบบเต็ม
        </Button>
      }
    >
      {commercial && (
        <>
          <DetailHero
            imageUrl={commercial.imageUrl}
            moreImages={commercial.additionalImageUrl}
            fallbackIcon={commercialIcon(commercial.category)}
            badge={commercial.isNewlyOpened ? 'ร้านใหม่แกะกล่อง' : undefined}
          />

          <DetailTitle
            name={commercial.name}
            subtitle={CommercialCategory[commercial.category]}
            status={
              commercial.workingStatus && {
                label: CommercialWorkingStatus[commercial.workingStatus],
                tone: STATUS_TONE[commercial.workingStatus],
              }
            }
            types={commercial.types?.map((t) => t.name).join(', ')}
          />

          {/* keyed so FavoriteButton re-reads isFavorite when another commercial is picked */}
          <DetailActions key={commercial._id}>
            <CommercialActionButtons commercial={commercial} />
          </DetailActions>

          {commercial.address && (
            <DetailBlock icon="heroicons:map-pin">
              <DetailLine v={commercial.address} />
            </DetailBlock>
          )}

          {!!commercial.displayOpening?.length && (
            <DetailBlock icon="wi:time-9" title="เวลาทำการ">
              {commercial.displayOpening.map((opening) => (
                <DetailLine
                  key={opening.days}
                  k={opening.days}
                  v={opening.time.map((t) => `${t.open} - ${t.close}`).join(', ')}
                />
              ))}
            </DetailBlock>
          )}

          {commercial.phoneNumber && (
            <DetailBlock icon="ic:round-phone" title="เบอร์โทร">
              <DetailLine v={commercial.phoneNumber} />
            </DetailBlock>
          )}

          {commercial.moreInfo && (
            <DetailBlock icon="fluent:info-24-regular" title="ข้อมูลเพิ่มเติม">
              <DetailLine v={commercial.moreInfo} />
            </DetailBlock>
          )}

          {commercial.commercialOwner && (
            <DetailBlock icon="carbon:user" title="เจ้าของ">
              <DetailLine v={`คุณ${commercial.commercialOwner}`} />
            </DetailBlock>
          )}
        </>
      )}
    </DetailPanel>
  );
}
