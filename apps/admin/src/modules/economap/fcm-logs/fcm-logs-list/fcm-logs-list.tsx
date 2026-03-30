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

import { useGetFcmLogs } from '../_hooks/use-get-fcm-logs';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'pumpuangName', label: 'Pumpuang Name', width: 160 },
  { id: 'sendTo', label: 'Send To' },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'reason', label: 'Reason', width: 160 },
  { id: 'errorMessage', label: 'Error Message' },
  { id: 'createdAt', label: 'Timestamp', width: 200 },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
];

// ----------------------------------------------------------------------

export default function FcmLogsList() {
  const table = useTable({ defaultRowsPerPage: 20 });

  const [statusFilter, setStatusFilter] = useState('');
  const [sendToFilter, setSendToFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const fcmLogs = useGetFcmLogs({
    status: statusFilter || undefined,
    sendTo: sendToFilter || undefined,
    from: fromFilter || undefined,
    to: toFilter || undefined,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  const handleFilterStatus = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setStatusFilter(event.target.value);
    },
    [table]
  );

  const handleFilterSendTo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setSendToFilter(event.target.value);
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
          label="Status"
          value={statusFilter}
          onChange={handleFilterStatus}
          sx={{ minWidth: 140 }}
          size="small"
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search recipient"
          value={sendToFilter}
          onChange={handleFilterSendTo}
          size="small"
          sx={{ minWidth: 200 }}
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
              {fcmLogs.data?.data?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.pumpuangName ?? '-'}</TableCell>

                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {row.sendTo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'success' ? 'success' : 'error'}
                      size="small"
                      variant="soft"
                    />
                  </TableCell>

                  <TableCell>{row.reason}</TableCell>

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

              {(!fcmLogs.data?.data || fcmLogs.data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No notification logs found
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
        count={fcmLogs.data?.total ?? 0}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
