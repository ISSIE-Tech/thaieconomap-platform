## Why

The admin app's dark mode toggle doesn't work after the MUI v7 upgrade. The theme system uses two deprecated APIs:
1. `Experimental_CssVarsProvider` — removed in MUI v7, replaced by built-in `ThemeProvider`
2. `extendTheme` — deprecated in MUI v7, replaced by `createTheme` with `cssVariables` option

These were the same issues fixed in the frontend app earlier, but the admin app has a more complex settings system (settings drawer, dark mode button, cookie/localStorage persistence) that also needs migration.

## What Changes

- Replace `Experimental_CssVarsProvider` with `ThemeProvider` from `@mui/material/styles`
- Replace `extendTheme` with `createTheme` + `cssVariables` option
- Replace `getInitColorSchemeScript` function with `<InitColorSchemeScript />` component
- Update `AppRouterCacheProvider` from `v14-appRouter` to `v15-appRouter`
- Ensure `useColorScheme()` hook and `setMode()` work with the new provider

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `apps/admin/src/theme/theme-provider.tsx` — provider migration
- `apps/admin/src/theme/create-theme.ts` — theme creation migration
- `apps/admin/src/theme/color-scheme-script.ts` — script migration
- `apps/admin/src/app/layout.tsx` — InitColorSchemeScript component
- Dark mode toggle button and settings drawer continue to work via `useColorScheme()` (compatible with new ThemeProvider)
