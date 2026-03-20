import type { PropsWithChildren } from 'react';

import { AuthGuard } from 'src/modules/auth/_guards';

// ----------------------------------------------------------------------

export default function AccountLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}
