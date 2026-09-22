import { CONFIG } from 'src/config-global';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export enum workspace {
  economap = 'economap',
  csc = 'chial-share-carrier',
}

export type Workspace = {
  id: workspace;
  name: string;
  logo: string;
  home: string;
};

export const _workspaces: Workspace[] = [
  {
    id: workspace.economap,
    name: 'Thai Economap',
    logo: `${CONFIG.site.basePath}/logo/mini-logo.svg`,
    home: paths.commercial.dashboard.root,
  },
  {
    id: workspace.csc,
    name: 'Chial Share Carrier',
    logo: `${CONFIG.site.basePath}/logo/chialshare.svg`,
    home: paths.csc.dashboard.root,
  },
];
