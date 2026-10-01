// Plain sx objects (no 'use client') so server layouts can use them.

/** Mobile: stacked column. Desktop (md+): 420px sidebar | map. */
export const mapScreenSx = {
  flexGrow: 1,
  minHeight: 0,
  display: { xs: 'flex', md: 'grid' },
  flexDirection: 'column',
  gridTemplateColumns: { md: '420px minmax(0, 1fr)' },
  gridTemplateRows: { md: 'minmax(0, 1fr)' },
} as const;

export const desktopOnly = { display: { xs: 'none', md: 'block' }, minHeight: 0 } as const;

export const mobileOnly = { display: { md: 'none' } } as const;
