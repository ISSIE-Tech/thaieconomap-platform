import type { SettingsState } from './types';

import { defaultFont } from 'src/theme/core/typography';
import { _languages } from 'src/layouts/config-nav-languages';
import { _workspaces } from 'src/layouts/config-nav-workspace';

// ----------------------------------------------------------------------

export const STORAGE_KEY = 'app-settings';

export const defaultSettings: SettingsState = {
  colorScheme: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: false,
  fontFamily: defaultFont,
  workspace: _workspaces[0],
  language: _languages[0].value,
} as const;
