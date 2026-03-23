'use client';

import type { SocialSharingItem } from '../types';
import type { SocialSharingTableFilters } from './types';

import React, { useCallback } from 'react';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useUserLookup } from '../../_hooks/use-user-lookup';
import { useGetSocialSharings } from '../_hooks/use-get-social-sharings';
import SocialSharingTableRow from './components/social-sharing-table-row';
import SocialSharingTableToolbar from './components/social-sharing-table-toolbar';
import SocialSharingTableFiltersResult from './components/social-sharing-table-filters-result';
import { ECONOMAP_STATUS, ECONOMAP_STATUS_OPTIONS } from '../../_config/economap-status.config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'ชื่อ' },
  { id: 'phoneNumber', label: 'เบอร์โทร', width: 180 },
  { id: 'category', label: 'ประเภท', width: 180 },
  { id: 'createdAt', label: 'สร้างเมื่อ', width: 180 },
  { id: 'updatedAt', label: 'แก้ไขเมื่อ', width: 180 },
  { id: 'createdBy', label: 'สร้างโดย', width: 160 },
  { id: 'lastModifiedBy', label: 'แก้ไขโดย', width: 160 },
  { id: 'approvedBy', label: 'อนุมัติโดย', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function SocialSharingList() {
  const table = useTable();

  const userLookup = useUserLookup();

  const { data: tableData } = useGetSocialSharings();

  const socialSharings = tableData || [];

  const filters = useSetState<SocialSharingTableFilters>({
    name: '',
    status: ECONOMAP_STATUS.APPROVED,
  });

  const dataFiltered = applyFilter({
    inputData: socialSharings,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: ECONOMAP_STATUS) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const canReset = !!filters.state.name || filters.state.status !== ECONOMAP_STATUS.APPROVED;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="รายการช่วยเหลือแบ่งปัน"
        links={[
          { name: 'ช่วยเหลือแบ่งปัน', href: paths['social-sharing'].dashboard.root },
          { name: 'รายการ' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {ECONOMAP_STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  color={
                    (tab.value === ECONOMAP_STATUS.APPROVED && 'success') ||
                    (tab.value === ECONOMAP_STATUS.PENDING && 'warning') ||
                    (tab.value === ECONOMAP_STATUS.REJECTED && 'error') ||
                    'default'
                  }
                >
                  {Object.values(ECONOMAP_STATUS).includes(tab.value)
                    ? socialSharings.filter((user) => user.submissionStatus === tab.value).length
                    : socialSharings.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <SocialSharingTableToolbar filters={filters} onResetPage={table.onResetPage} />

        {canReset && (
          <SocialSharingTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row._id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <SocialSharingTableRow
                      key={row._id}
                      row={row}
                      userLookup={userLookup}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData?: SocialSharingItem[];
  filters: SocialSharingTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, filters, comparator }: ApplyFilterProps) {
  if (!inputData) {
    return [];
  }

  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status) {
    inputData = inputData.filter((item) => item.submissionStatus === status);
  }

  return inputData;
}
