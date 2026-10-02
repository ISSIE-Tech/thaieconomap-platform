'use client';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { useGetTamsangBases, useSetTamsangBaseHidden } from './tamsang-shops.service';

// ----------------------------------------------------------------------

const BASE_HEAD = [
  { id: 'visible', label: 'แสดงบนแผนที่', width: 120 },
  { id: 'name', label: 'ชื่อฐาน' },
  { id: 'botInfo', label: 'LINE OA', width: 260 },
  { id: 'location', label: 'จุดศูนย์กลาง', width: 220 },
  { id: 'serviceRadiusKm', label: 'รัศมีบริการ', width: 140 },
];

// ----------------------------------------------------------------------

export default function TamsangBasesList() {
  const table = useTable({ defaultRowsPerPage: 20 });

  const { data: bases = [] } = useGetTamsangBases();

  const setHidden = useSetTamsangBaseHidden();

  const handleToggleHidden = (id: string, hidden: boolean) =>
    setHidden.mutate(
      { id, hidden },
      {
        onSuccess: () => toast.success(hidden ? 'ปิดทั้งฐานแล้ว' : 'เปิดทั้งฐานแล้ว'),
        onError: () => toast.error('บันทึกไม่สำเร็จ'),
      }
    );

  const rows = bases.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Card>
      <CardHeader
        title="ฐานตามสั่งตามส่ง"
        subheader={`ทั้งหมด ${bases.length} ฐาน · ปิดฐานจะซ่อนทุกร้านในฐานนั้นจากแผนที่`}
      />

      <Scrollbar>
        <Table size="medium" sx={{ minWidth: 1020 }}>
          <TableHeadCustom headLabel={BASE_HEAD} />

          <TableBody>
            {rows.map((row) => {
              // GeoJSON is [longitude, latitude]
              const [lng, lat] = row.location?.coordinates ?? [];

              return (
                <TableRow key={row._id} sx={{ opacity: row.hidden ? 0.5 : 1 }}>
                  <TableCell>
                    <Switch
                      checked={!row.hidden}
                      disabled={setHidden.isPending && setHidden.variables?.id === row._id}
                      onChange={(event) => handleToggleHidden(row._id, !event.target.checked)}
                      inputProps={{ 'aria-label': `แสดงฐาน ${row.name ?? ''} บนแผนที่` }}
                    />
                  </TableCell>

                  <TableCell>{row.name || '-'}</TableCell>

                  <TableCell>
                    {row.botInfo ? (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar alt={row.botInfo.displayName} src={row.botInfo.lineImageUrl} />
                        <Stack>
                          <Typography variant="body2">{row.botInfo.displayName}</Typography>
                          <Link
                            variant="caption"
                            href={`https://line.me/R/ti/p/${row.botInfo.basicId}`}
                            target="_blank"
                            rel="noopener"
                          >
                            {row.botInfo.basicId}
                          </Link>
                        </Stack>
                      </Stack>
                    ) : (
                      <Label color="warning">ยังไม่ตั้งค่า</Label>
                    )}
                  </TableCell>

                  <TableCell>
                    {lat != null && lng != null ? (
                      <Link
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener"
                      >
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                      </Link>
                    ) : (
                      <Label color="warning">ไม่มีพิกัด</Label>
                    )}
                  </TableCell>

                  <TableCell>
                    {row.serviceRadiusKm ? (
                      `${row.serviceRadiusKm} กม.`
                    ) : (
                      <Label color="error">ปิดบริการ</Label>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {!bases.length && (
              <TableRow>
                <TableCell colSpan={BASE_HEAD.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ไม่พบฐาน
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={table.page}
        count={bases.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
