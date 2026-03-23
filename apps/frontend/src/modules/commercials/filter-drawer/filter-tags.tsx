import type { Theme } from 'src/theme/types';
import type { LocationFilter, WorkingHourFilter } from '../_types/commercials.type';

import { usePathname } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  pumpuangFilter,
  type PumpuangWorkingHourFilter,
} from 'src/modules/pumpuangs/_types/pumpuangs.type';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { commercialFilter } from '../_types/commercials.type';

export const selectedFilterStyle = {
  flexShrink: 0,
  borderRadius: '9999px',
  bgcolor: (theme: Theme) => theme.palette.primary.light,
  color: 'white',
};

export const filterStyle = {
  flexShrink: 0,
  borderRadius: '9999px',
  border: `1px solid ${(theme: Theme) => theme.palette.primary.lighter}`,
  fontWeight: 'medium',
};

type WorkingHourTagsProps = {
  workingHour: WorkingHourFilter | PumpuangWorkingHourFilter;
  setWorkingHour: (workingHour: WorkingHourFilter | PumpuangWorkingHourFilter) => void;
  isPumpuang?: boolean;
};

export function WorkingHourTags({ workingHour, setWorkingHour, isPumpuang }: WorkingHourTagsProps) {
  const filterTags = isPumpuang ? pumpuangFilter.workingHour : commercialFilter.workingHour;

  return (
    <>
      <Typography fontWeight="bold">เวลาทำการ</Typography>

      <Stack direction="row" spacing={2}>
        {Object.entries(filterTags).map(([key, value]) => (
          <Button
            key={key}
            variant={workingHour === key ? 'contained' : 'outlined'}
            sx={workingHour === key ? selectedFilterStyle : filterStyle}
            onClick={() => setWorkingHour(key as WorkingHourFilter)}
          >
            {value}
          </Button>
        ))}
      </Stack>

      <Divider />
    </>
  );
}

// ----------------------------------------------------------------------

type LocationTagsProps = {
  location: LocationFilter;
  setLocation: (location: LocationFilter) => void;
};

export function LocationTags({ location, setLocation }: LocationTagsProps) {
  return (
    <>
      <Typography fontWeight="bold">ตำแหน่ง</Typography>

      <Stack direction="row" spacing={2}>
        {Object.entries(commercialFilter.location).map(([key, value]) => (
          <Button
            key={key}
            variant={location === key ? 'contained' : 'outlined'}
            sx={location === key ? selectedFilterStyle : filterStyle}
            onClick={() => setLocation(key as LocationFilter)}
          >
            {value}
          </Button>
        ))}
      </Stack>

      <Divider />
    </>
  );
}

// ----------------------------------------------------------------------

// TODO: refactor commercial filter to use this
type TypeTagsProps = {
  types: Record<string, boolean> | null;
  setTypes: Dispatch<SetStateAction<Record<string, boolean> | null>>;
  typeNames: Record<string, string> | null;
};

export function TypeTags({ types, setTypes, typeNames }: TypeTagsProps) {
  const pathname = usePathname();

  const title = useMemo(() => {
    switch (pathname) {
      case paths.commercials.restaurants:
        return 'ประเภทร้านอาหาร';
      case paths.commercials.businesses:
        return 'ประเภทธุรกิจ';
      default:
        return 'ประเภทรถพุ่มพวง';
    }
  }, [pathname]);

  return (
    <>
      <Typography fontWeight="bold">{title}</Typography>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', overflowX: 'hidden' }}>
        {types &&
          Object.entries(types).map(([_id, selected]) => (
            <Button
              key={_id}
              variant={selected ? 'contained' : 'outlined'}
              sx={selected ? selectedFilterStyle : filterStyle}
              // When that type is clicked, toggle it's truth value
              onClick={() =>
                setTypes((prev) => ({
                  ...prev,
                  [_id]: prev ? !prev[_id] : false,
                }))
              }
            >
              {typeNames && typeNames[_id]}
            </Button>
          ))}
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

type TagsSectionProps = {
  title: string;
  filter: Record<string, string>;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
};

export function TagsSection({ title, filter, selectedTag, setSelectedTag }: TagsSectionProps) {
  return (
    <>
      <Typography fontWeight="bold">{title}</Typography>

      <Stack direction="row" spacing={2}>
        {Object.entries(filter).map(([key, value]) => (
          <Button
            key={key}
            variant={selectedTag === key ? 'contained' : 'outlined'}
            sx={selectedTag === key ? selectedFilterStyle : filterStyle}
            onClick={() => setSelectedTag(key)}
          >
            {value}
          </Button>
        ))}
      </Stack>
    </>
  );
}
