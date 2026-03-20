'use client';

import React from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useGetAnnouncements } from '../_hooks/use-get-announcements';
import AnnouncementsTableRow from './components/announcements-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'ชื่อ' },
  { id: 'annoucer', label: 'ผู้ประกาศ', width: 180 },
  { id: 'startAt', label: 'วันที่เริ่ม', width: 180 },
  { id: 'endAt', label: 'วันที่สิ้นสุด', width: 180 },
  { id: 'status', label: 'สถานะ', width: 180 },
];

export function AnnouncementsList() {
  const table = useTable();
  const { data: announcements } = useGetAnnouncements();

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="รายการประกาศ"
        links={[{ name: 'ประกาศ', href: paths.announcements.dashboard.root }, { name: 'รายการ' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {announcements && (
        <Card>
          <Box>
            <Table>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={announcements.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    announcements.map((row) => row._id)
                  )
                }
              />

              <TableBody>
                {announcements
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AnnouncementsTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={announcements.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </DashboardContent>
  );
}
