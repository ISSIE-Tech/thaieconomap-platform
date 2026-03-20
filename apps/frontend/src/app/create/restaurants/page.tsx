import { CreateCommercials } from 'src/modules/create-commercials';
import { CommercialType } from 'src/modules/create-commercials/_types/create-commercials.type';

export default function RestaurantsCreatePage() {
  return <CreateCommercials commercialType={CommercialType.RESTAURANT} />;
}
