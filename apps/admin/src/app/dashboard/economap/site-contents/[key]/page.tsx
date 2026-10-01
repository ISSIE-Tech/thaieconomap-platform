'use client';

import type { SiteContentKey } from 'src/modules/economap/site-contents/site-contents.service';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { DashboardContent } from 'src/layouts/dashboard';
import { SiteContentEditor } from 'src/modules/economap/site-contents/site-content-editor';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

const TITLES: Record<SiteContentKey, string> = {
  about: 'เกี่ยวกับเรา',
  terms: 'ข้อกำหนดการใช้งาน',
  privacy: 'นโยบายความเป็นส่วนตัว',
};

export default function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  const { user } = useAuthContext();

  if (!(key in TITLES)) notFound();
  const pageKey = key as SiteContentKey;

  return (
    <RoleBasedGuard currentRole={user?.role ?? ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading={TITLES[pageKey]}
          links={[{ name: 'เนื้อหาเว็บไซต์' }, { name: TITLES[pageKey] }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <SiteContentEditor key={pageKey} pageKey={pageKey} />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
