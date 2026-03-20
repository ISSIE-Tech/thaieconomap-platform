import { redirect } from 'next/navigation';

import { paths } from 'src/shared/routes/paths.config';

export default function Page() {
  return redirect(paths.create.restaurants);
}
