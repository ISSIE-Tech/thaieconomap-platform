'use client';

import { useEffect } from 'react';
import { Iconify } from 'src/shared/components/iconify';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

type Props = {
  images: string[];
  // open at this index; null = closed
  index: number | null;
  onChange: (index: number | null) => void;
};

export function ShopLightbox({ images, index, onChange }: Props) {
  const count = images.length;
  const go = (step: number) => index !== null && onChange((index + step + count) % count);

  useEffect(() => {
    if (index === null) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count);
      if (e.key === 'ArrowRight') onChange((index + 1) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, count, onChange]);

  const arrow = { color: 'common.white', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' } };

  return (
    <Dialog
      fullScreen
      open={index !== null}
      onClose={() => onChange(null)}
      PaperProps={{ sx: { bgcolor: 'rgba(9, 15, 20, 0.96)' } }}
    >
      {index !== null && (
        <Stack height={1} p={{ xs: 1, md: 3 }} spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography color="common.white" fontWeight={700}>
              {index + 1} / {count}
            </Typography>
            <IconButton title="ปิด" onClick={() => onChange(null)} sx={arrow}>
              <Iconify icon="ri:close-line" width={24} />
            </IconButton>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2} flex={1} minHeight={0}>
            {count > 1 && (
              <IconButton title="ก่อนหน้า" onClick={() => go(-1)} sx={arrow}>
                <Iconify icon="eva:arrow-ios-back-fill" width={28} />
              </IconButton>
            )}
            <Box
              component="img"
              src={images[index]}
              alt=""
              sx={{ flex: 1, minWidth: 0, height: 1, objectFit: 'contain' }}
            />
            {count > 1 && (
              <IconButton title="ถัดไป" onClick={() => go(1)} sx={arrow}>
                <Iconify icon="eva:arrow-ios-forward-fill" width={28} />
              </IconButton>
            )}
          </Stack>

          {count > 1 && (
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ overflowX: 'auto', flexShrink: 0 }}>
              {images.map((src, i) => (
                <Box
                  key={src}
                  component="img"
                  src={src}
                  alt=""
                  onClick={() => onChange(i)}
                  sx={{
                    width: 72,
                    height: 54,
                    flexShrink: 0,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    opacity: i === index ? 1 : 0.5,
                    outline: i === index ? '2px solid white' : 'none',
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Dialog>
  );
}
