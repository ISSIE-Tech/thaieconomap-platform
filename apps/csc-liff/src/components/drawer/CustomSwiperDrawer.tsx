import React, { PropsWithChildren, useState } from 'react';
import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import { Box, SwipeableDrawer } from '@mui/material';
import { Global } from '@emotion/react';

// ----------------------------------------------------------------------

const drawerBleeding = 160;
const height = 100;

// ----------------------------------------------------------------------

type Props = {
  window?: () => Window;
  button: React.ReactNode;
  onCancel: () => void;
  onSave: () => Promise<void>;
  isValid?: boolean;
  saveLabel?: string;
};

// ----------------------------------------------------------------------

export default function CustomSwiperDrawer({
  window,
  children,
  button,
  onCancel,
  onSave,
  isValid = false,
  saveLabel = 'บันทึก',
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
    <div className="w-full">
      <button className="w-full" onClick={toggleDrawer(true)}>
        {button}
      </button>

      {/* Swiper Drawer */}

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
              {saveLabel}
            </button>
          </div>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
