import { PumpuangEditView } from 'src/modules/economap/pumpuang/pumpuang-edit/pumpuang-edit-view';

export default async function PumpuangEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PumpuangEditView pumpuangId={id} />;
}
