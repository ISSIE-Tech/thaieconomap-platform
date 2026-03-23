import { ManagerEditPage } from 'src/modules/manager/edit-manager/manager-edit-page';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ManagerEditPage managerId={id} />;
}
