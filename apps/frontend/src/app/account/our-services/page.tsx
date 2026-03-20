'use client';

import type { ReactNode } from 'react';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { primary } from 'src/theme/core';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import NavigateLink from 'src/modules/account/navigate-link';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { SERVICE_LINKS, OUR_CONTACT_NUMBER } from 'src/modules/account/_constants';

const services = Object.keys(SERVICE_LINKS) as (keyof typeof SERVICE_LINKS)[];

export default function OurServices() {
  const router = useRouter();
  const dialogController = useBoolean();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const createDialogOpener = (newTitle: string, newLink: string) => () => {
    setTitle(newTitle);
    setLink(newLink);
    dialogController.onTrue();
  };

  return (
    <Stack minHeight="100vh">
      <BlueRoundedHeader title="บริการอื่นๆของเรา" />

      <Stack spacing={1.25} mt={1.25} px={3}>
        <Typography variant="body1" fontWeight="bold">
          บริการ
        </Typography>

        <Stack spacing={1}>
          {services.map((serviceKey) => {
            const { name, link: serviceLink, disabled } = SERVICE_LINKS[serviceKey];
            return (
              <React.Fragment key={serviceKey}>
                <NavigateLink
                  text={name}
                  onClick={createDialogOpener(name, serviceLink)}
                  disabled={disabled}
                />
                <Divider />
              </React.Fragment>
            );
          })}
        </Stack>
      </Stack>

      <Stack spacing={1.25} mt={1.25} px={3}>
        <Typography variant="body1" fontWeight="bold">
          ศูนย์ช่วยเหลือ
        </Typography>

        <Stack spacing={1}>
          <NavigateLink
            text="ติดต่อเรา"
            onClick={() => {
              window.location.href = `tel:${OUR_CONTACT_NUMBER}`;
            }}
          />
          <Divider />
        </Stack>
      </Stack>

      <ConfirmDialog
        controller={dialogController}
        content={
          <Typography fontWeight="bold" textAlign="center">
            ต้องการเปลี่ยนไปเข้าสู่ระบบของ ”{title}” ?
          </Typography>
        }
        action={
          <Button
            sx={{
              width: '45%',
              bgcolor: primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: primary.dark,
              },
              borderRadius: '9999px',
            }}
            onClick={() => router.push(link || '#')} // Navigate to the service link or fallback
          >
            ยืนยัน
          </Button>
        }
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ConfirmDialogProps = {
  controller: UseBooleanReturn;
  content: ReactNode;
  action: ReactNode;
};

function ConfirmDialog({ controller, content, action }: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={controller.value} onClose={controller.onFalse}>
      {content && <DialogTitle sx={{ typography: 'body2', pt: 2 }}> {content} </DialogTitle>}

      <DialogActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Button
          color="primary"
          sx={{ width: '45%', borderRadius: '9999px' }}
          onClick={controller.onFalse}
        >
          ยกเลิก
        </Button>

        {action}
      </DialogActions>
    </Dialog>
  );
}
