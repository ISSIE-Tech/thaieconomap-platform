import { CreateCommercials } from 'src/modules/create-commercials';
import { CommercialType } from 'src/modules/create-commercials/_types/create-commercials.type';

export default function BusinessesCreatePage() {
  return <CreateCommercials commercialType={CommercialType.BUSINESS} />;
}
