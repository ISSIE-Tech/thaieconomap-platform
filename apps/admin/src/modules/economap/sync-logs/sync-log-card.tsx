'use client';

import type { ReactNode } from 'react';
import type { SyncSource, SyncLogEntry } from './sync-logs.service';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fDateTime } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useSync, useGetSyncLogs } from './sync-logs.service';

// ----------------------------------------------------------------------

export type SyncCountColumn = {
  id: string;
  label: string;
  width?: number;
  render: (row: SyncLogEntry) => ReactNode;
};

type Props = {
  source: SyncSource;
  subheader: string;
  // what the sync saved, which differs per source
  countColumns: SyncCountColumn[];
  // query keys of lists the sync refreshes
  invalidateKeys?: string[];
  successMessage: string;
  errorMessage: string;
};

export function SyncLogCard({
  source,
  subheader,
  countColumns,
  invalidateKeys,
  successMessage,
  errorMessage,
}: Props) {
  const table = useTable({ defaultRowsPerPage: 5 });

  const syncLogs = useGetSyncLogs(source, {
    page: String(table.page + 1),
    limit: String(table.rowsPerPage),
  });

  const sync = useSync(source, invalidateKeys);

  const head = [
    { id: 'createdAt', label: 'เวลา', width: 180 },
    { id: 'trigger', label: 'สั่งโดย', width: 180 },
    { id: 'status', label: 'สถานะ', width: 100 },
    ...countColumns.map(({ id, label, width }) => ({ id, label, width })),
    { id: 'durationMs', label: 'ใช้เวลา', width: 100 },
    { id: 'errorMessage', label: 'ข้อผิดพลาด' },
  ];

  const handleSync = () =>
    sync.mutate(undefined, {
      onSuccess: () => toast.success(successMessage),
      onError: () => toast.error(errorMessage),
    });

  return (
    <Card>
      <CardHeader
        title="ประวัติการดึงข้อมูล"
        subheader={subheader}
        action={
          <LoadingButton
            variant="contained"
            loading={sync.isPending}
            onClick={handleSync}
            startIcon={<Iconify icon="solar:refresh-bold" />}
          >
            ดึงข้อมูลใหม่
          </LoadingButton>
        }
        sx={{ mb: 2 }}
      />

      <Scrollbar>
        <Table size="small" sx={{ minWidth: 960 }}>
          <TableHeadCustom headLabel={head} />

          <TableBody>
            {syncLogs.data?.data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{fDateTime(row.createdAt)}</TableCell>

                <TableCell>
                  {row.trigger === 'cron' ? 'อัตโนมัติ' : (row.triggeredBy ?? 'ผู้ดูแล')}
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว'}
                    color={row.status === 'success' ? 'success' : 'error'}
                    size="small"
                    variant="soft"
                  />
                </TableCell>

                {countColumns.map((column) => (
                  <TableCell key={column.id}>{column.render(row)}</TableCell>
                ))}

                <TableCell>{(row.durationMs / 1000).toFixed(1)} วิ</TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    noWrap
                    title={row.errorMessage ?? undefined}
                    sx={{ maxWidth: 300, color: 'error.main' }}
                  >
                    {row.errorMessage ?? '-'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {!syncLogs.data?.data.length && (
              <TableRow>
                <TableCell colSpan={head.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ยังไม่มีประวัติการดึงข้อมูล
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        count={syncLogs.data?.total ?? 0}
        rowsPerPage={table.rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
