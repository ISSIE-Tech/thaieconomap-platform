import { ManagerEditPage } from 'src/modules/manager/edit-manager/manager-edit-page';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <ManagerEditPage managerId={params.id} />;
}
