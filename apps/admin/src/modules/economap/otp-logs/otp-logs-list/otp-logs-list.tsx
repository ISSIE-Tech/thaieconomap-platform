'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useGetOtpLogs } from '../_hooks/use-get-otp-logs';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'phoneNumber', label: 'Phone Number', width: 160 },
  { id: 'pumpuangName', label: 'Pumpuang Name', width: 180 },
  { id: 'action', label: 'Action', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'refno', label: 'Ref No', width: 120 },
  { id: 'errorMessage', label: 'Error Message' },
  { id: 'createdAt', label: 'Timestamp', width: 200 },
];

const ACTION_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'request', label: 'Request' },
  { value: 'verify', label: 'Verify' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
];

// ----------------------------------------------------------------------

export default function OtpLogsList() {
  const table = useTable({ defaultRowsPerPage: 20 });

  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const otpLogs = useGetOtpLogs({
    action: actionFilter || undefined,
    status: statusFilter || undefined,
    phoneNumber: phoneFilter || undefined,
    from: fromFilter || undefined,
    to: toFilter || undefined,
    page: String(table.page + 1),
    limit: String(table.rowsPerPage),
  });

  const handleFilterAction = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setActionFilter(event.target.value);
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setStatusFilter(event.target.value);
    },
    [table]
  );

  const handleFilterPhone = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setPhoneFilter(event.target.value);
    },
    [table]
  );

  const handleFilterFrom = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setFromFilter(event.target.value);
    },
    [table]
  );

  const handleFilterTo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setToFilter(event.target.value);
    },
    [table]
  );

  return (
    <Card>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        sx={{ p: 2.5 }}
      >
        <TextField
          select
          label="Action"
          value={actionFilter}
          onChange={handleFilterAction}
          sx={{ minWidth: 120 }}
          size="small"
        >
          {ACTION_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={handleFilterStatus}
          sx={{ minWidth: 120 }}
          size="small"
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search phone"
          value={phoneFilter}
          onChange={handleFilterPhone}
          size="small"
          sx={{ minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="From"
          type="date"
          value={fromFilter}
          onChange={handleFilterFrom}
          size="small"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="To"
          type="date"
          value={toFilter}
          onChange={handleFilterTo}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <Scrollbar>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {otpLogs.data?.data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.phoneNumber}</TableCell>

                  <TableCell>{row.pumpuangName ?? '-'}</TableCell>

                  <TableCell>
                    <Chip
                      label={row.action}
                      color={row.action === 'request' ? 'info' : 'secondary'}
                      size="small"
                      variant="soft"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'success' ? 'success' : 'error'}
                      size="small"
                      variant="soft"
                    />
                  </TableCell>

                  <TableCell>{row.refno ?? '-'}</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ maxWidth: 300, color: 'error.main' }}
                    >
                      {row.errorMessage ?? '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>{fDateTime(row.createdAt)}</TableCell>
                </TableRow>
              ))}

              {(!otpLogs.data?.data || otpLogs.data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No OTP logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        count={otpLogs.data?.total ?? 0}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
