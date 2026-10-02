'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useGetCscJobs, useSetCscJobHidden } from './csc-jobs.service';

// ----------------------------------------------------------------------

const JOB_HEAD = [
  { id: 'visible', label: 'แสดงบนแผนที่', width: 120 },
  { id: 'title', label: 'ชื่องาน' },
  { id: 'category', label: 'ประเภทงาน', width: 200 },
  { id: 'location', label: 'พิกัด', width: 220 },
];

// ----------------------------------------------------------------------

export default function CscJobsList() {
  const table = useTable({ defaultRowsPerPage: 20 });

  const [search, setSearch] = useState('');

  const jobs = useGetCscJobs({
    search: search || undefined,
    page: String(table.page + 1),
    limit: String(table.rowsPerPage),
  });

  const setHidden = useSetCscJobHidden();

  const handleToggleHidden = (id: string, hidden: boolean) =>
    setHidden.mutate(
      { id, hidden },
      {
        onSuccess: () => toast.success(hidden ? 'ซ่อนงานแล้ว' : 'แสดงงานแล้ว'),
        onError: () => toast.error('บันทึกไม่สำเร็จ'),
      }
    );

  return (
    <Card>
      <CardHeader title="งานจากเชี่ยวแชร์" subheader={`ทั้งหมด ${jobs.data?.total ?? 0} งาน`} />

      <Stack sx={{ p: 2.5 }}>
        <TextField
          label="ค้นหาชื่องาน"
          value={search}
          onChange={(event) => {
            table.onResetPage();
            setSearch(event.target.value);
          }}
          size="small"
          sx={{ maxWidth: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Scrollbar>
        <Table size="medium" sx={{ minWidth: 800 }}>
          <TableHeadCustom headLabel={JOB_HEAD} />

          <TableBody>
            {jobs.data?.data.map((row) => {
              const [lng, lat] = row.mark.location?.coordinates ?? [];

              return (
                <TableRow key={row._id} sx={{ opacity: row.hidden ? 0.5 : 1 }}>
                  <TableCell>
                    <Switch
                      checked={!row.hidden}
                      disabled={setHidden.isPending && setHidden.variables?.id === row._id}
                      onChange={(event) => handleToggleHidden(row._id, !event.target.checked)}
                      inputProps={{ 'aria-label': `แสดง ${row.mark.title} บนแผนที่` }}
                    />
                  </TableCell>

                  <TableCell>{row.mark.title}</TableCell>

                  <TableCell>{row.mark.category?.name ?? '-'}</TableCell>

                  <TableCell>
                    {lat != null && lng != null ? (
                      <Link
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener"
                      >
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {!jobs.data?.data.length && (
              <TableRow>
                <TableCell colSpan={JOB_HEAD.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ไม่พบงาน
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        count={jobs.data?.total ?? 0}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
