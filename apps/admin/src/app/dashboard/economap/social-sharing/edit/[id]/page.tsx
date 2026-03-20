import { SocialSharingEditPage } from 'src/modules/economap/social-sharing/social-sharing-edit';

export default function Page({ params }: { params: { id: string } }) {
  return <SocialSharingEditPage socialSharingId={params.id} />;
}
