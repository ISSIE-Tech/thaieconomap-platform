'use client';

import type { SyncCountColumn } from 'src/modules/economap/sync-logs/sync-log-card';

import { DashboardContent } from 'src/layouts/dashboard';
import { SyncLogCard } from 'src/modules/economap/sync-logs/sync-log-card';

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
// public job map reads.
export default function Page() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role ?? ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="งานจากเชี่ยวแชร์"
          links={[
            { name: 'งานจากเชี่ยวแชร์', href: paths['csc-jobs'].dashboard.root },
            { name: 'การดึงข้อมูล' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <SyncLogCard
          source="csc"
          subheader="ระบบดึงงานจากเชี่ยวแชร์มาแสดงบนแผนที่อัตโนมัติทุกชั่วโมง"
          countColumns={SYNC_COUNT_COLUMNS}
          successMessage="ดึงข้อมูลงานสำเร็จ"
          errorMessage="ดึงข้อมูลงานไม่สำเร็จ ดูรายละเอียดในประวัติ"
        />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
