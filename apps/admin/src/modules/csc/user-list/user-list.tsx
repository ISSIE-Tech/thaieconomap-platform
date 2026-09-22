'use client';

import type { CscUser, CscUserRole } from '../types';

import { useMemo, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import {
  Card,
  Table,
  Stack,
  Avatar,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { CSC_ROLE_TRANSLATIONS } from '../types';
import { QueryAlert } from '../_components/query-alert';
import { useGetCscUsers } from '../_hooks/use-csc-users';
import { UserEditDialog } from './components/user-edit-dialog';

const TABLE_HEAD = [
  { id: 'name', label: 'ชื่อ - นามสกุล' },
  { id: 'role', label: 'สิทธิผู้ใช้', width: 160 },
  { id: 'shortId', label: 'หมายเลข', width: 140 },
  { id: 'districts', label: 'เขตรับผิดชอบ' },
  { id: '', width: 80 },
];

const ROLE_ORDER: CscUserRole[] = ['ADMIN', 'MANAGER', 'CUSTOMER'];

export function UserList() {
  const table = useTable();
  const { data: users = [], isLoading, error } = useGetCscUsers();

  const [name, setName] = useState('');
  const [role, setRole] = useState('all');
  const [editing, setEditing] = useState<CscUser | null>(null);

  const filtered = useMemo(
    () =>
      users
        .filter(
          (user) =>
            (role === 'all' || user.role === role) &&
            `${user.name} ${user.shortId}`.toLowerCase().includes(name.toLowerCase())
        )
        .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)),
    [users, name, role]
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs heading="รายชื่อผู้ใช้งาน" links={[{ name: 'ผู้ดูแลระบบ' }, { name: 'ผู้ใช้งาน' }]} sx={{ mb: { xs: 3, md: 5 } }} />

      <QueryAlert error={error} />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2.5 }}>
          <TextField
            select
            label="สิทธิผู้ใช้"
            value={role}
            onChange={(event) => {
              table.onResetPage();
              setRole(event.target.value);
            }}
            sx={{ width: { xs: 1, md: 240 } }}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {ROLE_ORDER.map((option) => (
              <MenuItem key={option} value={option}>
                {CSC_ROLE_TRANSLATIONS[option]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            value={name}
            placeholder="ค้นหาชื่อหรือหมายเลข..."
            onChange={(event) => {
              table.onResetPage();
              setName(event.target.value);
            }}
          />
        </Stack>

        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {filtered
                .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar alt={user.name} src={user.profileImageUrl} />
                        {user.name}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Label color={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'info' : 'default'}>
                        {CSC_ROLE_TRANSLATIONS[user.role]}
                      </Label>
                    </TableCell>
                    <TableCell>{user.shortId}</TableCell>
                    <TableCell>{user.districts.map((district) => district.districtName).join(', ') || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => setEditing(user)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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

      <UserEditDialog user={editing} onClose={() => setEditing(null)} />
    </DashboardContent>
  );
}
