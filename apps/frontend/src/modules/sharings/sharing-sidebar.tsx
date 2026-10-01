'use client';

import type { StatusTone } from 'src/shared/components/map-sidebar';

import { useState } from 'react';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { DATA_NAME_THAI } from 'src/shared/components/constants';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  inBounds,
  ResultRow,
  QuickChip,
  MapSidebar,
  DetailHero,
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

import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';

import useGetSharing from './_hooks/use-get-sharing';
import { SharingFilterDrawer } from './filter-drawer';
import { useSharingStore } from './_store/sharing.store';
import { SharingActionButtons } from './sharing-detail-drawer';
import useGetTinySharings from './_hooks/use-get-tiny-sharings';
import useGetAllTinySharings from './_hooks/use-get-all-tiny-sharings';
import {
  sharingFilter,
  SharingStatus,
  type StatusFilter,
  type LocationFilter,
  getIsSharingDefault,
} from './_types/sharing.type';

// ----------------------------------------------------------------------

const SHARING_ICON = 'mdi:gift';

const STATUS_TONE: Record<keyof typeof SharingStatus, StatusTone> = {
  OPEN: 'success',
  NEAR_FULL: 'warning',
  FULL: 'error',
};

const statusPill = (status?: keyof typeof SharingStatus) =>
  status && { label: SharingStatus[status], tone: STATUS_TONE[status] };

export function SharingSidebar() {
  const selectedId = useSharingStore((state) => state.selectedId);
  const setSelectedId = useSharingStore((state) => state.setSelectedId);

  return (
    <MapSidebar>
      {selectedId ? (
        <SharingDetailPanel id={selectedId} onBack={() => setSelectedId('')} />
      ) : (
        <SharingResults />
      )}
    </MapSidebar>
  );
}

// ----------------------------------------------------------------------

function SharingResults() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterController = useBoolean();

  const [query, setQuery] = useState('');
  // the tiny endpoint has no status param, so the status chips filter the loaded list
  const [status, setStatus] = useState<'' | StatusFilter>('');
  // mobile's "บอร์ดแบ่งสิ่งของ": every post, not only the ones inside the map
  const [showAll, setShowAll] = useState(false);

  const map = useSharingStore((state) => state.map);
  const setSelectedId = useSharingStore((state) => state.setSelectedId);
  const setHoveredId = useSharingStore((state) => state.setHoveredId);
  const bounds = useMapBounds(map);

  const { data } = useGetTinySharings();
  const { data: allData } = useGetAllTinySharings();

  const location = searchParams.get('location');
  const filterActive =
    !!status ||
    !getIsSharingDefault(
      searchParams.get('status') as StatusFilter,
      location as LocationFilter,
      searchParams.get('district')
    );

  const toggleNearMe = () => {
    const params = new URLSearchParams(searchParams);
    params.set('location', location === 'NEAR_ME' ? 'ANYWHERE' : 'NEAR_ME');
    params.delete('district');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const q = query.trim();
  const items = (showAll ? (allData ?? []) : inBounds(data ?? [], bounds, (s) => s.location.coordinates)).filter(
    (s) =>
      (!q || `${s.name}${s.district?.districtName ?? ''}`.includes(q)) &&
      (!status || s.status === status)
  );

  return (
    <>
      <Stack spacing={1.5} px={2.5} pt={2}>
        <SidebarSearch
          value={query}
          onChange={setQuery}
          placeholder="พิมพ์ชื่อเขต/อำเภอ หรือชื่อสิ่งของ"
          filterActive={filterActive}
          onFilterClick={filterController.onTrue}
          map={map}
        />

        <Stack direction="row" flexWrap="wrap" gap={1}>
          <QuickChip label="ทั้งหมด" selected={!status} onClick={() => setStatus('')} />
          {(['OPEN', 'NEAR_FULL'] as const).map((key) => (
            <QuickChip
              key={key}
              label={sharingFilter.status[key]}
              selected={status === key}
              onClick={() => setStatus(key)}
            />
          ))}
          <QuickChip
            label={sharingFilter.location.NEAR_ME}
            selected={location === 'NEAR_ME'}
            onClick={toggleNearMe}
          />
        </Stack>
      </Stack>

      <ResultsHeader
        label={`พบ ${items.length} ${DATA_NAME_THAI.SHARING}`}
        action={
          <ButtonBase onClick={() => setShowAll(!showAll)} sx={{ fontSize: 12, color: 'primary.main' }}>
            {showAll ? 'เฉพาะในพื้นที่แผนที่' : 'ดูประกาศทั้งหมด'}
          </ButtonBase>
        }
      />

      <ResultList>
        {items.map((s) => (
          <ResultRow
            key={s._id}
            name={s.name}
            imageUrl={s.imageUrl}
            fallbackIcon={SHARING_ICON}
            subtitle={s.types?.map((t) => t.name).join(', ')}
            status={statusPill(s.status)}
            meta={s.district && `เขต${s.district.districtName}`}
            onClick={() => {
              setHoveredId('');
              setSelectedId(s._id);
              map?.flyTo(s.location.coordinates, Math.max(map.getZoom(), 16));
            }}
            onHover={(hovering) => setHoveredId(hovering ? s._id : '')}
          />
        ))}
        {items.length === 0 && (
          <EmptyResults
            onClear={() => {
              setQuery('');
              setStatus('');
              router.replace(pathname);
            }}
          />
        )}
      </ResultList>

      <SharingFilterDrawer controller={filterController} />
    </>
  );
}

// ----------------------------------------------------------------------

function SharingDetailPanel({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: sharing } = useGetSharing({ sharingId: id });

  return (
    <DetailPanel onBack={onBack}>
      {sharing && (
        <>
          <DetailHero
            imageUrl={sharing.imageUrl}
            moreImages={sharing.additionalImageUrl}
            fallbackIcon={SHARING_ICON}
            badge={sharing.isFavorite ? 'รายการโปรด' : undefined}
          />

          <DetailTitle
            name={sharing.name}
            status={statusPill(sharing.status)}
            types={sharing.types?.map((t) => t.name).join(', ')}
          />

          {/* keyed so FavoriteButton re-reads isFavorite when another sharing is picked */}
          <DetailActions key={sharing._id}>
            <SharingActionButtons sharing={sharing} />
          </DetailActions>

          {sharing.address && (
            <DetailBlock icon="heroicons:map-pin">
              <DetailLine v={sharing.address} />
            </DetailBlock>
          )}

          {sharing.detail && (
            <DetailBlock icon="fluent:info-24-regular" title="ข้อมูลสิ่งของ">
              <DetailLine v={sharing.detail} />
            </DetailBlock>
          )}

          {sharing.amount && (
            <DetailBlock icon="mdi:package-variant-closed" title="จำนวน">
              <DetailLine v={`${sharing.amount.amount} ${sharing.amount.unit}`} />
            </DetailBlock>
          )}

          {sharing.condition?.name && (
            <DetailBlock icon="ph:sparkle" title="สภาพสิ่งของ">
              <DetailLine v={sharing.condition.name} />
            </DetailBlock>
          )}

          {sharing.contact?.name && (
            <DetailBlock icon="carbon:user" title="เจ้าของ">
              <DetailLine v={sharing.contact.name} />
            </DetailBlock>
          )}
        </>
      )}
    </DetailPanel>
  );
}
