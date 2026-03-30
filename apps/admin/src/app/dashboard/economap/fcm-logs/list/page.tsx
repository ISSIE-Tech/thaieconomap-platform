'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import FcmLogsList from 'src/modules/economap/fcm-logs/fcm-logs-list/fcm-logs-list';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { useAuthContext } from 'src/auth/hooks';

export default function Page() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard
      currentRole={user?.role ?? ''}
      acceptRoles={['DEVELOPER']}
      hasContent
    >
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="FCM Notification Logs"
          links={[
            { name: 'FCM Logs', href: paths['fcm-logs'].dashboard.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <FcmLogsList />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
