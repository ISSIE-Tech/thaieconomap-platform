import 'src/global.css';

// ----------------------------------------------------------------------
import type { Metadata, Viewport } from 'next';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { LocalizationProvider } from 'src/locales';
import { ThemeProvider } from 'src/theme/theme-provider';
import { GeolocationProvider } from 'src/modules/geolocation';
import Script from 'next/script';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { schemeConfig } from 'src/theme/color-scheme-script';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { ReactQueryProvider } from 'src/components/react-query';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Thai Economap Admin',
  icons: '/favicon.svg',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      {/* Self-hosted Umami. Unset either variable and no analytics script loads. */}
      {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={process.env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
      <body>
        <InitColorSchemeScript modeStorageKey={schemeConfig.modeStorageKey} defaultMode={schemeConfig.defaultMode} />

        <LocalizationProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <GeolocationProvider>
                <SettingsProvider
                  settings={settings}
                  caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
                >
                  <ThemeProvider>
                    <MotionLazy>
                      <Snackbar />
                      <ProgressBar />
                      {children}
                    </MotionLazy>
                  </ThemeProvider>
                </SettingsProvider>
              </GeolocationProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
