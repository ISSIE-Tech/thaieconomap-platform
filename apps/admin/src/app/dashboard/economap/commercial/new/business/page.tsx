import { DashboardContent } from 'src/layouts/dashboard';
import { CommercialCreateForm } from 'src/modules/economap/commercial/commercial-create';
import { CommercialType } from 'src/modules/economap/commercial/commercial-create/types';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <CommercialCreateForm commercialType={CommercialType.BUSINESS} />
    </DashboardContent>
  );
}
