import type { CustomShadows } from './core/custom-shadows';

import type { Theme as MuiTheme } from '@mui/material/styles';
import type { CssVarsThemeOptions } from '@mui/material/styles';
import type { TypographyVariantsOptions } from '@mui/material/styles/createTypography';

// ----------------------------------------------------------------------

export type Theme = MuiTheme;

export type ThemeUpdateOptions = Omit<CssVarsThemeOptions, 'typography'> & {
  typography?: TypographyVariantsOptions;
  customShadows?: CustomShadows;
};

export type ThemeComponents = CssVarsThemeOptions['components'];

export type ThemeColorScheme = 'light' | 'dark';

export type ThemeDirection = 'ltr' | 'rtl';

export type ThemeLocaleComponents = { components: ThemeComponents };
