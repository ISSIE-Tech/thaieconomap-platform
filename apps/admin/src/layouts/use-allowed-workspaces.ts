import { useMemo } from 'react';

import { useAuthContext } from 'src/auth/hooks';

import { _workspaces, workspace as workspaceId } from './config-nav-workspace';

/** a workspace is offered only when the gateway granted a role for that service */
export function useAllowedWorkspaces() {
  const { user } = useAuthContext();

  const roles = user?.roles;

  return useMemo(() => {
    const allowed = _workspaces.filter((item) =>
      item.id === workspaceId.csc ? !!roles?.CSC : !!roles?.TEC
    );

    // while the profile is still loading, fall back to the full list
    return allowed.length ? allowed : _workspaces;
  }, [roles?.CSC, roles?.TEC]);
}
