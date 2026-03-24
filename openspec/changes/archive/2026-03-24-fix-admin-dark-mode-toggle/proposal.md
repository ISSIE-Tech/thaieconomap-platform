## Why

The dark mode toggle in the admin web app does not work. Clicking the toggle button does not change the theme visually, and clearing localStorage does not resolve the issue. The root cause is a conflict in how MUI v7's CSS variables theme system interacts with the dual-layer state management (MUI internal mode + settings context), causing theme mode changes to be overridden on re-render.

## What Changes

- Fix the theme provider setup to properly handle color scheme switching with MUI v7's CSS variables system
- Ensure `useColorScheme().setMode()` and the settings context stay in sync without conflicting
- Remove conflicting `defaultColorScheme` / `defaultMode` overrides that cause the theme to reset on re-render
- Ensure toggling dark mode persists correctly across page refreshes
- Add dark mode toggle button to the login screen so users can switch themes before logging in

## Capabilities

### New Capabilities

- `admin-theme-switching`: Fix dark/light mode toggle in admin web to properly switch themes using MUI v7 CSS variables system

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- `apps/admin/src/theme/theme-provider.tsx` — ThemeProvider defaultMode handling
- `apps/admin/src/theme/create-theme.ts` — defaultColorScheme in theme creation
- `apps/admin/src/layouts/components/dark-mode-button.tsx` — toggle handler sync
- `apps/admin/src/theme/color-scheme-script.ts` — scheme config defaults
- `apps/admin/src/app/auth/line/page.tsx` — add DarkModeButton to login page
- No API or dependency changes
