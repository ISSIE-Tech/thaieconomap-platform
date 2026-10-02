'use client';

import { endpoints } from 'src/configs/endpoints.config';
import { useMutation } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

export default function Page() {
  const { user } = useAuthContext();

  const clear = useMutation({
    mutationFn: () => axios.post(endpoints.caching.clearResponseCache),
  });

  const handleClear = () =>
    clear.mutate(undefined, {
      onSuccess: () => toast.success('ล้างแคชสำเร็จ'),
      onError: () => toast.error('ล้างแคชไม่สำเร็จ'),
    });

  return (
    <RoleBasedGuard currentRole={user?.role ?? ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="ล้างแคช"
          links={[{ name: 'ล้างแคช', href: paths.cache.dashboard.root }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CardHeader
            title="แคชข้อมูลหน้าเว็บ"
            subheader="ระบบเก็บผลลัพธ์ของแผนที่และรายการต่าง ๆ ไว้ชั่วคราว หากข้อมูลบนหน้าเว็บไม่อัปเดต ให้กดล้างแคชเพื่อให้ระบบดึงข้อมูลล่าสุด"
          />

          <CardContent>
            <LoadingButton
              variant="contained"
              color="error"
              loading={clear.isPending}
              onClick={handleClear}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              ล้างแคชทั้งหมด
            </LoadingButton>
          </CardContent>
        </Card>
      </DashboardContent>
    </RoleBasedGuard>
  );
}
