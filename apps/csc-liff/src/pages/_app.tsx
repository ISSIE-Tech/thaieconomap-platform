import Head from 'next/head';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterBuddhist } from '@/utils/adapter-buddhist';
import { th } from 'date-fns/locale';
import { AuthProvider } from '@/auth/AuthContext';
import { SnackbarProvider } from 'notistack';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <LocalizationProvider dateAdapter={AdapterBuddhist} adapterLocale={th}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </>
  );
}
