'use client';

import { useMemo, useEffect } from 'react';
import { varAlpha, stylesMode } from 'src/theme/styles';

import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import type { Theme, SxProps, CSSObject, Breakpoint } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { bulletColor } from 'src/components/nav-section';
import type { SettingsState } from 'src/components/settings';
import { useSettingsContext } from 'src/components/settings';
import type { NavSectionProps } from 'src/components/nav-section';

import { useAuthContext } from 'src/auth/hooks';

import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';
import { navConfig, filterNavByRole } from '../config-nav-dashboard';
import { _workspaces, workspace as workspaceId } from '../config-nav-workspace';
import { useAllowedWorkspaces } from '../use-allowed-workspaces';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  data?: {
    nav?: NavSectionProps['data'];
  };
};

export function DashboardLayout({ sx, children, data }: DashboardLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const { workspace } = settings;

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery: Breakpoint = 'lg';

  // role is per service on the gateway user: TEC (mapped to user.role) or CSC
  const userRole = (workspace.id === workspaceId.csc ? user?.roles?.CSC : user?.role) ?? '';

  const allowedWorkspaces = useAllowedWorkspaces();

  // deep links / refresh: keep the workspace (and its nav) in sync with the URL
  const pathname = usePathname();
  const router = useRouter();
  const urlWorkspace = _workspaces.find(
    (item) => (item.id === workspaceId.csc) === pathname.startsWith(paths.csc.dashboard.root)
  );

  useEffect(() => {
    if (urlWorkspace && urlWorkspace.id !== workspace.id && !pathname.startsWith(paths.user.dashboard.root)) {
      settings.onUpdateField('workspace', urlWorkspace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlWorkspace?.id]);

  // a stored workspace the user has no role for (or a CSC-only user landing on the
  // thaieconomap default) would otherwise render an empty nav
  useEffect(() => {
    if (!allowedWorkspaces.some((item) => item.id === workspace.id)) {
      settings.onUpdateField('workspace', allowedWorkspaces[0]);
      router.replace(allowedWorkspaces[0].home);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedWorkspaces, workspace.id]);

  const navData = useMemo(
    () => filterNavByRole(navConfig[workspace.id], userRole),
    [workspace.id, userRole]
  );

  const isNavMini = settings.navLayout === 'mini';

  return (
    <>
      <NavMobile
        data={navData}
        open={mobileNavOpen.value}
        onClose={mobileNavOpen.onFalse}
        cssVars={navColorVars.section}
      />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            disableElevation
            onOpenNav={mobileNavOpen.onTrue}
            data={{ nav: navData, workspaces: allowedWorkspaces }}
            slotsDisplay={{
              signIn: false,
              purchase: false,
              helpLink: false,
            }}
            slots={{
              topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                  This is an info Alert.
                </Alert>
              ),
            }}
            slotProps={{
              toolbar: {
                sx: {
                  [`& [data-slot="logo"]`]: {
                    display: 'none',
                  },
                  [`& [data-area="right"]`]: {
                    gap: { xs: 0, sm: 0.75 },
                  },
                },
              },
              container: {
                maxWidth: false,
                sx: {
                  px: { [layoutQuery]: 5 },
                },
              },
            }}
          />
        }
        /** **************************************
         * Sidebar
         *************************************** */
        sidebarSection={
          <NavVertical
            data={navData}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navColorVars.section}
            onToggleNav={() =>
              settings.onUpdateField(
                'navLayout',
                settings.navLayout === 'vertical' ? 'mini' : 'vertical'
              )
            }
          />
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={null}
        /** **************************************
         * Style
         *************************************** */
        cssVars={{
          ...navColorVars.layout,
          '--layout-transition-easing': 'linear',
          '--layout-transition-duration': '120ms',
          '--layout-nav-mini-width': '88px',
          '--layout-nav-vertical-width': '300px',
          '--layout-nav-horizontal-height': '64px',
          '--layout-dashboard-content-pt': theme.spacing(1),
          '--layout-dashboard-content-pb': theme.spacing(8),
          '--layout-dashboard-content-px': theme.spacing(5),
        }}
        sx={{
          [`& .${layoutClasses.hasSidebar}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
            },
          },
          ...sx,
        }}
      >
        <Main>{children}</Main>
      </LayoutSection>
    </>
  );
}

// ----------------------------------------------------------------------

function useNavColorVars(
  theme: Theme,
  settings: SettingsState
): Record<'layout' | 'section', CSSObject> {
  const {
    vars: { palette },
  } = theme;

  return useMemo(() => {
    switch (settings.navColor) {
      case 'integrate':
        return {
          layout: {
            '--layout-nav-bg': palette.background.default,
            '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.8),
            '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.12),
            '--layout-nav-text-primary-color': palette.text.primary,
            '--layout-nav-text-secondary-color': palette.text.secondary,
            '--layout-nav-text-disabled-color': palette.text.disabled,
            [stylesMode.dark]: {
              '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.08),
              '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.96),
            },
          },
          section: {},
        };
      case 'apparent':
        return {
          layout: {
            '--layout-nav-bg': palette.grey[900],
            '--layout-nav-horizontal-bg': varAlpha(palette.grey['900Channel'], 0.96),
            '--layout-nav-border-color': 'transparent',
            '--layout-nav-text-primary-color': palette.common.white,
            '--layout-nav-text-secondary-color': palette.grey[500],
            '--layout-nav-text-disabled-color': palette.grey[600],
            [stylesMode.dark]: {
              '--layout-nav-bg': palette.grey[800],
              '--layout-nav-horizontal-bg': varAlpha(palette.grey['800Channel'], 0.8),
            },
          },
          section: {
            // caption
            '--nav-item-caption-color': palette.grey[600],
            // subheader
            '--nav-subheader-color': palette.grey[600],
            '--nav-subheader-hover-color': palette.common.white,
            // item
            '--nav-item-color': palette.grey[500],
            '--nav-item-root-active-color': palette.primary.light,
            '--nav-item-root-open-color': palette.common.white,
            // bullet
            '--nav-bullet-light-color': bulletColor.dark,
            // sub
            ...(settings.navLayout === 'vertical' && {
              '--nav-item-sub-active-color': palette.common.white,
              '--nav-item-sub-open-color': palette.common.white,
            }),
          },
        };
      default:
        throw new Error(`Invalid color: ${settings.navColor}`);
    }
  }, [
    palette.background.default,
    palette.background.defaultChannel,
    palette.common.white,
    palette.grey,
    palette.primary.light,
    palette.text.disabled,
    palette.text.primary,
    palette.text.secondary,
    settings.navColor,
    settings.navLayout,
  ]);
}
