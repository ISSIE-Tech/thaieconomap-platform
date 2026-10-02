'use client';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { useMemo, useState, useEffect } from 'react';
import { Iconify } from 'src/shared/components/iconify';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { fDateRangeShortLabel } from 'src/shared/utils/format-time';
import { useDistrictOptionMap } from 'src/shared/hooks/use-get-districts';
import { replaceShortMonthToThai } from 'src/shared/components/constants/date';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import AnnouncementDetailDrawer from './annoucement-detail-drawer';
import { ANNOUNCEMENTS_FILTER_TYPES } from './_constants/location';
import useGetTinyAnnouncements from './_hooks/use-get-tiny-announcements';
import { useAnnouncementsFilter } from './_hooks/use-announcements-filter';
import { useProvinceOptionMap } from '../commercials/_hooks/use-get-provinces';

type Props = {
  // desktop: selection drives the detail pane instead of the drawer
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export default function AnnouncementsList({ selectedId, onSelect }: Props) {
  const { data: announcements, isLoading } = useGetTinyAnnouncements();

  // desktop: keep a valid selection, defaulting to the first announcement
  useEffect(() => {
    if (!onSelect || !announcements?.length) return;
    if (!announcements.some((a) => a._id === selectedId)) onSelect(announcements[0]._id);
  }, [announcements, onSelect, selectedId]);

  // ===== Get the right province/district to show =====
  const { announcementsLocation, locationType } = useAnnouncementsFilter();
  const { districtOptionMap } = useDistrictOptionMap();
  const { provinceIdOptionMap } = useProvinceOptionMap();

  const locationTitle = useMemo(() => {
    if (!announcementsLocation) return 'ทั่วประเทศ';

    if (locationType === ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID) {
      return `จังหวัด${provinceIdOptionMap?.[announcementsLocation].provinceName}`;
    }

    return districtOptionMap?.[announcementsLocation]?.label;
  }, [announcementsLocation, districtOptionMap, locationType, provinceIdOptionMap]);

  const drawer = useBoolean();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');
  const createAnnouncementClickedHandler = (id: string) => () => {
    if (onSelect) {
      onSelect(id);
      return;
    }
    setSelectedAnnouncementId(id);
    drawer.onTrue();
  };

  return (
    <Stack
      spacing={1}
      flexGrow={1}
      minHeight={0}
      overflow="hidden"
      bgcolor="white"
      sx={{
        // desktop sits inside the sidebar, which has its own frame
        boxShadow: onSelect ? 'none' : '0px 1px 10px 1px #4876D31A',
        borderTop: onSelect ? '1px solid #EFF1F3' : 'none',
      }}
    >
      <Typography variant="body1" fontWeight="bold" mt={onSelect ? 2.5 : 4} px={3}>
        ประกาศ{locationTitle}
      </Typography>

      {/* padding lives inside the scroller so its scrollbar hugs the sidebar edge */}
      <Stack
        divider={<Divider />}
        flexGrow={1}
        minHeight={0}
        px={3}
        pb={2}
        sx={{ overflowY: 'auto', overflowX: 'hidden' }}
      >
        {announcements?.map((announcement) => (
          <Announcement
            key={announcement._id}
            name={announcement.name}
            startAt={announcement.startAt}
            endAt={announcement.endAt}
            onClick={createAnnouncementClickedHandler(announcement._id)}
            selected={announcement._id === selectedId}
          />
        ))}

        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => <AnnouncementSkeleton key={index} />)}

        {announcements && announcements.length === 0 && <NotFound />}
      </Stack>

      {!onSelect && <AnnouncementDetailDrawer controller={drawer} id={selectedAnnouncementId} />}
    </Stack>
  );
}

// ----------------------------------------------------------------------

type AnnouncementProp = {
  name: string;
  startAt: string;
  endAt: string;
  onClick: () => void;
  selected?: boolean;
};

function Announcement({ name, startAt, endAt, onClick, selected }: AnnouncementProp) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      py={2}
      width="100%"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        ...(selected && {
          bgcolor: '#F5FBFF',
          mx: -1.5,
          px: 1.5,
          width: 'auto',
          borderRadius: 1.5,
        }),
      }}
    >
      <Image
        src="/assets/icons/announcements-provinces/bangkok.svg"
        alt="shared object"
        sx={{ objectFit: 'cover', minWidth: '32px', width: '32px', borderRadius: '4px' }}
      />

      <Stack width="50%" flexGrow={1}>
        <Typography fontWeight={500}>{name}</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography
            variant="body2"
            color={theme.palette.grey['500']}
            maxWidth="50%"
            sx={maxLine({ line: 1 })}
          >
            {replaceShortMonthToThai(fDateRangeShortLabel(startAt, endAt))}
          </Typography>
        </Stack>
      </Stack>

      <Iconify icon="material-symbols-light:arrow-forward-ios" width={24} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

function AnnouncementSkeleton() {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={2} py={2} width="100%">
      {/* Placeholder for the image */}
      <Skeleton
        variant="rectangular"
        width={32}
        height={32}
        sx={{ borderRadius: '4px', bgcolor: theme.palette.grey[200] }}
      />

      <Stack width="50%" flexGrow={1}>
        {/* Placeholder for the announcement name */}
        <Skeleton width="60%" height={20} sx={{ bgcolor: theme.palette.grey[200] }} />

        <Stack direction="row" spacing={0.5} mt={1}>
          {/* Placeholder for the date range */}
          <Skeleton width="80%" height={16} sx={{ bgcolor: theme.palette.grey[200] }} />
        </Stack>
      </Stack>

      {/* Placeholder for the arrow icon */}
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        sx={{ bgcolor: theme.palette.grey[300] }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

// TODO: please for the love of god put NotFound in shared
function NotFound() {
  return (
    <Stack alignItems="center" spacing={1} m="auto">
      <Image
        src="/assets/illustrations/not-found.svg"
        alt="search not found illustrations"
        width="216"
        height="216"
      />
      <Typography variant="body1" fontWeight="bold">
        ไม่มีประกาศในขณะนี้
      </Typography>
    </Stack>
  );
}
