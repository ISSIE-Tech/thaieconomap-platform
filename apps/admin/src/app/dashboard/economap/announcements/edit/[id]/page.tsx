import { DashboardContent } from 'src/layouts/dashboard';
import AnnouncementEditPage from 'src/modules/economap/announcements/announcements-update/announcement-edit-page';

// ----------------------------------------------------------------------

export default function Page({ params }: { params: { id: string } }) {
  return (
    <DashboardContent>
      <AnnouncementEditPage announcementId={params.id} />
    </DashboardContent>
  );
}
