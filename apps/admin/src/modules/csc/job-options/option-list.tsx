'use client';

import { useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type Option = { _id: string; name: string; iconUrl?: string };

type Props = {
  heading: string;
  options?: Option[];
  withIcon?: boolean;
  onCreate: (name: string, icon: File | null) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
};

const onError = (error: any) => toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาด');

// shared by job categories (name + icon) and wage units (name only)
export function OptionList({ heading, options = [], withIcon = false, onCreate, onDelete }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<Option | null>(null);

  const handleCreate = () =>
    onCreate(name.trim(), icon)
      .then(() => {
        toast.success('สร้างเรียบร้อยแล้ว');
        setName('');
        setIcon(null);
      })
      .catch(onError);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={heading}
        links={[{ name: 'งาน', href: paths.csc.dashboard.jobs.root }, { name: 'ตัวเลือก' }, { name: heading }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2.5 }}>
          <TextField fullWidth label={`ชื่อ${heading}`} value={name} onChange={(event) => setName(event.target.value)} />

          {withIcon && (
            <Button component="label" variant="outlined" sx={{ flexShrink: 0 }}>
              {icon?.name ?? 'เลือกไอคอน'}
              <input hidden type="file" accept="image/*" onChange={(event) => setIcon(event.target.files?.[0] ?? null)} />
            </Button>
          )}

          <Button
            variant="contained"
            disabled={!name.trim() || (withIcon && !icon)}
            onClick={handleCreate}
            sx={{ flexShrink: 0 }}
          >
            สร้าง
          </Button>
        </Stack>

        <Table>
          <TableHeadCustom
            headLabel={[...(withIcon ? [{ id: 'icon', label: 'ไอคอน', width: 80 }] : []), { id: 'name', label: 'ชื่อ' }, { id: '', width: 80 }]}
          />

          <TableBody>
            {options.map((option) => (
              <TableRow key={option._id} hover>
                {withIcon && (
                  <TableCell>
                    <Avatar alt={option.name} src={option.iconUrl} variant="rounded" sx={{ width: 32, height: 32 }} />
                  </TableCell>
                )}
                <TableCell>{option.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setDeleting(option)}>
                    <Iconify icon="solar:trash-bin-minimalistic-bold" sx={{ color: 'error.main' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableNoData notFound={!options.length} />
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="ลบ"
        content={`คุณยืนยันที่จะลบ "${deleting?.name ?? ''}"?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleting) {
                onDelete(deleting._id)
                  .then(() => toast.success('ลบเรียบร้อยแล้ว'))
                  .catch(onError);
              }
              setDeleting(null);
            }}
          >
            ลบ
          </Button>
        }
      />
    </DashboardContent>
  );
}
