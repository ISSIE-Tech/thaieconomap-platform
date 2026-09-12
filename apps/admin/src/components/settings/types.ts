import type { Workspace } from 'src/layouts/config-nav-workspace';
import type { ThemeDirection, ThemeColorScheme } from 'src/theme/types';

// ----------------------------------------------------------------------

export type SettingsCaches = 'localStorage' | 'cookie';

export type SettingsState = {
  fontFamily: string;
  compactLayout: boolean;
  direction: ThemeDirection;
  colorScheme: ThemeColorScheme;
  contrast: 'default' | 'hight';
  navColor: 'integrate' | 'apparent';
  navLayout: 'vertical' | 'mini';
  primaryColor: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';
  workspace: Workspace;
  language: string;
};

export type SettingsContextValue = SettingsState & {
  canReset: boolean;
  onReset: () => void;
  onUpdate: (updateValue: Partial<SettingsState>) => void;
  onUpdateField: (
    name: keyof SettingsState,
    updateValue: SettingsState[keyof SettingsState]
  ) => void;
  // Drawer
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
};

export type SettingsProviderProps = {
  settings: SettingsState;
  caches?: SettingsCaches;
  children: React.ReactNode;
};
