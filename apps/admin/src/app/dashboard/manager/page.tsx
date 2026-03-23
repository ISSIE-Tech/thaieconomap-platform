'use client';

import React from 'react';
import { USER_ROLE } from 'src/modules/manager/types';
import { DashboardContent } from 'src/layouts/dashboard';
import { ManagerList } from 'src/modules/manager/manager-list';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function UserPage() {
  const user = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <RoleBasedGuard
        hasContent
        currentRole={user?.user?.role}
        acceptRoles={[USER_ROLE.ADMIN]}
        sx={{ py: 10 }}
      >
        <CustomBreadcrumbs
          heading="รายชื่อผู้จัดการ"
          links={[
            { name: 'รายชื่อผู้จัดการ', href: paths.user.dashboard.root },
            { name: 'จัดการสมาชิก' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.user.dashboard.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              สร้างรายการใหม่
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ManagerList />
      </RoleBasedGuard>
    </DashboardContent>
  );
}
