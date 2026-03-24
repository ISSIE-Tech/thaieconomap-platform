## 1. Fix ThemeProvider Setup

- [x] 1.1 Remove `defaultColorScheme: settings.colorScheme` from `createTheme()` in `apps/admin/src/theme/create-theme.ts`
- [x] 1.2 Change `defaultMode` in `ThemeProvider` from `settings.colorScheme` to static `schemeConfig.defaultMode` in `apps/admin/src/theme/theme-provider.tsx`

## 2. Add Dark Mode Toggle to Login Screen

- [x] 2.1 Add `DarkModeButton` to the login page at `apps/admin/src/app/auth/line/page.tsx`

## 3. Verify Toggle Handler

- [x] 3.1 Verify `DarkModeButton` toggle handler correctly calls both `setMode()` and `settings.onUpdateField()` — confirm no changes needed in `apps/admin/src/layouts/components/dark-mode-button.tsx`
- [x] 3.2 Verify `SettingsDrawer` theme toggle also works correctly in `apps/admin/src/components/settings/drawer/settings-drawer.tsx`

## 4. Verification

- [ ] 4.1 **[Manual]** Test toggling dark mode on/off in the admin UI — theme should switch immediately
- [ ] 4.2 **[Manual]** Test that theme persists after page refresh (no flash of wrong theme)
- [ ] 4.3 **[Manual]** Test that clearing localStorage and refreshing falls back to light mode correctly
- [ ] 4.4 **[Manual]** Test dark mode toggle works on the login page
