import { redirect } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';

export default function CommercialPage() {
  return redirect(paths.commercials.restaurants);
}
