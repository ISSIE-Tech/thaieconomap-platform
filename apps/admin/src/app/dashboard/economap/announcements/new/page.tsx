import { DashboardContent } from 'src/layouts/dashboard';
import { AnnouncementsCreateForm } from 'src/modules/economap/announcements/announcements-create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <AnnouncementsCreateForm />
    </DashboardContent>
  );
}
