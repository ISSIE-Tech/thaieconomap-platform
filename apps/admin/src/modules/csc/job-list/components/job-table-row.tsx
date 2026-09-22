import type { JobKind, JobPost } from '../../types';

import { Tooltip, TableRow, TableCell, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { JobActions } from './job-actions';
import { JobActioner } from './job-actioner';

type Props = {
  kind: JobKind;
  row: JobPost;
};

export function JobTableRow({ kind, row }: Props) {
  const { latitude, longitude } = row.location ?? {};

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{row.title}</TableCell>

      <TableCell>{row.category?.name ?? '-'}</TableCell>

      <TableCell>{row.status}</TableCell>

      <TableCell>{`${row.applicants?.number ?? '-'} ตำแหน่ง`}</TableCell>

      <TableCell>
        <IconButton
          component="a"
          target="_blank"
          rel="noopener"
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
        >
          <Iconify icon="logos:google-maps" />
        </IconButton>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{fDateTime(row.createdAt)}</Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{row.updatedAt ? fDateTime(row.updatedAt) : '-'}</Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <JobActioner actioner={row.createdBy} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <JobActioner actioner={row.lastModifiedBy} />
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        {kind === 'active' && (
          <Tooltip title="แก้ไข">
            <IconButton component={RouterLink} href={paths.csc.dashboard.jobs.edit(row._id)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="ดูรายละเอียด">
          <IconButton component={RouterLink} href={paths.csc.dashboard.jobs.view(kind, row._id)}>
            <Iconify icon="ic:baseline-remove-red-eye" />
          </IconButton>
        </Tooltip>

        <JobActions kind={kind} id={row._id} />
      </TableCell>
    </TableRow>
  );
}
