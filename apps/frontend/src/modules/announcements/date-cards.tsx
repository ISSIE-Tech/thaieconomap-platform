'use client';

import { useState } from 'react';
import { thaiMonths, dayOfWeekThai } from 'src/shared/components/constants/date';

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
  const getTimePeriod = (index: number) => {
    if (index < selectedIndex) return 'past';
    if (index === selectedIndex) return 'present';
    return 'future';
  };

  return (
    <>
      <Stack spacing={1} px={3} mt={20}>
        <Typography>วันนี้</Typography>

        <Stack direction="row" spacing={1} alignItems="bottom">
          <Typography fontWeight="bold" fontSize={28}>
            {String(today.getDate()).padStart(2, '0')}
          </Typography>
          <Typography>{thaiMonths[today.getMonth()]}</Typography>
          <Typography>{thaiYear}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" px={3} py={2} spacing={1} sx={{ overflowY: 'scroll' }}>
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
      </Stack>
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
  timePeriod: 'past' | 'present' | 'future';
  onClick: () => void;
};

function DateCard({ datetime, date, dayOfWeek, timePeriod, onClick }: DateCardProps) {
  const cardBgColor = {
    past: (theme: Theme) => theme.palette.primary.lighter,
    present: (theme: Theme) => theme.palette.primary.main,
    future: 'white',
  };

  const dateColor = {
    past: 'black',
    present: 'white',
    future: 'black',
  };

  const dayOfWeekColor = {
    past: (theme: Theme) => theme.palette.grey['600'],
    present: 'white',
    future: (theme: Theme) => theme.palette.grey['500'],
  };

  const { setAnnouncementsDate } = useAnnouncementsFilter();

  return (
    <Stack
      alignItems="center"
      borderRadius={2}
      bgcolor={cardBgColor[timePeriod]}
      py={1}
      minWidth={64}
      sx={{
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
      <Typography sx={{ color: dayOfWeekColor[timePeriod] }}>{dayOfWeek}</Typography>
    </Stack>
  );
}
