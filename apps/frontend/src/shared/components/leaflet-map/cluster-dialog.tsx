'use client';

import type { MarkerCluster } from 'leaflet';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Image from 'next/image';
import React, { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { groupCluster } from 'src/shared/components/leaflet-map/map';

type Props = {
  type: string;
  cluster: MarkerCluster;
  controller: UseBooleanReturn;
  onClose: () => void;
};

export function ClusterDialog({ type, cluster, controller, onClose }: Props) {
  const createCloseDialogFn = useCallback(
    (willZoom?: boolean) => () => {
      controller.onFalse();
      // if the dialog is closing, change the icon back to the non active one
      cluster.setIcon(groupCluster(cluster));
      // to mark the dialog as 'has been opened' for instance
      onClose();

      if (willZoom) cluster.zoomToBounds();
    },
    [cluster, controller, onClose]
  );

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={controller.value}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{ top: 'auto', bottom: 40 }}
    >
      <DialogContent sx={{ typography: 'body2', py: 2 }}>
        <Stack direction="row" gap={2}>
          <Image
            src="/assets/illustrations/onboarding.svg"
            alt="onboarding illustrations"
            width="96"
            height="96"
          />

          <Stack width="100%">
            <Typography variant="body1" fontWeight="bold">
              {cluster.getChildCount()} {type}ที่น่าสนใจ
            </Typography>

            <DialogActions sx={{ p: 1, pl: 0, width: '100%' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 4,
                }}
                onClick={createCloseDialogFn()}
              >
                ยกเลิก
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 4,
                }}
                onClick={createCloseDialogFn(true)}
              >
                ดูเลย
              </Button>
            </DialogActions>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
