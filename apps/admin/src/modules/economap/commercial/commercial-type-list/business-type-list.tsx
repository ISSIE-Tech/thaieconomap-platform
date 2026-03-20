'use client';

import BaseTypeList from './components/base-type-list';
import { useGetBusinessTypes } from '../_hooks/use-get-business-types';
import { useCreateBusinessType } from '../_hooks/use-create-business-types';
import { useDeleteBusinessType } from '../_hooks/use-delete-business-types';

// ----------------------------------------------------------------------

export function BusinessTypeList() {
  const { data: businessTypes } = useGetBusinessTypes();

  const { mutateAsync: createMutation, isPending: createPending } = useCreateBusinessType();

  const { mutateAsync: deleteMutation, isPending: deletePending } = useDeleteBusinessType();

  const data = {
    commercialTypes: businessTypes,
    label: 'ประเภทธุรกิจ',
    create: {
      mutation: createMutation,
      isPending: createPending,
    },
    delete: {
      mutation: deleteMutation,
      isPending: deletePending,
    },
  };

  return <BaseTypeList data={data} />;
}
