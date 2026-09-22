'use client';

import type { JobKind } from '../types';

import { useMemo, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import { Card, Table, Stack, MenuItem, TableBody, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useGetJobs } from '../_hooks/use-csc-jobs';
import { QueryAlert } from '../_components/query-alert';
import { JobTableRow } from './components/job-table-row';
import { useGetJobCategories } from '../_hooks/use-csc-options';

const TABLE_HEAD = [
  { id: 'title', label: 'ชื่องาน' },
  { id: 'category', label: 'ประเภท', width: 180 },
  { id: 'status', label: 'สถานะ', width: 140 },
  { id: 'applicants', label: 'จำนวนที่รับ', width: 140 },
  { id: 'location', label: 'ที่ทำงาน', width: 100 },
  { id: 'createdAt', label: 'สร้างเมื่อ', width: 160 },
  { id: 'updatedAt', label: 'แก้ไขเมื่อ', width: 160 },
  { id: 'createdBy', label: 'สร้างโดย', width: 160 },
  { id: 'lastModifiedBy', label: 'แก้ไขโดย', width: 160 },
  { id: '', width: 180 },
];

const HEADING: Record<JobKind, string> = {
  active: 'งานทั้งหมด',
  pending: 'งานรออนุมัติ',
  deleted: 'งานที่ถูกลบ',
};

type Props = {
  kind: JobKind;
};

export function JobList({ kind }: Props) {
  const table = useTable();
  const { data: jobs = [], isLoading, error } = useGetJobs(kind);
  const { data: categories = [] } = useGetJobCategories();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(name.toLowerCase()) &&
          (category === 'all' || job.category?._id === category)
      ),
    [jobs, name, category]
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={HEADING[kind]}
        links={[{ name: 'งาน', href: paths.csc.dashboard.jobs.root }, { name: HEADING[kind] }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QueryAlert error={error} />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2.5 }}>
          <TextField
            select
            label="ประเภท"
            value={category}
            onChange={(event) => {
              table.onResetPage();
              setCategory(event.target.value);
            }}
            sx={{ width: { xs: 1, md: 240 } }}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {categories.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            value={name}
            placeholder="ค้นหาชื่องาน..."
            onChange={(event) => {
              table.onResetPage();
              setName(event.target.value);
            }}
          />
        </Stack>

        <Scrollbar>
          <Table sx={{ minWidth: 1400 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {filtered
                .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                .map((row) => (
                  <JobTableRow key={row._id} kind={kind} row={row} />
                ))}

              <TableNoData notFound={!isLoading && !filtered.length} />
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={filtered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
