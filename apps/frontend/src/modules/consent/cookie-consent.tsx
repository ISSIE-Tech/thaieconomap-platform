'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { paths } from 'src/shared/routes/paths.config';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

// PDPA: analytics cookies need consent first, so Google Analytics only loads once the
// visitor accepts. Umami is cookieless and loads regardless (see app/layout.tsx).
const GA_ID = 'G-C31NKXJM4M';
const STORAGE_KEY = 'cookie-consent';
const OPEN_EVENT = 'cookie-consent:open';

type Consent = 'granted' | 'denied';

const readConsent = (): Consent | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

/** Reopens the banner so the visitor can change their choice (privacy page). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setOpen(saved === null);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // private mode: the choice lasts for this page view only
    }
    setOpen(false);
    // withdrawing after GA already loaded: reload so its script is gone; its cookies
    // expire on their own and are no longer refreshed
    if (consent === 'granted' && value === 'denied') window.location.reload();
    setConsent(value);
  };

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {open && (
        <Box
          role="dialog"
          aria-label="การตั้งค่าคุกกี้"
          sx={{
            position: 'fixed',
            zIndex: 1350,
            left: { xs: 12, md: 24 },
            right: { xs: 12, md: 'auto' },
            bottom: { xs: 12, md: 24 },
            maxWidth: { md: 440 },
            p: 2.5,
            bgcolor: 'common.white',
            borderRadius: 2,
            boxShadow: '0px 4px 24px 2px #4876D340',
          }}
        >
          <Typography fontWeight={700} fontSize={16}>
            เว็บไซต์นี้ใช้คุกกี้
          </Typography>
          <Typography fontSize={14} color="grey.700" mt={0.75} lineHeight={1.7}>
            เราใช้คุกกี้ที่จำเป็นเพื่อให้บริการทำงานได้ และขอความยินยอมจากท่านเพื่อใช้คุกกี้วิเคราะห์การใช้งาน (Google
            Analytics) ในการปรับปรุงบริการ ท่านเปลี่ยนการตั้งค่าได้ทุกเมื่อ อ่านเพิ่มเติมใน{' '}
            <Box component={Link} href={paths.legal.privacy} sx={{ color: 'primary.dark', fontWeight: 700 }}>
              นโยบายความเป็นส่วนตัว
            </Box>
          </Typography>

          <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
            <Button
              onClick={() => choose('denied')}
              sx={{ borderRadius: '9999px', border: 2, borderColor: 'primary.lighter', color: 'primary.dark', fontWeight: 700, px: 2 }}
            >
              เฉพาะที่จำเป็น
            </Button>
            <Button
              variant="contained"
            color="primary"
              onClick={() => choose('granted')}
              sx={{ borderRadius: '9999px', fontWeight: 700, px: 2.5, boxShadow: 'none' }}
            >
              ยอมรับทั้งหมด
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

export function CookieSettingsButton() {
  return (
    <Button
      onClick={openCookieSettings}
      sx={{ alignSelf: 'flex-start', borderRadius: '9999px', border: 2, borderColor: 'primary.lighter', color: 'primary.dark', fontWeight: 700, px: 2 }}
    >
      ตั้งค่าคุกกี้
    </Button>
  );
}
