// import leaflet before global.css to apply custom style
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import Script from 'next/script';
import { Suspense, type PropsWithChildren } from 'react';
import { ThemeProvider } from 'src/theme/theme-provider';
import { Snackbar } from 'src/shared/components/snackbar';
import { LocalizationProvider } from 'src/shared/locales';
import { ReactQueryProvider } from 'src/shared/react-query';
import { GeolocationProvider } from 'src/modules/geolocation';
import { CookieConsent } from 'src/modules/consent/cookie-consent';
import AuthProvider from 'src/modules/auth/_contexts/auth-provider';
import {
  jsonLd,
  SITE_URL,
  SITE_NAME,
  OPEN_GRAPH,
  IS_INDEXABLE,
  SITE_NAME_TH,
  SITE_DESCRIPTION,
} from 'src/shared/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SITE_NAME_TH}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: '/favicon.svg',
  robots: IS_INDEXABLE ? undefined : { index: false, follow: false },
  openGraph: { ...OPEN_GRAPH, title: `${SITE_NAME} | ${SITE_NAME_TH}`, description: SITE_DESCRIPTION },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0061a8' };

// Who runs the site and what it is, for search engines and AI answer engines.
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: SITE_NAME_TH,
      url: SITE_URL,
      logo: `${SITE_URL}/about/logo-economap.png`,
      parentOrganization: {
        '@type': 'Organization',
        name: 'สถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย (Institute of Asian Studies, Chulalongkorn University)',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: SITE_NAME_TH,
      url: SITE_URL,
      inLanguage: 'th',
      description: SITE_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="th" suppressHydrationWarning>
      {/* Self-hosted Umami. Unset either variable and no analytics script loads. */}
      {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={process.env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
      {/* Google Analytics loads from <CookieConsent /> once the visitor accepts */}
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(SITE_JSON_LD)} />
        <Suspense>
          <ReactQueryProvider>
            <LocalizationProvider>
              <AuthProvider>
                <ThemeProvider>
                  <GeolocationProvider>
                    <Snackbar />
                    <CookieConsent />
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
