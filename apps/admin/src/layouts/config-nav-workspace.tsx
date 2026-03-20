import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export enum workspace {
  economap = 'economap',
  csc = 'chial-share-carrier',
}

export type Workspace = {
  id: workspace;
  name: string;
  logo: string;
};

export const _workspaces: Workspace[] = [
  {
    id: workspace.economap,
    name: 'Thai Economap',
    logo: `${CONFIG.site.basePath}/logo/mini-logo.svg`,
  },
  {
    id: workspace.csc,
    name: 'Chial Share Carrier',
    logo: `${CONFIG.site.basePath}/logo/chialshare.svg`,
  },
];
