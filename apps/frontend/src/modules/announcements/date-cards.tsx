'use client';

import { useState } from 'react';
import { thaiMonths, dayOfWeekThai } from 'src/shared/components/constants/date';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';

import useGetToday from './_hooks/use-get-today';
import { useAnnouncementsFilter } from './_hooks/use-announcements-filter';

export default function DateCards() {
  const today = useGetToday();
  // Convert to Thai Buddhist year
  const thaiYear = today.getFullYear() + 543;

  const [selectedIndex, setSelectedIndex] = useState(0);
  // only the selected day is highlighted; earlier days used to stay tinted, which read as a stale selection
  const getTimePeriod = (index: number) => (index === selectedIndex ? 'present' : 'future');

  return (
    <>
      <Stack spacing={1} px={3} mt={{ xs: 20, md: 3 }}>
        <Typography>วันนี้</Typography>

        <Stack direction="row" spacing={1} alignItems="bottom">
          <Typography fontWeight="bold" fontSize={28}>
            {String(today.getDate()).padStart(2, '0')}
          </Typography>
          <Typography>{thaiMonths[today.getMonth()]}</Typography>
          <Typography>{thaiYear}</Typography>
        </Stack>
      </Stack>

      {/* mobile: scrolling row; desktop sidebar: 7 columns that always fit */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'grid' },
          gridTemplateColumns: { md: 'repeat(7, minmax(0, 1fr))' },
          gap: { xs: 1.5, md: 0.75 },
          px: 3,
          py: 2,
          overflowX: { xs: 'auto', md: 'visible' },
        }}
      >
        {[...Array(7)].map((_, i) => {
          const currentDate = new Date(today); // Copy today's date
          currentDate.setDate(today.getDate() + i); // Increment date by i days
          // plus 7 to avoid negative, minus to make 0 = Monday (1 = Monday for getDay())
          const dayOfWeekIndex = (today.getDay() - 1 + 7 + i) % 7;

          return (
            <DateCard
              key={i}
              datetime={currentDate}
              date={String(currentDate.getDate()).padStart(2, '0')}
              dayOfWeek={dayOfWeekThai[dayOfWeekIndex]}
              timePeriod={getTimePeriod(i)}
              onClick={() => setSelectedIndex(i)}
            />
          );
        })}
      </Box>
    </>
  );
}

// -------------------------------------------------------------

// Why don't date, dayOfWeek, and timePeriod just use from datetime?
// Ans: this is easier to use in case DateCard is used somewhere else

type DateCardProps = {
  datetime: Date;
  date: string;
  dayOfWeek: string;
  timePeriod: 'present' | 'future';
  onClick: () => void;
};

function DateCard({ datetime, date, dayOfWeek, timePeriod, onClick }: DateCardProps) {
  const cardBgColor = {
    present: (theme: Theme) => theme.palette.primary.main,
    future: 'white',
  };

  const dateColor = {
    present: 'white',
    future: 'black',
  };

  const dayOfWeekColor = {
    present: 'white',
    future: (theme: Theme) => theme.palette.grey['500'],
  };

  const { setAnnouncementsDate } = useAnnouncementsFilter();

  return (
    <Stack
      alignItems="center"
      borderRadius={2}
      bgcolor={cardBgColor[timePeriod]}
      spacing={0.25}
      sx={{
        flexShrink: 0,
        minWidth: { xs: 76, md: 0 },
        px: { xs: 1.5, md: 0.5 },
        py: { xs: 1.5, md: 1.25 },
        whiteSpace: 'nowrap',
        boxShadow: '0px 1px 10px 1px #4876D31A',
        cursor: 'pointer',
      }}
      onClick={() => {
        setAnnouncementsDate(datetime.toISOString());
        onClick();
      }}
    >
      <Typography fontWeight="bold" sx={{ color: dateColor[timePeriod] }}>
        {date}
      </Typography>
      <Typography
        fontSize={{ xs: 14, md: 12 }}
        lineHeight={1.6}
        sx={{ color: dayOfWeekColor[timePeriod] }}
      >
        {dayOfWeek}
      </Typography>
    </Stack>
  );
}
