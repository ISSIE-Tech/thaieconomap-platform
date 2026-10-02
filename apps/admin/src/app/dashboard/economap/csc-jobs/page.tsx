'use client';

import type { SyncCountColumn } from 'src/modules/economap/sync-logs/sync-log-card';

import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';
import CscJobsList from 'src/modules/economap/csc-jobs/csc-jobs-list';
import { SyncLogCard } from 'src/modules/economap/sync-logs/sync-log-card';
import { CSC_JOBS_QUERY_KEY } from 'src/modules/economap/csc-jobs/csc-jobs.service';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

const SYNC_COUNT_COLUMNS: SyncCountColumn[] = [
  {
    id: 'jobs',
    label: 'งาน (บันทึก / ได้รับ)',
    width: 180,
    render: (row) => `${row.jobsSaved} / ${row.jobsReceived}`,
  },
  {
    id: 'jobCategoriesSaved',
    label: 'หมวดงาน',
    width: 100,
    render: (row) => row.jobCategoriesSaved,
  },
];

// Jobs themselves are managed in the CSC workspace; this page only drives the copy the
// public job map reads, and which of those jobs the map shows.
export default function Page() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role ?? ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="งานจากเชี่ยวแชร์"
          links={[
            { name: 'งานจากเชี่ยวแชร์', href: paths['csc-jobs'].dashboard.root },
            { name: 'รายการ' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Stack spacing={3}>
          <SyncLogCard
            source="csc"
            subheader="ระบบดึงงานจากเชี่ยวแชร์มาแสดงบนแผนที่อัตโนมัติทุกชั่วโมง"
            countColumns={SYNC_COUNT_COLUMNS}
            invalidateKeys={[CSC_JOBS_QUERY_KEY]}
            successMessage="ดึงข้อมูลงานสำเร็จ"
            errorMessage="ดึงข้อมูลงานไม่สำเร็จ ดูรายละเอียดในประวัติ"
          />

          <CscJobsList />
        </Stack>
      </DashboardContent>
    </RoleBasedGuard>
  );
}
