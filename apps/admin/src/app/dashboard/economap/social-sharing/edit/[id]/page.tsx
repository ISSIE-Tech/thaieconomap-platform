import { SocialSharingEditPage } from 'src/modules/economap/social-sharing/social-sharing-edit';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SocialSharingEditPage socialSharingId={id} />;
}
