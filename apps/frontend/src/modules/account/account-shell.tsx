'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { useEffect } from 'react';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { useRouter, usePathname } from 'next/navigation';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { SiteFooter, EconomapHeader } from 'src/modules/economap-headers';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const card = { bgcolor: 'common.white', borderRadius: 2, boxShadow: '0px 1px 10px 1px #4876D31A' };

const MENU = [
  {
    title: 'บัญชีของฉัน',
    items: [
      { label: 'ร้านค้าของฉัน', href: paths.account['my-shops'] },
      { label: 'สิ่งของที่ฉันแบ่งปัน', href: paths.account['my-sharings'] },
      { label: 'รายการโปรดของฉัน', href: paths.account.favorites },
      { label: 'ประวัติการทำรายการ', href: paths.account['form-history'] },
    ],
  },
  {
    title: 'การเชื่อมต่อ',
    items: [{ label: 'บริการอื่นๆของเรา', href: paths.account['our-services'] }],
  },
  {
    title: 'ข้อกำหนดและนโยบาย',
    items: [
      { label: 'ข้อกำหนดการใช้งาน', href: paths.legal.terms },
      { label: 'นโยบายความเป็นส่วนตัว', href: paths.legal.privacy },
    ],
  },
];

/** Desktop (md+): header + nav card | content card. Mobile: pages render their own full-screen UI. */
export function AccountShell({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();

  // the mobile menu page has no desktop equivalent; favorites is the default pane
  useEffect(() => {
    if (isDesktop && pathname === paths.account.root) router.replace(paths.account.favorites);
  }, [isDesktop, pathname, router]);

  if (!isDesktop) return children;

  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="จัดการบัญชี" />

      <Stack sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#F5FBFF' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1120,
            mx: 'auto',
            px: 5,
            py: 4,
            display: 'grid',
            gridTemplateColumns: '280px minmax(0, 1fr)',
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack component="aside" spacing={2.5} sx={{ ...card, p: 3, position: 'sticky', top: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                component="img"
                src={user?.profileImageUrl || '/assets/illustrations/default-profile.svg'}
                alt=""
                sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'grey.200' }}
              />
              <Stack minWidth={0}>
                <Typography fontWeight={700} fontSize={16} noWrap>
                  {user?.name}
                </Typography>
                <Typography fontSize={12} color="grey.600">
                  เข้าสู่ระบบด้วย LINE
                </Typography>
              </Stack>
            </Stack>

            {MENU.map((section) => (
              <Stack key={section.title} spacing={0.5}>
                <Typography fontWeight={700} fontSize={15} pb={0.5}>
                  {section.title}
                </Typography>
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <ButtonBase
                      key={item.href}
                      component={Link}
                      href={item.href}
                      sx={{
                        justifyContent: 'space-between',
                        height: 44,
                        px: 1.5,
                        borderRadius: 1,
                        fontSize: 15,
                        bgcolor: active ? '#F5FBFF' : 'transparent',
                        color: active ? 'primary.dark' : 'text.primary',
                        fontWeight: active ? 700 : 400,
                      }}
                    >
                      {item.label}
                      <Iconify icon="material-symbols-light:arrow-forward-ios" width={18} />
                    </ButtonBase>
                  );
                })}
              </Stack>
            ))}

            <ButtonBase
              onClick={async () => {
                await logout();
                router.push(paths.roots);
              }}
              sx={{
                justifyContent: 'flex-start',
                gap: 0.75,
                px: 1.5,
                pt: 1.5,
                borderTop: (theme) => `1px solid ${theme.palette.grey[200]}`,
                color: 'error.main',
                fontSize: 15,
              }}
            >
              <Box component="img" src="/assets/icons/logout.svg" alt="" width={20} height={20} />
              ออกจากระบบ
            </ButtonBase>
          </Stack>

          <Stack component="section" spacing={2} sx={{ ...card, px: 3.5, py: 3, minHeight: 480 }}>
            {children}
          </Stack>
        </Box>

        <SiteFooter />
      </Stack>
    </Stack>
  );
}
