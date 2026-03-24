## Context

The admin app uses the Minimals template with a settings system that supports dark mode toggle. The theme provider uses `Experimental_CssVarsProvider` and `extendTheme`, both deprecated in MUI v7. The frontend app was already migrated but the admin app was not because it has additional complexity (settings drawer, DarkModeButton, cookie-based persistence).

## Goals / Non-Goals

**Goals:**
- Make dark mode toggle functional again
- Migrate to MUI v7's supported theme APIs
- Preserve existing settings persistence (localStorage/cookies)

**Non-Goals:**
- Changing the settings drawer UI
- Modifying the dark mode toggle behavior
- Changing storage mechanism

## Decisions

### 1. Replace `extendTheme` with `createTheme` + `cssVariables`

MUI v7's `createTheme` supports CSS variables natively when `cssVariables` option is provided. The `colorSchemes` config is the same format, so the migration is straightforward.

### 2. Replace `Experimental_CssVarsProvider` with `ThemeProvider`

MUI v7's `ThemeProvider` handles CSS variables automatically when the theme has `cssVariables` enabled. The `defaultMode` and `modeStorageKey` props work the same way.

### 3. Replace `getInitColorSchemeScript` with `<InitColorSchemeScript />`

The function was deprecated in favor of a React component with the same props.

### 4. Update AppRouterCacheProvider to v15

The admin app is on Next.js 15 but still imports from `@mui/material-nextjs/v14-appRouter`.

## Risks / Trade-offs

- **`useColorScheme()` compatibility** — The hook works with both the old and new provider. The `DarkModeButton` and `SettingsDrawer` use this hook and should work without changes. → Verify after migration.
