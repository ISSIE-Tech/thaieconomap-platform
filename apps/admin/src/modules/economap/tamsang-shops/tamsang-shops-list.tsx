'use client';

import type { SyncCountColumn } from '../sync-logs/sync-log-card';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
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

import TamsangBasesList from './tamsang-bases-list';
import { SyncLogCard } from '../sync-logs/sync-log-card';
import {
  useGetTamsangShops,
  useSetTamsangShopHidden,
  TAMSANG_SHOPS_QUERY_KEY,
} from './tamsang-shops.service';

// ----------------------------------------------------------------------

const SYNC_COUNT_COLUMNS: SyncCountColumn[] = [
  {
    id: 'shops',
    label: 'ร้านค้า (บันทึก / ได้รับ)',
    width: 180,
    render: (row) => `${row.shopsSaved} / ${row.shopsReceived}`,
  },
  { id: 'basesSaved', label: 'ฐาน', width: 80, render: (row) => row.basesSaved },
];

const SHOP_HEAD = [
  { id: 'visible', label: 'แสดงบนแผนที่', width: 120 },
  { id: 'name', label: 'ชื่อร้าน' },
  { id: 'category', label: 'หมวด', width: 120 },
  { id: 'type', label: 'ประเภท', width: 160 },
  { id: 'base', label: 'ฐาน', width: 160 },
  { id: 'commercialOwner', label: 'เจ้าของ', width: 180 },
  { id: 'phoneNumber', label: 'เบอร์โทร', width: 140 },
  { id: 'address', label: 'ที่อยู่', width: 240 },
];

const CATEGORY_LABEL: Record<string, string> = { RESTAURANT: 'ร้านอาหาร', BUSINESS: 'ธุรกิจ' };

// ----------------------------------------------------------------------

export default function TamsangShopsList() {
  const shopTable = useTable({ defaultRowsPerPage: 20 });

  const [search, setSearch] = useState('');

  const shops = useGetTamsangShops({
    search: search || undefined,
    page: String(shopTable.page + 1),
    limit: String(shopTable.rowsPerPage),
  });

  const setHidden = useSetTamsangShopHidden();

  const handleToggleHidden = (id: string, hidden: boolean) =>
    setHidden.mutate(
      { id, hidden },
      {
        onSuccess: () => toast.success(hidden ? 'ซ่อนร้านค้าแล้ว' : 'แสดงร้านค้าแล้ว'),
        onError: () => toast.error('บันทึกไม่สำเร็จ'),
      }
    );

  return (
    <Stack spacing={3}>
      <SyncLogCard
        source="tamsang"
        subheader="ระบบดึงข้อมูลอัตโนมัติทุกวันเวลา 01:00 น."
        countColumns={SYNC_COUNT_COLUMNS}
        invalidateKeys={[TAMSANG_SHOPS_QUERY_KEY]}
        successMessage="ดึงข้อมูลร้านค้าสำเร็จ"
        errorMessage="ดึงข้อมูลร้านค้าไม่สำเร็จ ดูรายละเอียดในประวัติ"
      />

      <Card>
        <CardHeader
          title="ร้านค้าจากตามสั่งตามส่ง"
          subheader={`ทั้งหมด ${shops.data?.total ?? 0} ร้าน`}
        />

        <Stack sx={{ p: 2.5 }}>
          <TextField
            label="ค้นหาชื่อร้าน"
            value={search}
            onChange={(event) => {
              shopTable.onResetPage();
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
          <Table size="medium" sx={{ minWidth: 1220 }}>
            <TableHeadCustom headLabel={SHOP_HEAD} />

            <TableBody>
              {shops.data?.data.map((row) => (
                <TableRow key={row._id} sx={{ opacity: row.hidden ? 0.5 : 1 }}>
                  <TableCell>
                    <Switch
                      checked={!row.hidden}
                      disabled={setHidden.isPending && setHidden.variables?.id === row._id}
                      onChange={(event) => handleToggleHidden(row._id, !event.target.checked)}
                      inputProps={{ 'aria-label': `แสดง ${row.name} บนแผนที่` }}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar alt={row.name} src={row.imageUrl || undefined} variant="rounded" />
                      {row.name}
                    </Stack>
                  </TableCell>

                  <TableCell>{CATEGORY_LABEL[row.category] ?? row.category}</TableCell>

                  <TableCell>{row.type}</TableCell>

                  <TableCell>{row.base?.name ?? '-'}</TableCell>

                  <TableCell>{row.commercialOwner}</TableCell>

                  <TableCell>{row.phoneNumber || '-'}</TableCell>

                  <TableCell>
                    <Typography variant="body2" noWrap title={row.address} sx={{ maxWidth: 240 }}>
                      {row.address || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {!shops.data?.data.length && (
                <TableRow>
                  <TableCell colSpan={SHOP_HEAD.length} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ไม่พบร้านค้า
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          page={shopTable.page}
          count={shops.data?.total ?? 0}
          rowsPerPage={shopTable.rowsPerPage}
          onPageChange={shopTable.onChangePage}
          onRowsPerPageChange={shopTable.onChangeRowsPerPage}
        />
      </Card>

      <TamsangBasesList />
    </Stack>
  );
}
