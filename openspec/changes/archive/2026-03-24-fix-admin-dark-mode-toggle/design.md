## Context

The admin web uses MUI v7 with CSS variables theme support. The theme system has two layers of state:

1. **MUI internal mode** — managed by `useColorScheme()` hook, stored in localStorage under `theme-mode` key, controls which CSS color scheme variables are active
2. **Settings context** — managed by `SettingsProvider`, stored in localStorage under `app-settings` key, used to pass `colorScheme` into `createTheme()` and `ThemeProvider`

The current implementation passes `settings.colorScheme` as both:
- `defaultColorScheme` in the theme object (via `createTheme`)
- `defaultMode` on the `MuiThemeProvider` component

When the toggle fires, it calls both `settings.onUpdateField('colorScheme', newMode)` and `setMode(newMode)`. The settings update triggers a re-render of `ThemeProvider`, which recreates the theme. The problem is that `defaultMode` is meant to be a static initial value — changing it on re-renders can cause MUI to reinitialize its internal mode state, overriding the `setMode()` call. Additionally, passing a dynamic `defaultColorScheme` into the theme object creates a circular dependency: the theme is recreated to reflect the new mode, but the recreation process itself may reset the mode.

## Goals / Non-Goals

**Goals:**
- Make the dark mode toggle work reliably in the admin web
- Keep theme mode in sync between MUI's internal state and the settings context
- Ensure theme persists correctly across page refreshes
- Maintain a single source of truth for the current color scheme

**Non-Goals:**
- Redesigning the entire settings system
- Adding system/auto color scheme detection
- Changing the settings drawer or other theme customization features

## Decisions

### Decision 1: Use static `defaultMode` on ThemeProvider

**Choice:** Set `defaultMode` to the static `schemeConfig.defaultMode` ('light') instead of `settings.colorScheme`.

**Rationale:** MUI's `defaultMode` is designed as an initial/fallback value, not a reactive prop. MUI reads the stored mode from `theme-mode` localStorage key on mount. Passing a dynamic value causes conflicts with MUI's internal state management.

**Alternative considered:** Removing `defaultMode` entirely — rejected because MUI needs a fallback when no stored value exists.

### Decision 2: Remove `defaultColorScheme` from theme creation

**Choice:** Remove `defaultColorScheme: settings.colorScheme` from the theme object in `createTheme()`.

**Rationale:** When `colorSchemes` (with both `light` and `dark`) is provided along with `cssVariables`, MUI automatically supports both schemes. The active scheme is controlled by MUI's internal mode state (via `useColorScheme`), not by `defaultColorScheme`. Setting `defaultColorScheme` dynamically on every re-render conflicts with MUI's own mode tracking.

**Alternative considered:** Keeping `defaultColorScheme` as a static `'light'` — viable but unnecessary since MUI defaults to `'light'` when both schemes are defined.

### Decision 3: Let MUI be the single source of truth for active mode

**Choice:** MUI's `useColorScheme()` hook manages the active mode. The settings context stores the preference for persistence/server-side detection but does not drive the `ThemeProvider` props.

**Rationale:** MUI already handles mode storage (via `modeStorageKey`), CSS variable switching, and `InitColorSchemeScript` for flash prevention. The settings context should mirror this state for app-level features but not compete with it.

## Risks / Trade-offs

- **[Risk] Settings context and MUI mode diverge** → The toggle handler already updates both. On page load, `InitColorSchemeScript` sets the correct mode from `theme-mode` localStorage before React hydrates, preventing flash. Settings context loads from `app-settings` localStorage independently. Both should converge to the same value.
- **[Risk] Server-side rendering uses stale colorScheme** → `detectSettings()` reads from cookies. This only affects initial HTML — `InitColorSchemeScript` corrects it before paint. Low risk for admin app.
