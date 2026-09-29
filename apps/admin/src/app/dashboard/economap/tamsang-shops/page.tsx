'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import TamsangShopsList from 'src/modules/economap/tamsang-shops/tamsang-shops-list';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

export default function Page() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role ?? ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="ร้านค้าจากตามสั่งตามส่ง"
          links={[
            { name: 'ร้านค้าจากตามสั่งตามส่ง', href: paths['tamsang-shops'].dashboard.root },
            { name: 'รายการ' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <TamsangShopsList />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
