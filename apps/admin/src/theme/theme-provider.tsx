'use client';

import type {} from '@mui/lab/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import type {} from '@mui/x-tree-view/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { RTL } from './with-settings/right-to-left';
import { schemeConfig } from './color-scheme-script';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();

  const theme = createTheme(settings);

  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <MuiThemeProvider
        theme={theme}
        defaultMode={schemeConfig.defaultMode}
        modeStorageKey={schemeConfig.modeStorageKey}
      >
        <CssBaseline />
        <RTL direction={settings.direction}>{children}</RTL>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
