'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

export function UserMenuButton() {
  const router = useRouter();

  const { user, checkUserSession } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      handleClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar
          alt={user.displayName || user.name}
          src={user.profileImageUrl}
          sx={{ width: 36, height: 36 }}
        />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, width: 220 } } }}
      >
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.displayName || user.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {user.role}
          </Typography>
        </Box>

        <Button fullWidth variant="soft" size="medium" color="error" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Popover>
    </>
  );
}
