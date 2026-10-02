'use client';

import type { MouseEvent } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CONFIG } from 'src/config-global';
import { useRouter } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { toast } from 'src/shared/components/snackbar';
import { Iconify } from 'src/shared/components/iconify';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const CREATE_OPTIONS = [
  {
    label: 'ร้านอาหาร',
    description: 'ปักหมุดร้านอาหารบนแผนที่',
    icon: 'fluent:food-24-filled',
    href: paths.create.restaurants,
  },
  {
    label: 'ธุรกิจ',
    description: 'ร้านค้า บริการ และธุรกิจในชุมชน',
    icon: 'solar:shop-2-bold',
    href: paths.create.businesses,
  },
  {
    label: 'งานและอาชีพ',
    description: 'ลงประกาศรับสมัครงาน',
    icon: 'solar:case-round-bold',
    // jobs are posted in csc's LINE LIFF app
    href: CONFIG.site.cscLiffUrl,
    external: true,
  },
  {
    label: 'ช่วยเหลือแบ่งปัน',
    description: 'แบ่งปันสิ่งของให้คนในชุมชน',
    icon: 'solar:hand-heart-bold',
    href: paths.create.shares,
  },
];

const TOAST_ID = 'header-action-button';

/** One "add" entry point for the header: opens a menu of what you can create. Guests get a login toast. */
export function CreateMenuButton({ variant = 'button' }: { variant?: 'button' | 'icon' }) {
  const router = useRouter();
  const { authenticated } = useAuthContext();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onGuestClick = () =>
    toast.warning('กรุณาเข้าสู่ระบบ', {
      id: TOAST_ID,
      description: 'กดเพื่อไปหน้าลงทะเบียน',
      position: 'top-right',
      action: (
        <Button
          size="small"
          sx={{ color: (theme) => theme.palette.primary.main }}
          onClick={() => {
            router.push(paths.auth.login);
            toast.dismiss(TOAST_ID);
          }}
        >
          ลงทะเบียน
        </Button>
      ),
    });

  const open = (event: MouseEvent<HTMLElement>) =>
    authenticated ? setAnchor(event.currentTarget) : onGuestClick();
  const close = () => setAnchor(null);

  const menuId = 'create-menu';
  const triggerProps = {
    onClick: open,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': !!anchor,
    'aria-controls': anchor ? menuId : undefined,
  };

  return (
    <>
      {variant === 'icon' ? (
        <IconButton {...triggerProps} aria-label="เพิ่มข้อมูล" sx={{ p: 0 }}>
          <Image src="/assets/icons/marker-plus.svg" alt="" width="24" height="24" />
        </IconButton>
      ) : (
        <Button
          {...triggerProps}
          startIcon={<Iconify icon="mingcute:add-line" width={20} />}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={18} />}
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
          เพิ่มข้อมูล
        </Button>
      )}

      <Menu
        id={menuId}
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 300, borderRadius: 2, p: 0.5 } } }}
      >
        {CREATE_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            component={Link}
            href={option.href}
            {...(option.external && { target: '_blank', rel: 'noopener' })}
            onClick={close}
            sx={{ gap: 1.5, py: 1.25, borderRadius: 1.5, whiteSpace: 'normal' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Iconify icon={option.icon} width={22} />
            </Box>
            <Stack minWidth={0}>
              <Typography fontWeight={700} fontSize={15}>
                {option.label}
                {option.external && (
                  <Iconify
                    icon="solar:square-arrow-right-up-linear"
                    width={14}
                    sx={{ ml: 0.5, verticalAlign: 'middle', color: 'grey.500' }}
                  />
                )}
              </Typography>
              <Typography fontSize={12} color="grey.600">
                {option.description}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

/** Mobile header slot. */
export function HeaderActionButtons() {
  return <CreateMenuButton variant="icon" />;
}
