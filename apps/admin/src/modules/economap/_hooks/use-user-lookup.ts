import type { ManagerItem } from 'src/modules/manager/types';

import { useMemo } from 'react';
import { useGetManagers } from 'src/modules/manager/_hooks/use-get-manager';

// ----------------------------------------------------------------------

export type UserLookupMap = Map<string, ManagerItem>;

export function useUserLookup(): UserLookupMap {
  const { data: managers } = useGetManagers();

  return useMemo(() => {
    const map = new Map<string, ManagerItem>();

    if (managers) {
      managers.forEach((manager) => {
        map.set(manager._id, manager);
      });
    }

    return map;
  }, [managers]);
}

export function getUserDisplayName(userLookup: UserLookupMap, userId?: string): string {
  if (!userId) return '-';

  const user = userLookup.get(userId);

  return user?.displayName || user?.name || '-';
}

export function getUserRole(userLookup: UserLookupMap, userId?: string): string {
  if (!userId) return '';

  const user = userLookup.get(userId);

  return user?.roles?.TEC || '-';
}
