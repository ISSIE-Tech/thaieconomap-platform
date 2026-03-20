'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/shared/routes/paths.config';
import { toast } from 'src/shared/components/snackbar';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

// ----------------------------------------------------------------------

const generateUrl = (pathName: string) => {
  switch (pathName) {
    case paths.commercials.restaurants:
      return paths.create.restaurants;
    case paths.commercials.businesses:
      return paths.create.businesses;
    case paths.sharings:
      return paths.create.shares;
    case paths.jobs:
      return 'https://www.issie-chula.org/';
    default:
      return '';
  }
};

export function HeaderActionButtons() {
  const pathName = usePathname();

  const router = useRouter();

  const { authenticated } = useAuthContext();

  const url = generateUrl(pathName);

  const getIcon = () => {
    switch (pathName) {
      case paths.commercials.restaurants:
      case paths.commercials.businesses:
        return '/assets/icons/marker-plus.svg';
      case paths.sharings:
        return '/assets/icons/sharing-plus.svg';
      case paths.jobs:
        return '/assets/icons/job-plus.svg';
      default:
        return '';
    }
  };

  const handleGuestClick = () =>
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

  const icon = <Image src={getIcon()} alt="marker plus icon" width="24" height="24" />;

  if (!url) return <Box />;

  if (!authenticated) return <Box onClick={handleGuestClick}>{icon}</Box>;

  return <Link href={url}>{icon}</Link>;
}
