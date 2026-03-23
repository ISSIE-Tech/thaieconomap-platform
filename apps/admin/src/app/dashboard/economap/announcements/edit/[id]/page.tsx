import { DashboardContent } from 'src/layouts/dashboard';
import AnnouncementEditPage from 'src/modules/economap/announcements/announcements-update/announcement-edit-page';

// ----------------------------------------------------------------------

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <DashboardContent>
      <AnnouncementEditPage announcementId={id} />
    </DashboardContent>
  );
}
