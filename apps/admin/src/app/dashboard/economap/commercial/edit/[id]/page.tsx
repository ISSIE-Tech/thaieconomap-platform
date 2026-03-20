import { CommercialEditPage } from 'src/modules/economap/commercial/commercial-edit/commercial-edit-page';

export default function Page({ params }: { params: { id: string } }) {
  return <CommercialEditPage commercialId={params.id} />;
}
