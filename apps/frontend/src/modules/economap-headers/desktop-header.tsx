'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

import { useCreateAction } from './header-action-buttons';

// ----------------------------------------------------------------------

const NAV = [
  { label: 'แผนที่ธุรกิจ', href: paths.commercials.restaurants, match: ['/commercials', '/shops'] },
  { label: 'งานและอาชีพ', href: paths.jobs, match: [paths.jobs] },
  { label: 'ช่วยเหลือแบ่งปัน', href: paths.sharings, match: [paths.sharings] },
  { label: 'ประกาศ', href: paths.announcements.root, match: [paths.announcements.root] },
];

export function DesktopHeader() {
  const pathname = usePathname();
  const { authenticated, user } = useAuthContext();
  const create = useCreateAction();

  return (
    <Stack
      component="header"
      direction="row"
      alignItems="center"
      spacing={3}
      sx={{
        height: 64,
        flexShrink: 0,
        px: 3,
        borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        bgcolor: 'common.white',
        position: 'relative',
        zIndex: 1100,
      }}
    >
      <Link href={paths.roots} style={{ display: 'flex', flexShrink: 0 }}>
        <Box component="img" src="/assets/icons/logo-full.svg" alt="Thai Economap" height={26} />
      </Link>

      <Stack component="nav" direction="row" spacing={0.5} alignSelf="stretch" minWidth={0}>
        {NAV.map((item) => {
          const active = item.match.some((m) => pathname.startsWith(m));
          return (
            <ButtonBase
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                position: 'relative',
                px: 1.5,
                whiteSpace: 'nowrap',
                fontSize: 15,
                fontWeight: active ? 700 : 500,
                color: active ? 'primary.main' : 'grey.700',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  bottom: 0,
                  height: '0.3rem',
                  borderRadius: '1rem 1rem 0 0',
                  bgcolor: active ? 'primary.main' : 'transparent',
                },
              }}
            >
              {item.label}
            </ButtonBase>
          );
        })}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5} ml="auto !important" flexShrink={0}>
        {create && (
          <Button
            {...(create.href ? { component: Link, href: create.href } : { onClick: create.onClick })}
            startIcon={<Box component="img" src={create.icon} alt="" width={22} height={22} />}
            sx={{
              height: 40,
              px: 2.25,
              borderRadius: '9999px',
              border: 2,
              borderColor: 'primary.lighter',
              color: 'primary.dark',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {create.label}
          </Button>
        )}

        {authenticated ? (
          <ButtonBase component={Link} href={paths.account.root} sx={{ borderRadius: '50%' }}>
            <Box
              component="img"
              src={user?.profileImageUrl || '/assets/illustrations/default-profile.svg'}
              alt="บัญชีของฉัน"
              sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'grey.200' }}
            />
          </ButtonBase>
        ) : (
          <Button
            component={Link}
            href={paths.auth.login}
            variant="contained"
            sx={{ height: 40, px: 2.5, borderRadius: '9999px', whiteSpace: 'nowrap' }}
          >
            เข้าสู่ระบบ
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
