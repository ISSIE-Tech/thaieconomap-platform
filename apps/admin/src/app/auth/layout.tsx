import type { PropsWithChildren } from 'react';

import { GuestGuard } from 'src/auth/guard';

export default function AuthLayout({ children }: PropsWithChildren) {
  return <GuestGuard>{children}</GuestGuard>;
}
