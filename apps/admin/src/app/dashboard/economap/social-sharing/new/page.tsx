import { DashboardContent } from 'src/layouts/dashboard';
import { SocialSharingForm } from 'src/modules/economap/social-sharing/social-sharing-create';

export default function Page() {
  return (
    <DashboardContent maxWidth="xl">
      <SocialSharingForm />
    </DashboardContent>
  );
}
