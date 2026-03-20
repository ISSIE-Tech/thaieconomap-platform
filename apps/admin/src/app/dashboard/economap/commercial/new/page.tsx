import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

export default function CommercialPage() {
  return redirect(paths.commercial.dashboard.new.restaurant);
}
