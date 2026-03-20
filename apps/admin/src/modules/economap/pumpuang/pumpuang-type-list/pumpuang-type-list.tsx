'use client';

import { useGetPumpuangTypes } from '../_hooks/use-get-pumpuang-types';
import { useCreatePumpuangType } from '../_hooks/use-create-pumpuang-type';
import { useDeletePumpuangType } from '../_hooks/use-delete-puampuang-type';
import BaseTypeList from '../../commercial/commercial-type-list/components/base-type-list';

export default function PumpuangTypeList() {
  const pumpuangTypes = useGetPumpuangTypes();

  const createPumpuangType = useCreatePumpuangType();

  const deletePumpuangType = useDeletePumpuangType();

  const data = {
    label: 'ประเภทรถพุ่มพวง',
    commercialTypes: pumpuangTypes.data,
    create: {
      mutation: createPumpuangType.mutateAsync,
      isPending: createPumpuangType.isPending,
    },
    delete: {
      mutation: deletePumpuangType.mutateAsync,
      isPending: deletePumpuangType.isPending,
    },
  };

  return <BaseTypeList data={data} />;
}
