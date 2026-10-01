import type { PropsWithChildren } from 'react';

import { AuthGuard } from 'src/modules/auth/_guards';
import { AccountShell } from 'src/modules/account/account-shell';

// ----------------------------------------------------------------------

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <AccountShell>{children}</AccountShell>
    </AuthGuard>
  );
}
