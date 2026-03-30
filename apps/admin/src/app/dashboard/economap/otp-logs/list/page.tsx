'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import OtpLogsList from 'src/modules/economap/otp-logs/otp-logs-list/otp-logs-list';

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
          heading="OTP Logs"
          links={[
            { name: 'OTP Logs', href: paths['otp-logs'].dashboard.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <OtpLogsList />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
