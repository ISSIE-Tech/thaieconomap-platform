## 1. Migrate Theme Creation

- [x] 1.1 Update `create-theme.ts` — replace `extendTheme` with `createTheme` + `cssVariables` option
- [x] 1.2 Ensure both light and dark `colorSchemes` are preserved

## 2. Migrate Theme Provider

- [x] 2.1 Update `theme-provider.tsx` — replace `Experimental_CssVarsProvider` with `ThemeProvider`
- [x] 2.2 Update `AppRouterCacheProvider` import from `v14-appRouter` to `v15-appRouter`

## 3. Migrate Color Scheme Script

- [x] 3.1 Update `color-scheme-script.ts` — replace `getInitColorSchemeScript` with `InitColorSchemeScript` component export
- [x] 3.2 Update `app/layout.tsx` — use `<InitColorSchemeScript />` component instead of the function result

## 4. Verify

- [x] 4.1 Build admin app (`pnpm --filter thaieconomap-admin build`)
- [x] 4.2 Verify no MUI deprecation warnings in console
