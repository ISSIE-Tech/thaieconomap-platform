'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { fDateTime } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useGetSyncLogs, useGetTamsangShops, useSyncTamsangShops } from './tamsang-shops.service';

// ----------------------------------------------------------------------

const SYNC_HEAD = [
  { id: 'createdAt', label: 'เวลา', width: 180 },
  { id: 'trigger', label: 'สั่งโดย', width: 180 },
  { id: 'status', label: 'สถานะ', width: 100 },
  { id: 'shops', label: 'ร้านค้า (บันทึก / ได้รับ)', width: 180 },
  { id: 'basesSaved', label: 'ฐาน', width: 80 },
  { id: 'durationMs', label: 'ใช้เวลา', width: 100 },
  { id: 'errorMessage', label: 'ข้อผิดพลาด' },
];

const SHOP_HEAD = [
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
  const syncTable = useTable({ defaultRowsPerPage: 5 });
  const shopTable = useTable({ defaultRowsPerPage: 20 });

  const [search, setSearch] = useState('');

  const syncLogs = useGetSyncLogs({
    page: String(syncTable.page + 1),
    limit: String(syncTable.rowsPerPage),
  });

  const shops = useGetTamsangShops({
    search: search || undefined,
    page: String(shopTable.page + 1),
    limit: String(shopTable.rowsPerPage),
  });

  const sync = useSyncTamsangShops();

  const handleSync = () =>
    sync.mutate(undefined, {
      onSuccess: () => toast.success('ดึงข้อมูลร้านค้าสำเร็จ'),
      onError: () => toast.error('ดึงข้อมูลร้านค้าไม่สำเร็จ ดูรายละเอียดในประวัติ'),
    });

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title="ประวัติการดึงข้อมูล"
          subheader="ระบบดึงข้อมูลอัตโนมัติทุกวันเวลา 01:00 น."
          action={
            <LoadingButton
              variant="contained"
              loading={sync.isPending}
              onClick={handleSync}
              startIcon={<Iconify icon="solar:refresh-bold" />}
            >
              ดึงข้อมูลใหม่
            </LoadingButton>
          }
          sx={{ mb: 2 }}
        />

        <Scrollbar>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={SYNC_HEAD} />

            <TableBody>
              {syncLogs.data?.data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{fDateTime(row.createdAt)}</TableCell>

                  <TableCell>
                    {row.trigger === 'cron' ? 'อัตโนมัติ' : (row.triggeredBy ?? 'ผู้ดูแล')}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว'}
                      color={row.status === 'success' ? 'success' : 'error'}
                      size="small"
                      variant="soft"
                    />
                  </TableCell>

                  <TableCell>
                    {row.shopsSaved} / {row.shopsReceived}
                  </TableCell>

                  <TableCell>{row.basesSaved}</TableCell>

                  <TableCell>{(row.durationMs / 1000).toFixed(1)} วิ</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      title={row.errorMessage ?? undefined}
                      sx={{ maxWidth: 300, color: 'error.main' }}
                    >
                      {row.errorMessage ?? '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {!syncLogs.data?.data.length && (
                <TableRow>
                  <TableCell colSpan={SYNC_HEAD.length} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ยังไม่มีประวัติการดึงข้อมูล
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          page={syncTable.page}
          count={syncLogs.data?.total ?? 0}
          rowsPerPage={syncTable.rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={syncTable.onChangePage}
          onRowsPerPageChange={syncTable.onChangeRowsPerPage}
        />
      </Card>

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
          <Table size="medium" sx={{ minWidth: 1100 }}>
            <TableHeadCustom headLabel={SHOP_HEAD} />

            <TableBody>
              {shops.data?.data.map((row) => (
                <TableRow key={row._id}>
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
    </Stack>
  );
}
