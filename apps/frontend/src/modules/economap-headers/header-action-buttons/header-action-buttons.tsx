'use client';

import Link from 'next/link';
import Image from 'next/image';
import { paths } from 'src/shared/routes/paths.config';
import { toast } from 'src/shared/components/snackbar';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

const ACTIONS: Record<string, { url: string; icon: string; label: string }> = {
  [paths.commercials.restaurants]: {
    url: paths.create.restaurants,
    icon: '/assets/icons/marker-plus.svg',
    label: 'เพิ่มร้านค้า',
  },
  [paths.commercials.businesses]: {
    url: paths.create.businesses,
    icon: '/assets/icons/marker-plus.svg',
    label: 'เพิ่มร้านค้า',
  },
  [paths.sharings]: {
    url: paths.create.shares,
    icon: '/assets/icons/sharing-plus.svg',
    label: 'แบ่งปันสิ่งของ',
  },
  [paths.jobs]: {
    url: 'https://www.issie-chula.org/',
    icon: '/assets/icons/job-plus.svg',
    label: 'ลงประกาศงาน',
  },
};

/**
 * The "create" action for the current page, or null when the page has none.
 * Guests get `onClick` (a login toast) instead of `href`.
 */
export function useCreateAction() {
  const pathName = usePathname();
  const router = useRouter();
  const { authenticated } = useAuthContext();

  const action = ACTIONS[pathName];
  if (!action) return null;

  const onGuestClick = () =>
    toast.warning('กรุณาเข้าสู่ระบบ', {
      id: 'header-action-button',
      description: 'กดเพื่อไปหน้าลงทะเบียน',
      position: 'top-right',
      action: (
        <Button
          size="small"
          sx={{ color: (theme) => theme.palette.primary.main }}
          onClick={() => {
            router.push(paths.auth.login);
            toast.dismiss('header-action-button');
          }}
        >
          ลงทะเบียน
        </Button>
      ),
    });

  return {
    icon: action.icon,
    label: action.label,
    href: authenticated ? action.url : undefined,
    onClick: authenticated ? undefined : onGuestClick,
  };
}

export function HeaderActionButtons() {
  const create = useCreateAction();

  if (!create) return <Box />;

  const icon = <Image src={create.icon} alt="marker plus icon" width="24" height="24" />;

  if (!create.href) return <Box onClick={create.onClick}>{icon}</Box>;

  return <Link href={create.href}>{icon}</Link>;
}
