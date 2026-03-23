'use client';

import type { ManagerItem } from '../../types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';

import ManagerTableRowDrawer from './manager-table-row-drawer';

// ----------------------------------------------------------------------

type Props = {
  row: ManagerItem;
  selected: boolean;
  onSelectRow: () => void;
};

export default function ManagerTableRow({ row, selected, onSelectRow }: Props) {
  const editDrawer = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Box onClick={editDrawer.onTrue} sx={{ cursor: 'pointer' }}>
              <Avatar alt={row.name} src={row.profileImageUrl} />
            </Box>

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box onClick={editDrawer.onTrue}>
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
                  {row?.name}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.roles.TEC}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (row.oauth?.provider === 'LINE' && 'success') ||
              (row.oauth?.provider === 'AUTHENTIK' && 'info') ||
              (row.oauth?.provider === 'FACEBOOK' && 'primary') ||
              'default'
            }
          >
            {row.oauth?.provider || '-'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.shortId}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.districts.map((d) => d.districtName).join(', ')}
        </TableCell>
      </TableRow>

      <ManagerTableRowDrawer manager={row} drawerController={editDrawer} />
    </>
  );
}
