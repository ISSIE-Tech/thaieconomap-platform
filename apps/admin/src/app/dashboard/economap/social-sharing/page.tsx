import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

// ------------------------------------------------------------------

export default function Page() {
  return redirect(paths['social-sharing'].dashboard.list);
}
