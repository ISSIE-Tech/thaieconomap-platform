import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import PumpuangList from 'src/modules/economap/pumpuang/pumpuang-list/pumpuang-list';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="รายการรถพุ่มพวง"
        links={[{ name: 'รถพุ่มพวง', href: paths.commercial.dashboard.root }, { name: 'รายการ' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PumpuangList />
    </DashboardContent>
  );
}
