import React from 'react';

import { Box, Stack, Checkbox, TableRow, TableCell, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label/label';

import { AnnouncementsTableRowDrawer } from './announcements-table-row-drawer';
import { ANNOUNCEMENT_STATUS, ANNOUNCEMENT_STATUS_TRANSLATIONS } from '../../types';

import type { AnnouncementItem } from '../../types';

type Props = {
  row: AnnouncementItem;
  selected: boolean;
  onSelectRow: () => void;
};

const AnnouncementsTableRow = ({ row, selected, onSelectRow }: Props) => {
  const drawerController = useBoolean();
  const startDate = new Date(row.startAt);
  const endDate = new Date(row.endAt);

  const statusStyle = () => {
    switch (ANNOUNCEMENT_STATUS[row.status]) {
      case ANNOUNCEMENT_STATUS.ANNOUNCED:
        return 'success';
      case ANNOUNCEMENT_STATUS.PENDING:
        return 'warning';
      case ANNOUNCEMENT_STATUS.EXPIRED:
        return 'error';
      default:
        return 'info';
    }
  };
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2' }}>
              <Box onClick={drawerController.onTrue}>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {row.name}
                </Typography>

                <Typography variant="caption">
                  {row.districts.map((district) => `${district.districtName} `)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.announcer}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{startDate.toLocaleDateString('en-GB')}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{endDate.toLocaleDateString('en-GB')}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label variant="soft" color={statusStyle()}>
            {ANNOUNCEMENT_STATUS_TRANSLATIONS[row.status]}
          </Label>
        </TableCell>
      </TableRow>

      <AnnouncementsTableRowDrawer drawerController={drawerController} row={row} />
    </>
  );
};

export default AnnouncementsTableRow;
