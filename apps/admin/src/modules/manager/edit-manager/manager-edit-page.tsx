'use client';

import React, { useMemo } from 'react';

import { useGetManagers } from '../_hooks/use-get-manager';
import ManagerEditForm from './components/manager-edit-form';

type Props = {
  managerId: string;
};

export function ManagerEditPage({ managerId }: Props) {
  const { data: allManagers } = useGetManagers();

  const manager = useMemo(
    () => allManagers?.find((item) => item._id === managerId),
    [allManagers, managerId]
  );

  const defaultValues = useMemo(
    () => ({
      name: manager?.name || '',
      phone: manager?.phone || '',
      role: manager?.roles.TEC || '',
      districts: manager?.districts.map((district) => district._id) || [],
    }),
    [manager]
  );

  return (
    <>
      {defaultValues && manager && (
        <ManagerEditForm defaultValues={defaultValues} manager={manager} />
      )}
    </>
  );
}
