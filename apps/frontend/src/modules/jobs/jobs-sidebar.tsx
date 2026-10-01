'use client';

import { useMemo, useState } from 'react';
import { fDate } from 'src/shared/utils/format-time';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { createTypeNameMap } from 'src/shared/utils/url-filter';
import { DATA_NAME_THAI } from 'src/shared/components/constants';
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

import useGetJob from './_hooks/use-get-job';
import { JobsFilterDrawer } from './filter-drawer';
import { useJobsStore } from './_store/jobs.store';
import useGetTinyJobs from './_hooks/use-get-tiny-jobs';
import { JobActionButtons } from './jobs-detail-drawer';
import { ThaiJobAcceptanceStatus } from './_types/jobs.type';
import useGetJobCategories from './_hooks/use-get-job-categories';

// ----------------------------------------------------------------------

const JOB_ICON = 'fluent:briefcase-12-filled';

// chial-share stores image urls without a scheme
const withScheme = (url?: string) => (url && !url.startsWith('http') ? `https://${url}` : url);

export function JobsSidebar() {
  const selectedId = useJobsStore((state) => state.selectedId);
  const { setSelectedId } = useJobsStore((state) => state.actions);

  return (
    <MapSidebar>
      {selectedId ? <JobDetailPanel id={selectedId} onBack={() => setSelectedId('')} /> : <JobResults />}
    </MapSidebar>
  );
}

// ----------------------------------------------------------------------

function JobResults() {
  const filterController = useBoolean();
  const [query, setQuery] = useState('');

  const map = useJobsStore((state) => state.map);
  const category = useJobsStore((state) => state.category);
  const { setCategory, setSelectedId, setHoveredId } = useJobsStore((state) => state.actions);
  const bounds = useMapBounds(map);

  const { data } = useGetTinyJobs();
  const { data: categories } = useGetJobCategories();
  const categoryNames = useMemo(() => createTypeNameMap(categories ?? []), [categories]);

  const q = query.trim();
  const items = inBounds(data ?? [], bounds, (j) => j.location.coordinates).filter(
    (j) => !q || j.title.includes(q)
  );

  // ponytail: the map-mark list has no acceptance status, so quick chips filter by category instead of "เปิดรับสมัคร"
  return (
    <>
      <Stack spacing={1.5} px={2.5} pt={2}>
        <SidebarSearch
          value={query}
          onChange={setQuery}
          placeholder="พิมพ์ชื่องาน"
          filterActive={!!category}
          onFilterClick={filterController.onTrue}
          map={map}
        />

        <Stack direction="row" flexWrap="wrap" gap={1}>
          <QuickChip label="ทั้งหมด" selected={!category} onClick={() => setCategory('')} />
          {categories?.map((c) => (
            <QuickChip
              key={c._id}
              label={c.name}
              selected={category === c._id}
              onClick={() => setCategory(c._id)}
            />
          ))}
        </Stack>
      </Stack>

      <ResultsHeader label={`พบ ${items.length} ${DATA_NAME_THAI.JOB}`} />

      <ResultList>
        {items.map((j) => (
          <ResultRow
            key={j._id}
            name={j.title}
            imageUrl={withScheme(j.imageUrl)}
            fallbackIcon={JOB_ICON}
            subtitle={categoryNames[j.category]}
            onClick={() => {
              setHoveredId('');
              setSelectedId(j._id);
              map?.flyTo(j.location.coordinates, Math.max(map.getZoom(), 16));
            }}
            onHover={(hovering) => setHoveredId(hovering ? j._id : '')}
          />
        ))}
        {items.length === 0 && (
          <EmptyResults
            onClear={() => {
              setQuery('');
              setCategory('');
            }}
          />
        )}
      </ResultList>

      <JobsFilterDrawer controller={filterController} />
    </>
  );
}

// ----------------------------------------------------------------------

function JobDetailPanel({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: job } = useGetJob({ jobId: id });

  return (
    <DetailPanel onBack={onBack}>
      {job && (
        <>
          <DetailHero
            imageUrl={withScheme(job.imageUrls?.[0])}
            moreImages={job.imageUrls?.slice(1).map((url) => withScheme(url) ?? '')}
            fallbackIcon={JOB_ICON}
            badge="เปิดหลายตำแหน่ง"
          />

          <DetailTitle
            name={job.title}
            subtitle={job.category?.name}
            status={
              job.acceptanceStatus && {
                label: ThaiJobAcceptanceStatus[job.acceptanceStatus],
                tone: job.acceptanceStatus === 'AVAILABLE' ? 'success' : 'error',
              }
            }
          />

          <DetailActions key={job._id}>
            <JobActionButtons job={job} />
          </DetailActions>

          {job.location?.address?.name && (
            <DetailBlock icon="heroicons:map-pin">
              <DetailLine v={job.location.address.name} />
            </DetailBlock>
          )}

          {job.workload && (
            <DetailBlock icon="fluent:task-list-ltr-24-regular" title="ภาระงาน">
              <DetailLine v={job.workload} />
            </DetailBlock>
          )}

          {job.qualification && (
            <DetailBlock icon="ph:medal" title="ความชำนาญ">
              <DetailLine v={job.qualification} />
            </DetailBlock>
          )}

          <DetailBlock icon="ph:money" title="การว่าจ้าง">
            {job.wage && <DetailLine k="ค่าตอบแทน" v={`${job.wage.amount} บาท${job.wage.unit}`} />}
            {job.startDate && (
              <DetailLine k="ระยะเวลา" v={`${fDate(job.startDate)} - ${fDate(job.endDate)}`} />
            )}
          </DetailBlock>

          {job.createdBy?.name && (
            <DetailBlock icon="carbon:user" title="ผู้ประกาศ">
              <DetailLine v={`คุณ${job.createdBy.name}`} />
            </DetailBlock>
          )}
        </>
      )}
    </DetailPanel>
  );
}
