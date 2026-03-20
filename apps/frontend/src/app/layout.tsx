// import leaflet before global.css to apply custom style
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'src/global.css';

import type { Metadata } from 'next';

import { Suspense, type PropsWithChildren } from 'react';

import { ThemeProvider } from 'src/theme/theme-provider';
import { Snackbar } from 'src/shared/components/snackbar';
import { LocalizationProvider } from 'src/shared/locales';
import { ReactQueryProvider } from 'src/shared/react-query';
import { GeolocationProvider } from 'src/modules/geolocation';
import AuthProvider from 'src/modules/auth/_contexts/auth-provider';
import { getInitColorSchemeScript } from 'src/theme/color-scheme-script';

export const metadata: Metadata = {
  title: 'Thai Economap',
  description: 'Super map of economic data in Thailand',
  icons: '/favicon.svg',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {getInitColorSchemeScript}

        <Suspense>
          <ReactQueryProvider>
            <LocalizationProvider>
              <AuthProvider>
                <ThemeProvider>
                  <GeolocationProvider>
                    <Snackbar />
                    {children}
                  </GeolocationProvider>
                </ThemeProvider>
              </AuthProvider>
            </LocalizationProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
