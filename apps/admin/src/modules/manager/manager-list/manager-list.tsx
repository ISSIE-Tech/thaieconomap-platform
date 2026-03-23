'use client';

import type { ManagerItem } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { useSetState } from 'src/hooks/use-set-state';

import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useGetManagers } from '../_hooks/use-get-manager';
import ManagerTableRow from './components/manager-table-row';
import ManagerTableToolbar from './components/manager-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'ชื่อ-นามสกุล' },
  { id: 'status', label: 'เบอร์โทร', width: 140 },
  { id: 'phoneNumber', label: 'สิทธิผู้ใช้', width: 180 },
  { id: 'oauth', label: 'ผู้ให้บริการ', width: 140 },
  { id: 'company', label: 'รหัสผู้ใช้่', width: 220 },
  { id: 'role', label: 'เขตที่รับผิดชอบ', width: 180 },
  { id: '', width: 88 },
];

const ROLES = ['MANAGER', 'ADMIN'];

export type ManagerTableFilters = {
  name: string;
  role: string[];
  districts: string[];
};

// ----------------------------------------------------------------------

export function ManagerList() {
  const table = useTable();

  const { data: tableData } = useGetManagers();

  const filters = useSetState<ManagerTableFilters>({ name: '', role: [], districts: [] });

  const dataFiltered: ManagerItem[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.name || filters.state.role.length > 0;

  const notFound = !dataFiltered.length && canReset;

  return (
    <Card>
      <ManagerTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        options={{ roles: ROLES, disticts: [] }}
      />

      <Box sx={{ position: 'relative' }}>
        {/* <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row._id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        /> */}

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                  <ManagerTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData?: ManagerItem[];
  filters: ManagerTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  if (!inputData) {
    return [];
  }

  const { role, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (role.length) {
    inputData = inputData.filter((item) => role.includes(item.roles.TEC));
  }

  return inputData;
}
