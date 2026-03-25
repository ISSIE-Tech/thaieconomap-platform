import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PumpuangTrackingView } from 'src/modules/economap/pumpuang/pumpuang-tracking/pumpuang-tracking-view';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="ประวัติการเดินทาง"
        links={[
          { name: 'รถพุ่มพวง', href: paths.pumpuang.dashboard.list },
          { name: 'ประวัติการเดินทาง' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PumpuangTrackingView pumpuangId={id} />
    </DashboardContent>
  );
}
