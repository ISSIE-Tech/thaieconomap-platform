import type { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/** md+ gets the desktop layout (top nav + map sidebar) instead of drawers. */
export const useIsDesktop = () => useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
