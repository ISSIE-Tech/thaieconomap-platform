/* eslint-disable @next/next/no-img-element */
import React, { PropsWithChildren, useState } from 'react';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import { Box, SwipeableDrawer } from '@mui/material';
import { Global } from '@emotion/react';

// ----------------------------------------------------------------------

const Root = styled('div')(() => ({
  height: '100%',
  backgroundColor: grey[100],
}));

const drawerBleeding = 160;
const height = 100;

// ----------------------------------------------------------------------

type Props = {
  window?: () => Window;
  label: string;
  onCancel: () => void;
  onSave: () => Promise<void>;
  isValid?: boolean;
  button?: React.ReactNode;
  saveLabel?: string;
};

// ----------------------------------------------------------------------

export default function SwiperDrawer({
  window,
  children,
  label,
  onCancel,
  onSave,
  isValid = false,
  button,
  saveLabel,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  // ----------------------------------------------------------------------

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  const handleSave = async () => {
    await onSave();

    if (isValid) setOpen(false);
  };

  // ----------------------------------------------------------------------

  return (
    <div className="relative">
      {/* Toggle Button */}
      {button ? (
        <button className="w-full" onClick={toggleDrawer(true)}>
          {button}
        </button>
      ) : (
        <button
          className="py-2 mt-4 text-main-green bg-cloud rounded-lg font-bold flex justify-center items-center gap-2.5 w-full"
          onClick={toggleDrawer(true)}
        >
          <span>{label}</span>
          <img
            src="/assets/icons/form/EditPencil.svg"
            alt="edit"
            width={15}
            height={15}
          />
        </button>
      )}

      {/* Swiper Drawer */}
      <Root>
        <Global
          styles={{
            '#swipeable-drawer.MuiDrawer-root > .MuiPaper-root': {
              // height: `calc(${height}% - ${drawerBleeding}px)`,
              maxHeight: `calc(${height}% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />

        <SwipeableDrawer
          id="swipeable-drawer"
          container={container}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={true}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { backgroundColor: 'rgba(0,0,0,0.1)' },
          }}
        >
          <Box
            sx={{
              paddingX: '1.5rem',
              paddingY: '1.5rem',
              width: '100%',
              height: '100%',
              overflow: 'scroll',
              backgroundColor: 'white',
              borderRadius: '1rem 1rem 0 0',
            }}
          >
            {children}

            <div className="grid grid-cols-2 gap-4 mt-6 mb-4">
              <button className="btn btn-outline" onClick={handleCancel}>
                ยกเลิก
              </button>
              <button className="btn btn-solid" onClick={handleSave}>
                {saveLabel || 'บันทึก'}
              </button>
            </div>
          </Box>
        </SwipeableDrawer>
      </Root>
    </div>
  );
}
