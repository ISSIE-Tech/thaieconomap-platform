'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useUserLookup } from '../../_hooks/use-user-lookup';
import { useGetPumpuangs } from '../_hooks/use-get-pumpuangs';
import PumpuangTableRow from './components/pumpuang-table-row';
import PumpuangTableToolbar from './components/pumpuang-table-toolbar';
import PumpuangTableFiltersResult from './components/pumpuang-table-filters-result';
import { ECONOMAP_STATUS, ECONOMAP_STATUS_OPTIONS } from '../../_config/economap-status.config';

import type { PumpuangItem, PumpuangTableFilters } from '../type';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'owner', label: 'ชื่อ' },
  { id: 'types', label: 'ประเภท', width: 180 },
  { id: 'licensePlate', label: 'เลขทะเบียน', width: 180 },
  { id: 'createdAt', label: 'สร้างเมื่อ', width: 180 },
  { id: 'updatedAt', label: 'แก้ไขเมื่อ', width: 180 },
  { id: 'createdBy', label: 'สร้างโดย', width: 160 },
  { id: 'lastModifiedBy', label: 'แก้ไขโดย', width: 160 },
  { id: 'approvedBy', label: 'อนุมัติโดย', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function PumpuangList() {
  const table = useTable();

  const userLookup = useUserLookup();

  const pumpuangs = useGetPumpuangs();

  const filters = useSetState<PumpuangTableFilters>({
    owner: '',
    status: ECONOMAP_STATUS.APPROVED,
  });

  const dataFiltered: PumpuangItem[] = applyFilter({
    inputData: pumpuangs.data?.data,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.owner || filters.state.status !== ECONOMAP_STATUS.APPROVED;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: ECONOMAP_STATUS) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
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
                  ? pumpuangs.data?.data.filter((user) => user.submissionStatus === tab.value)
                      .length
                  : pumpuangs.data?.data.length}
              </Label>
            }
          />
        ))}
      </Tabs>

      <PumpuangTableToolbar filters={filters} onResetPage={table.onResetPage} />

      {canReset && (
        <PumpuangTableFiltersResult
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
                  <PumpuangTableRow
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
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData?: PumpuangItem[];
  filters: PumpuangTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, filters, comparator }: ApplyFilterProps) {
  if (!inputData) {
    return [];
  }

  const { owner, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (owner) {
    inputData = inputData.filter((item) => item.owner.toLowerCase().includes(owner.toLowerCase()));
  }

  if (status) {
    inputData = inputData.filter((item) => item.submissionStatus === status);
  }

  return inputData;
}
